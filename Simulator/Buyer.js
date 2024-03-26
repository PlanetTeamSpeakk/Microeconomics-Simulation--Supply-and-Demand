// Description: This file contains the Buyer class which represents a buyer in the market.

const absoluteMaximumPayable = 100; // the maximum price a buyer can pay for the commodity

class Buyer {
    MaximumPayable; // the maximum price a buyer can pay for the commodity
    expectedPrice; // the price the buyer expects to pay for the commodity
    expectedPriceHistory = []; // all prices the buyer has expected to pay since opening of market

    Transactions = 0; // number of transctions it is involved in
    TotalSpent = 0; // total amount spent on buying commodities from sellers

    MadePurchase = false; // whether the buyer has made a purchase

    // how much the seller will adjust price depending on how the market is
    PriceAdjustmentFactor = {
        Up: 1,
        Down: -1
    }

    constructor(price) {
        this.MaximumPayable = Buyer.GetRandomAmount();
        
        if (price > this.MaximumPayable) this.expectedPrice = this.MaximumPayable;
        else this.expectedPrice = price;

        this.expectedPriceHistory.push(this.expectedPrice);
    }

    CompleteTransaction(SuccessfulSale, Price) {
        if (SuccessfulSale) {
            this.Transactions++;
            this.TotalSpent += Price;
            this.MadePurchase = true;
        }
    }

    AdjustExpectedPrice() {
        if (this.MadePurchase) {
            // price adjusted downwards if the previous transaction was successful
            this.expectedPrice += this.PriceAdjustmentFactor.Down;
        } else {
            // price adjusted upwards if the previous transaction was not successful
            if (this.expectedPrice + this.PriceAdjustmentFactor.Up > this.MaximumPayable) this.expectedPrice = this.MaximumPayable;
            else this.expectedPrice += this.PriceAdjustmentFactor.Up;
        }
        this.expectedPriceHistory.push(this.expectedPrice);
    }

    static GetRandomAmount() {
        return Math.round(Math.random() * absoluteMaximumPayable);
    }
}