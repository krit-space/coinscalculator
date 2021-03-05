
window.onload = function () {
    fetchData();
    inputPastDate.max = new Date().toISOString().split("T")[0];
}

function returnWorth() {
    var currency = document.querySelector(".selectCoin").value;
    if(currency != ""){
    var investedAmount = document.getElementById("inputInvestAmount").value;
    var desiredAmount = document.getElementById("inputDesiredAmount").value;
    var coinValueinUSD = 0;
    var url = 'https://api.coingecko.com/api/v3/simple/price?ids=' + currency + '&vs_currencies=usd';
    var request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.onload = function () {
        console.log(this.response)
        var data = JSON.parse(this.response);
        coinValueinUSD = data[currency]["usd"];
        document.getElementById("displayNetWorthAmount").value = new Number((investedAmount / coinValueinUSD) * desiredAmount);
    };
    request.send();
}
}


async function fetchData() {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/');
    const obj = await response.json();
    for (const [key, value] of Object.entries(obj)) {
        $('.selectCoin').append($("<option value=" + value.id + " style='background-color:url(https://assets.coingecko.com/coins/images/10643/thumb/ceth2.JPG);' >" + value.name + " - (" + value.symbol + ")</option>"));
        $('.selectedCoin').append($("<option value=" + value.id + " style='background-color:url(https://assets.coingecko.com/coins/images/10643/thumb/ceth2.JPG);' >" + value.name + " - (" + value.symbol + ")</option>"));

    }
}

async function retrieveCoinDetailsInvest(){
    var currency = document.querySelector(".selectCoin").value;
    if(currency!="null"){
        console.log(currency);
    var url = 'https://api.coingecko.com/api/v3/coins/' + currency;
    const response = await fetch(url);
    const obj = await response.json();
    document.getElementById("currencyImage").src=obj["image"]["large"];
    console.log(obj["market_data"]["current_price"]["usd"])
    document.querySelector(".currentPrice").innerHTML="Current price of 1 "+obj["name"]+ " = "+obj["market_data"]["current_price"]["usd"] +" $";
    }

}

async function retrieveCoinDetailsInvested(){
    var currency = document.querySelector(".selectedCoin").value;
    if(currency!="null"){
        console.log(currency);
    var url = 'https://api.coingecko.com/api/v3/coins/' + currency;
    const response = await fetch(url);
    const obj = await response.json();
    document.getElementById("currencyImage2").src=obj["image"]["large"];
    console.log(obj["market_data"]["current_price"]["usd"])
    document.querySelector(".currentPrice2").innerHTML="Current price of 1 "+obj["name"]+ " = "+obj["market_data"]["current_price"]["usd"] +" $";
    }

}

async function returnWorth2(){
    var currency = document.querySelector(".selectedCoin").value;
    var date = new Date(document.getElementById("inputPastDate").value);
    var dateformatted = date.getDate()+"-"+new Number(date.getMonth()+1)+"-"+date.getFullYear();
    console.log(dateformatted);
    if(currency!="null"){
        var investedAmount = document.getElementById("inputInvestedAmount").value;

        console.log(currency);
    var url ='https://api.coingecko.com/api/v3/coins/'+currency+'/history?date='+dateformatted+'%22,%22market_data.current_price.usd';
    const response = await fetch(url);
    const obj = await response.json();
    var previousPrice = obj["market_data"]["current_price"]["usd"];

    var url = 'https://api.coingecko.com/api/v3/coins/' + currency;
    const response2 = await fetch(url);
    const obj2 = await response2.json();

    var currentPrice = obj2["market_data"]["current_price"]["usd"];
        
    document.getElementById("displayNetWortInvestedhAmount").value = new Number((currentPrice / previousPrice) * investedAmount);
    


    }

}
// https://api.coingecko.com/api/v3/coins/
//https://www.coingecko.com/api/documentations/v3#/simple/get_simple_token_price__id_
