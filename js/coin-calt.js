var currentPriceOfCoinSelected;

window.onload = function () {
    fetchData();
    inputPastDate.max = new Date().toISOString().split("T")[0];
    $(".amzn-native-container").css({ 'margin' : '0' });
    $('#exchangetable').DataTable();
   // $('.selectCoin').select2();
   // $('.selectCoin').select2();
    // $('.selectedCoin').select2();
    // $('.marketCapCoin').select2();
    // $('.marketCapCoinB').select2();
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




var options;
async function fetchData() {
    //https://raw.githubusercontent.com/krit-space/coin-calculator/main/coins.json
    //https://api.coingecko.com/api/v3/coins/list
    const response = await fetch('https://api.coingecko.com/api/v3/coins/list').
    then(response => response.json())
    .then(obj =>  
   {
    options= $('#selectCoin').html();
    for (const [key, value] of Object.entries(obj)) {
        if(value.id == ""  ||  value.name.includes("1X",0) ||
          value.name.includes("2X",0)  ||
          value.name.includes("3X",0) ||  value.name.includes("0.5X",0)
        
        ){// do not add
        }
        else{
        options += "<option value='"+(value.id)+"'>"+ value.name + " - (" + value.symbol+")</option>";
    }
    }
    $('.selectCoin').html(options);
    $("#selectCoin").selectize({sortField:"text",});

    $('.selectedCoin').html(options);
    $("#selectedCoin").selectize({sortField:"text",});

    $('.marketCapCoin').html(options);
    $("#marketCapCoin").selectize({sortField:"text",});

    $('.marketCapCoinB').html(options);
    $("#marketCapCoinB").selectize({sortField:"text",});
});
}



var circulatingSupplyp1 = 0;
var currentPricep1 = 0;
async function retrieveCoinDetailsInvest() {
    var markets=null;
    document.getElementById("displayNetWorthAmount").value=null;
    document.getElementById("inputInvestAmount").value=null;
    document.getElementById("inputDesiredAmount").value=null;
    document.getElementById("projectedMC").innerHTML = 'Expected MC: - ';
    document.getElementById("pnlAmount").innerHTML = null;
    var currency = document.querySelector(".selectCoin").value;
    if (currency != "null") {
        var nf = Intl.NumberFormat();
        var url = 'https://api.coingecko.com/api/v3/coins/' + currency;
        const response = await fetch(url);
        const obj = await response.json();
        circulatingSupplyp1 = obj["market_data"]["circulating_supply"] == 0 ? "0" : obj["market_data"]["circulating_supply"];
        currentPricep1 = obj["market_data"]["current_price"]["usd"];
        document.getElementById("currencyImage").src = obj["image"]["large"];
        document.querySelector(".currentPrice").innerHTML = "<u>Current price of 1 <b>" + obj["name"] + " ≈ " + obj["market_data"]["current_price"]["usd"] + " $</b></u>";
        currentPriceOfCoinSelected = obj["market_data"]["current_price"]["usd"];
        document.querySelector(".coinMcapRank").innerHTML = obj["market_cap_rank"] == null ? "N/A": obj["market_cap_rank"];
        document.querySelector(".coinMcap").innerHTML = obj["market_data"]["market_cap"]["usd"] == 0 ? "N/A" : nf.format(obj["market_data"]["market_cap"]["usd"]);

        document.getElementById("modalbtn").innerHTML = "<a href=\"#\" data-toggle=\"modal\" data-target=\"#exampleModal\">See Exchanges ➥ </a>";
        document.getElementById("exampleModalLabel").innerHTML = obj["name"]+" is available on "+obj["tickers"].length+" exchanges";
        markets = "<table id='exchangetable' class='table table-hover'><thead><tr><th scope='col'>Exchange</th><th scope='col'>Pair</th><th scope='col'>Trust Score</th></tr></thead>";
        for( let i=0 ; i< (obj["tickers"]).length;i++ ){
            if(obj["tickers"][i]["base"].length <= 10 && obj["tickers"][i]["target"].length <= 10){

             markets = markets + "<tr><td><a target=\"_blank\" href='"+obj["tickers"][i]["trade_url"]+"'>"+obj["tickers"][i]["market"]["name"]+
             "</a></td><td>"+obj["tickers"][i]["base"]+"/"+obj["tickers"][i]["target"]+"</td><td style=\"text-align:center;\"><span class='dot' style=\"background-color:"+obj["tickers"][i]["trust_score"]+";\"></span></td></tr>";
             }
        }
        
        
        
        
        markets +=  +"</table>";

        document.getElementById("exchanges").innerHTML = markets.replace("NaN","");


        $('#exchangetable').DataTable();
        calculateAmountCoin();
    }
}

function calculateAmountCoin() {
    var inputAmountToInvest = 0;
    var nf = Intl.NumberFormat();
    inputAmountToInvest = document.querySelector(".inputAmountToInvest").value;
    document.getElementById("coinAmount").innerHTML = 'Coin(s): ' +  nf.format(inputAmountToInvest / currentPriceOfCoinSelected) + '</font>';
}

function ProjectedMC(){
    var nf = Intl.NumberFormat();
    var expectedAmount = document.getElementById("inputDesiredAmount").value;
    if(circulatingSupplyp1 != "0"){
       var expectedMC = circulatingSupplyp1 * expectedAmount;
       var times = expectedAmount / currentPricep1;
        document.getElementById("projectedMC").innerHTML = 'Expected MC: <b><u>$' + nf.format(expectedMC)+"</u></b>, pulling a <b><u>"+nf.format(times)+"x</u></b>";
    } else {
        document.getElementById("projectedMC").innerHTML = "Expected MC: N/A :(";
    }
}

async function retrieveCoinDetailsInvested() {
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
        imageCoinA=obj["image"]["large"];
        coinASymbol = currency;
        marketCapACoin=obj["name"];
        priceCoinA = obj["market_data"]["current_price"]["usd"];
        marketCapA = obj["market_data"]["market_cap"]["usd"];
       document.querySelector(".currentMarketCap").innerHTML = obj["market_data"]["market_cap"]["usd"] == 0 ? 
       "<input type='text' id='customMC' onkeyup='realtimeFormatting()' style=\"width:100%;\"><br><br>" : nf.format(obj["market_data"]["market_cap"]["usd"]);
       document.querySelector(".coinARank").innerHTML = obj["market_cap_rank"] == null ? "N/A": obj["market_cap_rank"];;
    }
}

