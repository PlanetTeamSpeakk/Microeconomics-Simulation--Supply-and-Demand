RunSimulationBtn.addEventListener("click", StartMarket);
BuyersDisplayFilter.addEventListener("change", DisplayOutput);
SellersDisplayFilter.addEventListener("change", DisplayOutput);
DisplayChartSelect.addEventListener("change", DisplayOutput);

var currentChart;
var SellerPriceHistoryChart;
var BuyersChartChart;

// show data about the market
function DisplayOutput() {

    Sellers.forEach(seller => {
        seller.Price = Math.round(seller.Price);
        seller.PriceAdjustmentFactor.Down = parseFloat(seller.PriceAdjustmentFactor.Down.toFixed(2));
    });

    let TotalSpent = 0;
    Buyers.forEach(buyer => TotalSpent += buyer.TotalSpent);

    let TotalProfit = 0;
    Sellers.forEach(seller => TotalProfit += seller.Profit);

    // display meta data
    MetaTbody.innerHTML = `
        <tr>
            <td>${numberWithCommas(RoundsOfTrading)}</td>
            <td>${numberWithCommas(NumberOfBuyers)}</td>
            <td>${numberWithCommas(NumberOfSellers)}</td>
            <td>${HowToChooseSeller() == "Randomly" ? "Randomly" : "Cheapest Price"}</td>
        </tr>
    `;
    // display stats
    StatsTbody.innerHTML = `
        <tr>
            <td>${numberWithCommas(Transactions)}</td>
            <td>${numberWithCommas(Math.round(TotalProfit * 100 / TotalSpent))}%</td>
            <td>${numberWithCommas(GetAverageFirstPrice())}</td>
            <td>${numberWithCommas(GetMedianFirstPrice())}</td>
            <td>${numberWithCommas(GetAveragePrice())}</td>
            <td>${numberWithCommas(GetMedianPrice())}</td>
        </tr>
    `;


    // display sellers
    SellersTbody.innerHTML = "";
    let SellersToDisplay = ChooseSellersToShow();
    MakeGraph();


    SellersToDisplay.forEach(seller => {
        SellersTbody.innerHTML += `
            <tr>
                <td>${seller.Position}</td>
                <td>${numberWithCommas(seller.MinimumAcceptable)}</td>
                <td>${numberWithCommas(seller.FirstPrice)}</td>
                <td>${numberWithCommas(seller.Price)}</td>
                <td>
                    ${numberWithCommas(Math.round(seller.SummedPrices / RoundsOfTrading))}
                </td>
                <td>${((seller.Transactions * 100 / Transactions) || 0).toFixed(2)}</td>
                <td>${numberWithCommas(Math.round(seller.Revenue))}</td>
                <td>${numberWithCommas(Math.round(seller.Profit))}</td>
            </tr>
        `;
    })


    // display buyers
    BuyersTbody.innerHTML = "";
    let BuyersToDisplay = ChooseBuyersToShow();
    BuyersToDisplay.forEach(buyer => {
        BuyersTbody.innerHTML += `
            <tr>
                <td>${buyer.Position}</td>
                <td>${numberWithCommas(buyer.MaximumPayable)}</td>
                <td>${((buyer.Transactions * 100 / Transactions) || 0).toFixed(2)}</td>
                <td>${numberWithCommas(Math.round(buyer.TotalSpent))}</td>
            </tr>
        `;
    })

}

function ChooseBuyersToShow() {
    let BuyersToDisplay = Buyers;

    BuyersToDisplay.sort((a, b) => b[BuyersDisplayFilter.value] - a[BuyersDisplayFilter.value]);

    for (let i = 0; i < BuyersToDisplay.length; i++) BuyersToDisplay[i].Position = i + 1; // give them positions

    if (Buyers.length > 10) {
        let FirstFive = Buyers.slice(0, 5);
        BuyersToDisplay = FirstFive;
        let LastFive = Buyers.slice(Buyers.length - 5);
        LastFive.forEach(item => BuyersToDisplay.push(item));
    }

    return BuyersToDisplay;
}

