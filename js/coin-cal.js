var currentPriceOfCoinSelected;

window.onload = function () {
    fetchData();
    inputPastDate.max = new Date().toISOString().split("T")[0];
    $("#selectCoin").select2();
    $("#selectedCoin").select2();
    $("#marketCapCoin").select2();
}

function returnWorth() {
    var currency = document.querySelector(".selectCoin").value;
    var nf = Intl.NumberFormat();
    if (currency != "") {
        var investedAmount = document.getElementById("inputInvestAmount").value;
        var desiredAmount = document.getElementById("inputDesiredAmount").value;
        var coinValueinUSD = 0;
        var pnl = 0;
        var url = 'https://api.coingecko.com/api/v3/simple/price?ids=' + currency + '&vs_currencies=usd';
        var request = new XMLHttpRequest()
        request.open('GET', url, true)
        request.onload = function () {
            var data = JSON.parse(this.response);
            coinValueinUSD = data[currency]["usd"];
            var NetWorthAmount = new Number((investedAmount / coinValueinUSD) * desiredAmount);
            document.getElementById("displayNetWorthAmount").value = NetWorthAmount;
            pnl = NetWorthAmount - investedAmount;
            if (pnl > 0) {
                document.getElementById("pnlAmount").style.color = "green";
                document.getElementById("pnlAmount").innerHTML = "Profit($): " +  nf.format(pnl);
            }
            if (pnl < 0) {
                document.getElementById("pnlAmount").style.color = "red";
                document.getElementById("pnlAmount").innerHTML = "Loss($): " + nf.format(pnl);
            }
            if (pnl == 0) {
                document.getElementById("pnlAmount").style.color = "red";
                document.getElementById("pnlAmount").innerHTML = "No Profit/Lost($): " + nf.format(pnl);
            }
        };
        request.send();
    }
}


async function fetchData() {
    const response = await fetch('https://raw.githubusercontent.com/krit-space/coin-calculator/main/coins.json').
    then(response => response.json())
    .then(obj =>  
   {


    var options = $('#selectCoin').html();
    for (const [key, value] of Object.entries(obj)) {
        options += "<option value='"+(value.id)+"'>"+ value.name + " - (" + value.symbol+")</option>";
    }
    $('.selectCoin').html(options);
    $('.selectedCoin').html(options);
    $('.marketCapCoin').html(options);

});


}



async function retrieveCoinDetailsInvest() {
    var currency = document.querySelector(".selectCoin").value;
 //   var nf = Intl.NumberFormat();
    if (currency != "null") {
        var url = 'https://api.coingecko.com/api/v3/coins/' + currency;
        const response = await fetch(url);
        const obj = await response.json();
        document.getElementById("currencyImage").src = obj["image"]["large"];
        document.querySelector(".currentPrice").innerHTML = "<u>Current price of 1 <b>" + obj["name"] + " ≈ " + obj["market_data"]["current_price"]["usd"] + " $</b></u>";
        currentPriceOfCoinSelected = obj["market_data"]["current_price"]["usd"];
        calculateAmountCoin();
    }
}

function calculateAmountCoin() {
    var inputAmountToInvest = 0;
    var nf = Intl.NumberFormat();
    inputAmountToInvest = document.querySelector(".inputAmountToInvest").value;
  //  console.log(inputAmountToInvest);
   // console.log(currentPriceOfCoinSelected);
    document.getElementById("coinAmount").innerHTML = 'Coin(s): ' +  nf.format(inputAmountToInvest / currentPriceOfCoinSelected) + '</font>';

}

async function retrieveCoinDetailsInvested() {
  //  var nf = Intl.NumberFormat();
    var currency = document.querySelector(".selectedCoin").value;
    if (currency != "null") {
        var url = 'https://api.coingecko.com/api/v3/coins/' + currency;
        const response = await fetch(url);
        const obj = await response.json();
        document.getElementById("currencyImage2").src = obj["image"]["large"];
        document.querySelector(".currentPrice2").innerHTML = "Current price of 1 <b>" + obj["name"] + " ≈ " + obj["market_data"]["current_price"]["usd"] + " $</b>";
    }

}

