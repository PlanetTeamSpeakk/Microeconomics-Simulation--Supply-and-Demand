const RunSimulationBtn = document.getElementById("RunSimulationBtn");
const NoOfBuyersInput = document.getElementById("NoOfBuyersInput");
const NoOfSellersInput = document.getElementById("NoOfSellersInput");
const RoundsOfTradingInput = document.getElementById("RoundsOfTradingInput");
const OutputDiv = document.getElementById("OutputDiv");
const BuyersTbody = document.getElementById("BuyersTbody");
const SellersTbody = document.getElementById("SellersTbody");
const MetaTbody = document.getElementById("MetaTbody");
const BuyersDisplayFilter = document.getElementById("BuyersDisplayFilter");
const SellersDisplayFilter = document.getElementById("SellersDisplayFilter");
const HowBuyerChoosesSellerInput = document.getElementById("HowBuyerChoosesSellerInput");
const StatsTbody = document.getElementById("StatsTbody");
const OutputDivStatus = document.getElementById("OutputDivStatus");
const OutputDivData = document.getElementById("OutputDivData");
const SellersChartCanvas = document.getElementById("SellersChartCanvas");
const SellersPriceHistoryCanvas = document.getElementById("SellersPriceHistoryCanvas");
const BuyersChartCanvas = document.getElementById("BuyersChartCanvas");
const DisplayChartSelect = document.getElementById("DisplayChartSelect");
const startingPriceInput = document.getElementById("startingPriceInput");
const keepSellersAndBuyersCheckbox = document.getElementById("keepSellersAndBuyersCheckbox");
const ExciseInput = document.getElementById("ExciseInput");
const MinimumPriceInput = document.getElementById("MinimumPriceInput");
const SupplyShockInput = document.getElementById("SupplyShockInput");
const FactorInput = document.getElementById("FactorInput");
const RecoveryTimeInput = document.getElementById("RecoveryTimeInput");
const test = document.getElementById("test");


function GetNumberOfBuyers() {
    let Default = 50;
    let NoOfBuyers = parseInt(document.getElementById("NoOfBuyersInput").value);

    if (NoOfBuyers < 1 || isNaN(NoOfBuyers)) {
        NoOfBuyersInput.value = Default;
        return Default;
    } else {
        return NoOfBuyers;
    }
}

function GetNumberOfSellers() {
    let Default = 50;
    let NoOfSellers = parseInt(document.getElementById("NoOfSellersInput").value);

    if (NoOfSellers < 1 || isNaN(NoOfSellers)) {
        NoOfSellersInput.value = Default;
        return Default;
    } else {
        return NoOfSellers;
    }
}

function GetNumberOfTradingRounds() {
    let Default = 1000;
    let NoOfRounds = parseInt(document.getElementById("RoundsOfTradingInput").value);

    if (NoOfRounds < 1 || isNaN(NoOfRounds)) {
        RoundsOfTradingInput.value = Default;
        return Default;
    } else {
        return NoOfRounds;
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function HowToChooseSeller() {
    return HowBuyerChoosesSellerInput.value;
}

function getStartingPrice() {
    let Default = 60;
    let startingPrice = parseInt(startingPriceInput.value);

    if (startingPrice < 0 || isNaN(startingPrice)) {
        startingPriceInput.value = Default;
        return Default;
    } else {
        return startingPrice;
    }
}

function getEventValues() {
    return {
        Excise: getIntValue(ExciseInput, 0),
        MinimumPrice: getIntValue(MinimumPriceInput, 0),
        SupplyShock: getIntValue(SupplyShockInput, 0),
        Factor: getIntValue(FactorInput, 0),
        RecoveryTime: getIntValue(RecoveryTimeInput, 0)
    };
}

function getIntValue(input, defaultValue) {
    let value = parseInt(input.value);

    if (value < 0 || isNaN(value)) {
        input.value = defaultValue;
        return defaultValue;
    } else {
        return value;
    }
}

function keepSellersAndBuyers() {
    return keepSellersAndBuyersCheckbox.checked;
}

function WhichChart() {
    return DisplayChartSelect.value;
}