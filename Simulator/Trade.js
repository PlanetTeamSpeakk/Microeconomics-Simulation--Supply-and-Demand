// worker thread file

let NumberOfBuyers, NumberOfSellers;
let Buyers = [];
let Sellers = [];
let Transactions = 0;
const startingPrice = 15;

self.importScripts("Buyer.js", "Seller.js", "OutsideInfluence.js");

// buyer and seller attempt to do a transction
function Trade(Rounds, HowToChooseSeller) {
    for (let Round = 0; Round < Rounds; Round++) {
        MarketIteration1(HowToChooseSeller);
    }
}

function MarketIteration1() {
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
