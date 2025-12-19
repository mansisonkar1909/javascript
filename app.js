const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

/* ===============================
   Populate dropdowns
================================ */
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    }
    if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }

    select.append(option);
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}

/* ===============================
   Fetch exchange rate (ER API)
================================ */
const updateExchangeRate = async () => {
  try {
    let amountInput = document.querySelector(".amount input");
    let amount = Number(amountInput.value);

    if (!amount || amount < 1) {
      amount = 1;
      amountInput.value = 1;
    }

    const from = fromCurr.value;
    const to = toCurr.value;

    const URL = `https://open.er-api.com/v6/latest/${from}`;

    const response = await fetch(URL);
    if (!response.ok) throw new Error("Fetch failed");

    const data = await response.json();

    if (data.result !== "success") {
      msg.innerText = "Conversion not available";
      return;
    }

    const rate = data.rates[to];
    if (!rate) {
      msg.innerText = "Conversion not available";
      return;
    }

    const finalAmount = (amount * rate).toFixed(2);
    msg.innerText = `${amount} ${from} = ${finalAmount} ${to}`;
  } catch (error) {
    console.error(error);
    msg.innerText = "Error fetching exchange rate";
  }
};

/* ===============================
   Update flag
================================ */
const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const img = element.parentElement.querySelector("img");

  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

/* ===============================
   Button
================================ */
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

/* ===============================
   On load
================================ */
window.addEventListener("load", updateExchangeRate);