async function retrieveCoinDetailsMarketCap() {
    var currency = document.querySelector(".marketCapCoin").value;
    var nf = Intl.NumberFormat();
    if (currency != "null") {
        var url = 'https://api.coingecko.com/api/v3/coins/' + currency;
        const response = await fetch(url);
        const obj = await response.json();
        document.getElementById("currencyImage3").src = obj["image"]["large"];
        document.querySelector(".currentPrice3").innerHTML = "Current price of 1 <b>" + obj["name"] + " ≈ " + obj["market_data"]["current_price"]["usd"] + " $</b>";


        var url2= 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids='+currency+'&order=market_cap_desc&per_page=100&page=1&sparkline=false';
        const response2 = await fetch(url2);
        const obj2 = await response2.json();
        console.log(obj2[0]["market_cap"]);
       
       // document.getElementById("currentMarketCap").value = 10;
       document.getElementById("currentMarketCap").value = nf.format(obj2[0]["market_cap"]);
       document.getElementById("circulatingSupply").value =nf.format( obj2[0]["circulating_supply"]);
       document.getElementById("maxSupply").value = nf.format(obj2[0]["max_supply"]);
       currentPrice = obj2[0]["current_price"];
    }


}
var currentPrice =0;

function returnCoinWorth(){
    var nf = Intl.NumberFormat();
    var projected_marketcap = (document.getElementById("projectedMarketCap").value).replaceAll(",","");
    var circulating_supply = (document.getElementById("circulatingSupply").value).replaceAll(",","");
    var forcasted_price = parseFloat(projected_marketcap)/circulating_supply;
    console.log(forcasted_price);
    document.getElementById("netWorth1Token").value = nf.format(forcasted_price);
    console.log(nf.format(forcasted_price));
}


async function returnWorth2() {
    var nf = Intl.NumberFormat();

    try {
        document.getElementById("demo").innerHTML = "";
        var currency = document.querySelector(".selectedCoin").value;
        var date = new Date(document.getElementById("inputPastDate").value);
        var dateformatted = date.getDate() + "-" + new Number(date.getMonth() + 1) + "-" + date.getFullYear();
       var pnl=0;
        if (currency != "null") {
            var investedAmount = document.getElementById("inputInvestedAmount").value;

            console.log(currency);
            var url = 'https://api.coingecko.com/api/v3/coins/' + currency + '/history?date=' + dateformatted + '%22,%22market_data.current_price.usd';
            const response = await fetch(url);
            const obj = await response.json();
            var previousPrice = obj["market_data"]["current_price"]["usd"];

            var url = 'https://api.coingecko.com/api/v3/coins/' + currency;
            const response2 = await fetch(url);
            const obj2 = await response2.json();


            var currentPrice = obj2["market_data"]["current_price"]["usd"];
            var NetWorthAmount =  new Number((currentPrice / previousPrice) * investedAmount);
            document.getElementById("displayNetWortInvestedhAmount").value =NetWorthAmount;
        
            pnl = NetWorthAmount - investedAmount;
            if (pnl > 0) {
                document.getElementById("pnlAmounted").style.color = "green";
                document.getElementById("pnlAmounted").innerHTML = "Profit($): " + nf.format(pnl);
            }
            if (pnl < 0) {
                document.getElementById("pnlAmounted").style.color = "red";
                document.getElementById("pnlAmounted").innerHTML = "Loss($): " + nf.format(pnl);
            }
            if (pnl == 0) {
                document.getElementById("pnlAmounted").style.color = "red";
                document.getElementById("pnlAmounted").innerHTML = "No Profit/Lost($): " + nf.format(pnl);
            }
        
        
        
        }
    }
    catch (err) {
        document.getElementById("demo").innerHTML = "Please try a later date.";

    }
}
// https://api.coingecko.com/api/v3/coins/
//https://www.coingecko.com/api/documentations/v3#/simple/get_simple_token_price__id_

