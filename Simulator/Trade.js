// worker thread file

let NumberOfBuyers, NumberOfSellers;
let Buyers = [];
let Sellers = [];
let Transactions = 0;

self.importScripts("Buyer.js?5", "Seller.js?9");

// buyer and seller attempt to do a transction
function Trade(Rounds, HowToChooseSeller) {

    for (let Round = 0; Round < Rounds; Round++) {
        Buyers.forEach(buyer => {
            let seller;
            if (HowToChooseSeller == "Randomly") {
                seller = GetRandomSeller();
            } else {
                seller = Sellers.filter(seller => !seller.MadeSale).sort((a, b) => a.Price - b.Price)[0];
            }

            if (seller == undefined) return;

            if (seller.Price <= buyer.MaximumPayable) {
                // successful transaction
                buyer.CompleteTransaction(true, seller.Price);
                seller.CompleteTransaction(true);

                Transactions++;

            } else {
                // transaction not successful
                seller.CompleteTransaction(false);
                buyer.CompleteTransaction(false);
            }
        });

        Sellers.forEach(seller => {
            seller.AdjustPrice(); //if the seller was not visited, adjust price downwards
            seller.MadeSale = false; // reset for next round
            seller.SummedPrices += seller.Price;
        });
    }
}

function GetRandomSeller() {
    let RandomSeller = Math.round(Math.random() * (Sellers.length - 1));
    return Sellers[RandomSeller];
}

/*
function GetRandomSeller() {
    SellersLeft = Sellers.filter(seller => !seller.MadeSale);
    let RandomSeller = Math.round(Math.random() * (SellersLeft.length - 1));
    return SellersLeft[RandomSeller];
}*/


function CreateTraders(NumberOfBuyers, NumberOfSellers) {
    for (let i = 0; i < NumberOfBuyers; i++) Buyers.push(new Buyer);
    for (let i = 0; i < NumberOfSellers; i++) Sellers.push(new Seller);
}

onmessage = function (e) {
    const NumberOfBuyers = e.data.NumberOfBuyers;
    const NumberOfSellers = e.data.NumberOfSellers;
    const HowToChooseSeller = e.data.HowToChooseSeller;
    const RoundsOfTrading = e.data.RoundsOfTrading;

    CreateTraders(NumberOfBuyers, NumberOfSellers)

    Trade(RoundsOfTrading, HowToChooseSeller);

    postMessage({
        Sellers: Sellers,
        Buyers: Buyers,
        Transactions: Transactions
    });
}