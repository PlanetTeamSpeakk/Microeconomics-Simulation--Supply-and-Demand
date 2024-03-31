// worker thread file

let NumberOfBuyers, NumberOfSellers;
let Buyers = [];
let Sellers = [];
let SupplyShockSellers = [];
let Transactions = 0;
const startingPrice = 60;

// Market shock variables
let RecoverySchedule = [];
let RecoveryIterations = 100;
let RecoveryFactor = 1;


self.importScripts("Buyer.js", "Seller.js", "OutsideInfluence.js");

// buyer and seller attempt to do a transction
function Trade(Rounds, HowToChooseSeller) {
    for (let Round = 0; Round < Rounds; Round++) {
        if (Round == 500) SupplyShock();
        MarketIteration1(HowToChooseSeller);
    }
}

function SupplyShock() {

    let sliceIndex = 40; //Math.random() * Sellers.length;
    console.log(sliceIndex);
    SupplyShockSellers = Sellers.slice(0, sliceIndex);
    Sellers = Sellers.slice(sliceIndex);
    RecoverySchedule = MakeRecoverySchedule(RecoveryIterations, sliceIndex, RecoveryFactor);
    console.log(RecoverySchedule);
}

function MakeRecoverySchedule(i, a, t) {
    list = [];
    
    previousValue = 0;
    for (x = 0; x < i; x++) {
        value = a * Math.pow(((x + 1) / i), t)
        list.push(Math.round(value) - previousValue);
        previousValue = Math.round(value);
    }
    
    return list;
}

function governmentMinPrice() { 
    Sellers.forEach(seller => {
        seller.absoluteMinimumAcceptable = 70;
    });
}

function excise() { 
    Sellers.forEach(seller => {
        seller.MinimumAcceptable += 30;
    });
}


function MarketIteration1() {
    if (SupplyShockSellers.length > 0) Sellers = Sellers.concat(SupplyShockSellers.splice(0, RecoverySchedule.shift()));

    Sellers = Shuffle(Sellers);
    Shuffle(Buyers).forEach(buyer => {
        for (let i = 0; i < Sellers.length; i++) {
            let seller = Sellers[i];
            
            if (seller.MadeSale) continue;

            if (seller.Price <= buyer.expectedPrice) {
                // successful transaction
                buyer.CompleteTransaction(true, seller.Price);
                seller.CompleteTransaction(true);

                Transactions++;
                break;
            } else {
                // transaction not successful
                seller.CompleteTransaction(false);
                buyer.CompleteTransaction(false);
            }
        };
    });

    let SellerLeft = false;
    let highestPrice = 0;
    //let LowestPrice = Sellers.map(seller => seller.Price).reduce((a, b) => Math.min(a, b));
    
    Buyers.forEach(buyer => {
        buyer.AdjustExpectedPrice(); //if the seller was not visited, adjust price downwards
        if (buyer.expectedPrice > highestPrice) highestPrice = buyer.expectedPrice;
        buyer.MadePurchase = false; // reset for next round
        buyer.expectedPriceHistory.push(buyer.expectedPrice);
        //else buyer.expectedPriceHistory.push(null);
    });

    for (let i = 0; i < Sellers.length; i++) {
        let seller = Sellers[i];
        seller.AdjustPrice(); //if the seller was not visited, adjust price downwards
        seller.MadeSale = false; // reset for next round
        seller.SummedPrices += seller.Price;

        // Delete sellers who are out of market
        if (seller.MinimumAcceptable > highestPrice) {
            seller.PriceHistory.push(null);
        }
        else seller.PriceHistory.push(seller.Price);
    }

    SupplyShockSellers.forEach(seller => {
        seller.PriceHistory.push(null);
        seller.ProfitHistory.push(null);
        seller.TransactionsHistory.push(0);
    });
}

function Shuffle(list) {
    return list.slice().sort(() => Math.random() - 0.5);
}

function MarketIteration(HowToChooseSeller) {
    Shuffle(Buyers).forEach(buyer => {
        let seller;
        if (HowToChooseSeller == "Randomly") {
            seller = GetRandomSeller();
        } else {
            seller = Sellers.filter(seller => !seller.MadeSale).sort((a, b) => a.Price - b.Price)[0];
        }

        if (seller == undefined) return;

        if (seller.Price <= buyer.expectedPrice) {
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
    
    Buyers.forEach(buyer => {
        buyer.AdjustExpectedPrice(); //if the seller was not visited, adjust price downwards
        buyer.MadePurchase = false; // reset for next round
    });
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
    for (let i = 0; i < NumberOfBuyers; i++) Buyers.push(new Buyer(startingPrice));
    for (let i = 0; i < NumberOfSellers; i++) Sellers.push(new Seller(startingPrice));
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