function realtimeFormatting(){
    var insertedValue = document.getElementById("customMC").value;
        var num = insertedValue.replace(/[^\d]/g, "");
        var num2 = num.split(/(?=(?:\d{3})+$)/).join(",");
        document.getElementById("customMC").value=num2;
    

}


function realtimeFormattingCustomcoinMcap(){
    var insertedValue = document.getElementById("customcoinMcap").value;
        var num = insertedValue.replace(/[^\d]/g, "");
        var num2 = num.split(/(?=(?:\d{3})+$)/).join(",");
        document.getElementById("customcoinMcap").value=num2;
    

}

async function retrieveCoinDetailsMarketCapB() {
    var currency = document.querySelector(".marketCapCoinB").value;
    var nf = Intl.NumberFormat();
    if (currency != "null") {
        var url = 'https://api.coingecko.com/api/v3/coins/' + currency;
        const response = await fetch(url);
        const obj = await response.json();
        marketCapBCoin=obj["name"];
      marketCapB = obj["market_data"]["market_cap"]["usd"];
       document.querySelector(".currentMarketCapB").innerHTML = nf.format(obj["market_data"]["market_cap"]["usd"]);
       document.querySelector(".coinBRank").innerHTML =obj["market_cap_rank"] == null ? "N/A": obj["market_cap_rank"];;

    }


}

var currentPrice =0;

var marketCapACoin="";
var priceCoinA=0;
var marketCapBCoin="";
var marketCapA=0;
var marketCapB=0;
var imageCoinA="";
var coinASymbol="";
function returnCoinWorth(){

    if(marketCapACoin != "" && marketCapBCoin != ""){


  var nf = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD',maximumFractionDigits: 6});
    var link = "https://www.coingecko.com/en/coins/"+coinASymbol;
    var title = marketCapACoin +" with market cap of "+marketCapBCoin+"";
if(marketCapA==0)  {
    marketCapA = Number.parseInt(document.getElementById('customMC').value.replace(",",""));
}

var times = (marketCapB / marketCapA);
var projectedPrice = times * priceCoinA;
var displayProjectedPrice = nf.format(projectedPrice)
var color = "";
if(times >= 1){
    color="green";
}else{
    color="red";
}

var today = new Date();
var currentTime = today.getDay()+"/"+today.getMonth()+"/"+today.getFullYear()+" "+ today. getHours() + ":" + today. getMinutes() ;
document.querySelector(".MarketCapDescription").innerHTML = 
"<div class='container-fluid' style=\"padding-top: 0px;\">"+
  "  <div class='row justify-content-center' >"+
       " <div class='col-12 col-md-12 col-sm-12 col-xs-12'>"+
          "  <div class='card px-4 py-2'>"+
             "   <div class='div1 row py-2 px-2' >"+ 
             "  <div class='col-9 mt-2'>"+
                    "    <p class='font-weight-bold darkWhite' id='heading'> <b>"+title+"</b></p>"+
                    "<small> 1 "+marketCapACoin +" will be: </small><br/>"+
                     "   <span class='mt-3' style =\"color:"+color+";font-size:20px; \">"+displayProjectedPrice+" </span><button type='button' style=\"font-size:13px;border:0;background:whitesmoke;\" onclick=\"copyToExpectedAmount("+projectedPrice+")\" title='Copy to Expected Amount.'><i class=\"fa fa-copy\"></i></button>                     "+
                  "  </div>"+
                  "  <div class='col-3 d-flex align-items-center'>"+
                   "     <div class='rounded-circle d-flex w-100' id='circl' > <img class 'center' src='"+imageCoinA+"' style =\"opacity:100%\"  height='70px'  width='70px' alt=''> </div>"+
                   " </div>"+
              "  </div>"+
              "  <div class='py-2'>"+
              "<small>Pulling a : </small> "+
                 "   <p id='desc'> <span class='mt-3' style =\"color:"+color+";font-size:15px; \">"+times+" </span>x"+
                 "   <div class='d-flex'>"+
                  "      <h6 class=' align-self-center'> <a target = '_blank' href='"+link+"'> Learn more <span class='rounded-circle sp1 px-2 py-0 ml-1'> <i class='fa fa-angle-right' aria-hidden='true'></i> </span> </a> </h6> <button disabled class='btn d-flex ml-auto px-3 font-weight-bold darkWhite'>"+currentTime+" </button>"+
                  "  </div>"+
                  "<div >"+ "<span style='font-size:10px;color:blue'><u>"+window.location+"</u></span></div>"+
              "  </div>"+
           " </div>"+
      "  </div>"+
 "   </div>"+
"</div>";
document.getElementById("errorIfNotSelected").innerHTML ="";
}
else{
    //alert("Please choose cryptocurrencies.");
    document.getElementById("errorIfNotSelected").innerHTML = "Please choose currencies..."; 
}
}

function copyToExpectedAmount(amount){
    document.getElementById("inputDesiredAmount").value = amount;
return false;
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


