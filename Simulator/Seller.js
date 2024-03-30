class Seller {
    MinimumAcceptable; // the minimum price a seller can accept for the commodity (production cost)
    absoluteMinimumAcceptable = 0; // the minimum price a seller can accept for the commodity
    FirstPrice; // the price this seller entered the market with
    PriceHistory = []; // all prices the seller has posted since opening of market
    ProfitHistory = []; // all profits the seller has made since opening of market
    TransactionsHistory = []; // all transactions the seller has been involved in since opening of market
    Price; // current price the seller is posting
    SummedPrices = 0; // sum of all prices the seller has posted since opening of market 

    Transactions = 0;
    Revenue = 0; // total amount collected from sales
    Profit = 0; // revenue - production cost

    MadeSale = false; // whether a customer visited the seller

    // how much the seller will adjust price depending on how the market is
    PriceAdjustmentFactor = {
        Up: 0.5,
        Down: -0.5
    }

    constructor(price) {
        this.MinimumAcceptable = Seller.GetRandomCost();
        this.Price = price;
        this.FirstPrice = price;
        this.PriceHistory.push(this.Price);
    }

    AdjustPrice() {
        if (this.MadeSale) {
            this.ProfitHistory.push(this.Price - this.MinimumAcceptable);

            // price adjusted upwards if the previous transaction was successful
            this.Price += this.PriceAdjustmentFactor.Up;
            
            this.TransactionsHistory.push(1);
        } else {
            // price adjusted downwards if the previous transaction was not successful
            if (this.Price + this.PriceAdjustmentFactor.Down < this.absoluteMinimumAcceptable) this.Price = this.absoluteMinimumAcceptable;
            else if (this.Price + this.PriceAdjustmentFactor.Down < this.MinimumAcceptable) this.Price = this.MinimumAcceptable;
            else this.Price += this.PriceAdjustmentFactor.Down;

            this.ProfitHistory.push(null);
            this.TransactionsHistory.push(0);
        }
    }

    CompleteTransaction(SuccessfulSale) {
        if (SuccessfulSale) {
            this.Transactions++;
            this.Revenue += this.Price;
            this.Profit += this.Price - this.MinimumAcceptable; 
            this.MadeSale = true;
        }
    }

    static GetRandomPrice(ProductionCost) {
        return Math.round(ProductionCost * (1 + Math.random())); // selling price must be above cost
    }

    static GetRandomCost() {
        return Math.round(Math.random() * 100);
    }
}
