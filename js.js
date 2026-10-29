const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/";

const dropdown = document.querySelectorAll(".dropdown select");

const btn = document.querySelector(" button");
const fromcurr = document.querySelector(".from select");
const tocurr = document.querySelector(".to select");

for(let select of dropdown){
    for(let currcode in countryList){
        let newOption = document.createElement("option");
        newOption.innerText = currcode;
        newOption.value =currcode;
        if(select.name === "from" && currcode === "USD" ){
            newOption.selected = "selected";
        } else if (select.name === "to" && currcode === "INR"){
            newOption.selected = "selected";
        }
        select.append(newOption);
        
    }
    select.addEventListener("change",(evt)=>{
         updateflag(evt.target);
    })
}

const updateflag = (element) =>{
    let currcode = element.value;
    let countrycode = countryList[currcode];
    let newsrc = `https://flagsapi.com/${countrycode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newsrc;
}


btn.addEventListener("click", async (evt) => {
    evt.preventDefault();

    let amount = document.querySelector(".amount input");
    let amtval = Number(amount.value);

    if (!Number.isFinite(amtval) || amtval <= 0) {
        amtval = 1;
        amount.value = "1";
    }

    try {
        const URL = `${BASE_URL}currencies/${fromcurr.value.toLowerCase()}.json`;

        let response = await fetch(URL);

        if (!response.ok) {
            throw new Error("Failed to fetch exchange rates.");
        }

        let result = await response.json();

        let rate =
            result[fromcurr.value.toLowerCase()]?.[tocurr.value.toLowerCase()];

        if (typeof rate !== "number") {
            throw new Error("Exchange rate not available.");
        }

        let finalAmount = amtval * rate;

        document.querySelector(".msg").innerText =
            `${amtval} ${fromcurr.value} = ${finalAmount.toFixed(2)} ${tocurr.value}`;

    } catch (error) {
        document.querySelector(".msg").innerText =
            "Unable to fetch exchange rates. Please try again.";

        console.error("Currency conversion error:", error);
    }
});

