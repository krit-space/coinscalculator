var currentPriceOfCoinSelected;
window.onload = function () {
    fetchData();
    fetchNews();
    inputPastDate.max = new Date().toISOString().split("T")[0];

}

function returnWorth() {
    var currency = document.querySelector(".selectCoin").value;
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
                document.getElementById("pnlAmount").innerHTML = "Profit($): " + pnl;
            }
            if (pnl < 0) {
                document.getElementById("pnlAmount").style.color = "red";
                document.getElementById("pnlAmount").innerHTML = "Loss($): " + pnl;
            }
            if (pnl == 0) {
                document.getElementById("pnlAmount").style.color = "red";
                document.getElementById("pnlAmount").innerHTML = "No Profit/Lost($): " + pnl;
            }
        };
        request.send();
    }
}


async function fetchData() {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/');
    const obj = await response.json();

if($('.selectCoin > option').length == 1 ){
    for (const [key, value] of Object.entries(obj)) {
        $('.selectCoin').append($("<option value=" + value.id + ">" + value.name + " - (" + value.symbol + ")</option>"));
    }
}


if($('.selectedCoin > option').length == 1 ){
    for (const [key, value] of Object.entries(obj)) {
        $('.selectedCoin').append($("<option value=" + value.id + ">" + value.name + " - (" + value.symbol + ")</option>"));
    }
}



}

async function fetchNews() {
    const response = await fetch('https://api.coingecko.com/api/v3/news/');
    const obj = await response.json();
    var counter = 0;

    var str = "<table style='td { padding: 10px 10px 10px 10px;border: 1px solid #444;border-bottom-width: 0px;}'><tr><th class='text-center'>Latest News in the world of crypto</th></tr>";
    for (i in obj.data) {
        if (counter % 2 == 0) {
            str += '<tr><td >';
            str += '<div class="card" >';
            str += '<img class="img-fluid card-img-top" src="' + (obj.data[i].thumb_2x == "" ? "images/noimage.png" : obj.data[i].thumb_2x) + '" alt=""/>';
            str += ' <div class="card-body" >';
            str += ' <h5 class="card-title" style="font-size: 12px"><b>' + obj.data[i].title + '</b></h5>';
            str += ' <p class="card-text" style="font-size: 12px">' + obj.data[i].description.substring(0, 200) + '...</p>';
            str += '<p style="font-size: 12px">Article on ' + obj.data[i].news_site + ' ⤴</p>';
            str += '<a href="' + obj.data[i].url + '" style="font-size: 12px" target="_blank" class="btn btn-primary">View >></a>';
            str += ' </div>';
            str += ' </div>';


        } else {
            str += '</td></tr>';
        }

        counter++

    }

    str += ' </table>';
    document.getElementById("slideContainer").innerHTML = str;


}

async function retrieveCoinDetailsInvest() {
    var currency = document.querySelector(".selectCoin").value;
    if (currency != "null") {
        var url = 'https://api.coingecko.com/api/v3/coins/' + currency;
        const response = await fetch(url);
        const obj = await response.json();
        document.getElementById("currencyImage").src = obj["image"]["large"];
        document.querySelector(".currentPrice").innerHTML = "<u>Current price of 1 " + obj["name"] + " ≈ " + obj["market_data"]["current_price"]["usd"] + " $</u>";
        currentPriceOfCoinSelected = obj["market_data"]["current_price"]["usd"];
        calculateAmountCoin();
    }
}

function calculateAmountCoin() {
    var inputAmountToInvest = 0;
    inputAmountToInvest = document.querySelector(".inputAmountToInvest").value;
    console.log(inputAmountToInvest);
    console.log(currentPriceOfCoinSelected);
    document.getElementById("coinAmount").innerHTML = 'Coin(s): ' + (new Number(inputAmountToInvest / currentPriceOfCoinSelected)).toFixed(5) + '</font>';

}

async function retrieveCoinDetailsInvested() {
    var currency = document.querySelector(".selectedCoin").value;
    if (currency != "null") {
        var url = 'https://api.coingecko.com/api/v3/coins/' + currency;
        const response = await fetch(url);
        const obj = await response.json();
        document.getElementById("currencyImage2").src = obj["image"]["large"];
        document.querySelector(".currentPrice2").innerHTML = "Current price of 1 " + obj["name"] + " ≈ " + obj["market_data"]["current_price"]["usd"] + " $";
    }

}

async function returnWorth2() {


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
                document.getElementById("pnlAmounted").innerHTML = "Profit($): " + pnl;
            }
            if (pnl < 0) {
                document.getElementById("pnlAmounted").style.color = "red";
                document.getElementById("pnlAmounted").innerHTML = "Loss($): " + pnl;
            }
            if (pnl == 0) {
                document.getElementById("pnlAmounted").style.color = "red";
                document.getElementById("pnlAmounted").innerHTML = "No Profit/Lost($): " + pnl;
            }
        
        
        
        }
    }
    catch (err) {
        document.getElementById("demo").innerHTML = "Please try a later date.";

    }
}
// https://api.coingecko.com/api/v3/coins/
//https://www.coingecko.com/api/documentations/v3#/simple/get_simple_token_price__id_