function ChooseSellersToShow() {
    let SellersToDisplay = Sellers;

    SellersToDisplay.sort((a, b) => b[SellersDisplayFilter.value] - a[SellersDisplayFilter.value]);

    for (let i = 0; i < SellersToDisplay.length; i++) SellersToDisplay[i].Position = i + 1; // give them positions

    if (Sellers.length > 10) {
        let FirstFive = Sellers.slice(0, 5);
        SellersToDisplay = FirstFive;
        let LastFive = Sellers.slice(Sellers.length - 5);
        LastFive.forEach(item => SellersToDisplay.push(item));
    }

    return SellersToDisplay;
}

function MakeGraph() {

    let Highest = Sellers[0][SellersDisplayFilter.value];

    let Width = Math.ceil(Highest / 40);
    
    let CategoryNames = [];
    let CategoriesData = [];

    for (let i = 0; i < 40; i++) CategoriesData.push(0);

    let Category = 0;
    for (let i = 0; i < Highest; i += Width) {
        Sellers.forEach(seller => {
            if (seller[SellersDisplayFilter.value] >= i && seller[SellersDisplayFilter.value] < (i + Width)) CategoriesData[Category]++;
        });
        CategoryNames.push(`${i} - ${i + Width}`);
        Category++;
    }

    SellersChartCanvas.width = screen.width * 0.8;
    SellersChartCanvas.height = screen.height * 0.7;

    SellersPriceHistoryCanvas.width = screen.width * 0.8;
    SellersPriceHistoryCanvas.height = screen.height * 0.7;

    BuyersChartCanvas.width = screen.width * 0.8;
    BuyersChartCanvas.height = screen.height * 0.7;

    let ctx = SellersChartCanvas;
    let ctx2 = SellersPriceHistoryCanvas;
    let ctx3 = BuyersChartCanvas;

    let colors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ];

    let shades = [
        'rgba(140, 140, 140, 1)',
        'rgba(160, 160, 160, 1)',
        'rgba(180, 180, 180, 1)',
        'rgba(200, 200, 200, 1)',
    ];

    if (currentChart) currentChart.destroy();
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: CategoryNames,
            datasets: [{
                label: 'Sellers',
                data: CategoriesData,
                backgroundColor: 'rgba(255, 99, 132, 1)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            responsive: false
        }
    });

    // display custom charts
    let sellerPriceHistoryLines;
    let buyerPriceHistoryLines;
    let labely = "Price";

    if (WhichChart() == "PriceHistory") {
        labely = "Price";

        sellerPriceHistoryLines = Sellers.map(seller => {
            return {
                label: `Seller ${seller.Position}`,
                data: seller.PriceHistory,
                fill: false,
                borderColor: shades[seller.Position  % colors.length],
                tension: 0.1
            }
        });
        sellerPriceHistoryLines.unshift({
            label: "Average",
            data: sellerPriceHistoryLines[0].data.map((_, i) => {
                let Total = 0;
                sellerPriceHistoryLines.forEach(line => Total += line.data[i]);
                return Total / sellerPriceHistoryLines.filter(line => line.data[i] != null).length;
            }),
            fill: false,
            borderColor: 'rgba(255, 0, 0, 1)',
            tension: 0.1
        });

        buyerPriceHistoryLines = Buyers.map(buyer => {
            return {
                label: `Buyer ${buyer.Position}`,
                data: buyer.expectedPriceHistory,
                fill: false,
                borderColor: shades[buyer.Position  % colors.length],
                tension: 0.1
            }
        });
        buyerPriceHistoryLines.unshift({
            label: "Average",
            data: buyerPriceHistoryLines[0].data.map((_, i) => {
                let Total = 0;
                buyerPriceHistoryLines.forEach(line => Total += line.data[i]);
                return Total / buyerPriceHistoryLines.filter(line => line.data[i] != null).length;
            }),
            fill: false,
            borderColor: 'rgba(0, 0, 255, 1)',
            tension: 0.1
        });
    }
    else if (WhichChart() == "ProfitHistory") {
        labely = "Profit";

        sellerPriceHistoryLines = [{
            label: "Total Surplus Sellers",
            data: Array.from(Array(RoundsOfTrading).keys()).map(i => {
                let Total = 0;
                Sellers.forEach(seller => Total += seller.ProfitHistory[i]);
                return Total;
            }),
            fill: false,
            borderColor: 'rgba(255, 0, 0, 1)',
            tension: 0.1
        }];

        buyerPriceHistoryLines = [{
            label: "Total Surplus Buyers",
            data: Array.from(Array(RoundsOfTrading).keys()).map(i => {
                let Total = 0;
                Buyers.forEach(buyer => Total += buyer.SurplusHistory[i]);
                return Total;
            }),
            fill: false,
            borderColor: 'rgba(0, 0, 255, 1)',
            tension: 0.1
        }];
    }
    else if (WhichChart() == "TotalProfitHistory") {
        labely = "Profit";
        let TotalProfit = 0;
        sellerPriceHistoryLines = [{
            label: "Total Surplus Sellers",
            data: Array.from(Array(RoundsOfTrading).keys()).map(i => {
                let Total = 0;
                Sellers.forEach(seller => Total += seller.ProfitHistory[i]);
                return Total;
            }).map(i => {
                TotalProfit += i;
                return TotalProfit;
            }),
            fill: false,
            borderColor: 'rgba(255, 0, 0, 1)',
            tension: 0.1
        }];

        let TotalSurplus = 0;

        buyerPriceHistoryLines = [{
            label: "Total Surplus Buyers",
            data: Array.from(Array(RoundsOfTrading).keys()).map(i => {
                let Total = 0;
                Buyers.forEach(buyer => Total += buyer.SurplusHistory[i]);
                return Total;
            }).map(i => {
                TotalSurplus += i;
                return TotalSurplus;
            }),
            fill: false,
            borderColor: 'rgba(0, 0, 255, 1)',
            tension: 0.1,
        }];
    }
    else if (WhichChart() == "TransactionHistory") { 
        labely = "Transactions";
        let TotalTransactions = 0;
    
        sellerPriceHistoryLines = [{
            label: "Total Transactions",
            data: Array.from(Array(RoundsOfTrading).keys()).map(i => {
                let Total = 0;
                Sellers.forEach(seller => Total += seller.TransactionsHistory[i]);
                return Total;
            }).map(i => {
                TotalTransactions += i;
                return TotalTransactions;
            }),
            fill: false,
            borderColor: 'rgba(255, 0, 0, 1)',
            tension: 0.1
        }];

        console.log(Sellers);

        buyerPriceHistoryLines = [];
    }


    if (SellerPriceHistoryChart) SellerPriceHistoryChart.destroy();
    SellerPriceHistoryChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: Array.from(Array(RoundsOfTrading).keys()),
            datasets: sellerPriceHistoryLines
        },
        options: {
            elements : {
                point: {
                    pointStyle: false
                }
            },
            scales: {
                y: {
                    ticks: {
                        maxTicksLimit: 20,
                        font: {
                            size: 25
                        }
                    },
                    title: {
                        text: labely,
                        display: true,
                        font: {
                            size: 25
                        }
                    }
                },
                x: {
                    ticks: {
                        maxTicksLimit: 20,
                        font: {
                            size: 25
                        }
                    },
                    title: {
                        text: "Iterations",
                        display: true,
                        font: {
                            size: 25
                        }
                    }
                }
            },
            legend: {
                display: false
            },
            plugins: {
                legend: false
            },
            responsive: false
        }
    });

    if (BuyersChartChart) BuyersChartChart.destroy();
    BuyersChartChart = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: Array.from(Array(RoundsOfTrading).keys()),
            datasets: buyerPriceHistoryLines
        },
        options: {
            elements : {
                point: {
                    pointStyle: false
                }
            },
            scales: {
                y: {
                    ticks: {
                        maxTicksLimit: 20,
                        font: {
                            size: 25
                        }
                    },
                    title: {
                        text: labely,
                        display: true,
                        font: {
                            size: 25
                        }
                    }
                },
                x: {
                    ticks: {
                        maxTicksLimit: 20,
                        font: {
                            size: 25
                        }
                    },
                    title: {
                        text: "Iterations",
                        display: true,
                        font: {
                            size: 25
                        }
                    }
                }
            },
            plugins: {
                legend: false
            },
            legend: {
                display: false
            },
            responsive: false
        }
    });
}
