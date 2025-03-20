const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";
const dropDownSelect = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
let fromCurrency = document.querySelector(".from select");
let toCurrency = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const icon = document.querySelector(".arrow");

for (let select of dropDownSelect) {
  for (let currencyCode in currencyListName) {
    const currency = currencyListName[currencyCode].code;
    const countName = currencyListName[currencyCode].name;

    let newOption = document.createElement("option");
    newOption.innerText = `${countName} - ${currencyCode}`;
    newOption.value = currencyCode;
    if (select.name === "from" && currencyCode === "USD") {
      newOption.selected = "selected";
    }
    if (select.name === "to" && currencyCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
  let currencyCode = element.value;
  let countryCode = currencyListName[currencyCode].code;
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

icon.addEventListener("click", () => {
  let temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;

  updateFlag(fromCurrency);
  updateFlag(toCurrency);
  updateExchangeRate();
});

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal < 1 || amtVal === "") {
    amtVal = 1;
    amount.value = "1";
  }

  try {
    const URL = `${BASE_URL}${fromCurrency.value.toLowerCase()}.json`;
    let response = await fetch(URL);
    let data = await response.json();

    // Corrected way to access the exchange rate
    let rate = data[fromCurrency.value.toLowerCase()][toCurrency.value.toLowerCase()];
    
    if (!rate) {
      msg.innerText = `Exchange rate not available for ${fromCurrency.value} to ${toCurrency.value}`;
      return;
    }

    let finalAmount = (rate * amtVal).toFixed(2); // Round to 2 decimal places

    msg.innerText = `${amtVal} ${fromCurrency.value} = ${finalAmount} ${toCurrency.value}`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "Failed to fetch exchange rate. Please try again.";
  }
};

window.addEventListener("load", () => {
  updateExchangeRate();
});
