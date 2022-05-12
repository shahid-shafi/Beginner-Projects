"use strict";
//!  ***************---***   BANK APPLICATION   ***---***************

//*********************************************************************************************************** */
//* Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2022-03-22T09:15:04.904Z",
    "2022-03-23T10:17:24.185Z",
    "2022-03-24T14:11:59.604Z",
    "2022-03-26T14:43:26.374Z",
    "2022-03-29T18:49:59.371Z",
    "2022-03-30T12:01:20.894Z",
  ],
  locale: "pt-PT",
  currency: "EUR",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  locale: "ar-SY",
  currency: "EUR",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  locale: "en-US",
  currency: "USD",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2022-02-23T14:43:26.374Z",
    "2022-02-29T18:49:59.371Z",
    "2022-02-30T12:01:20.894Z",
  ],
  locale: "en-UK",
  currency: "INR",
};

const accounts = [account1, account2, account3, account4];

//*********************************************************************************************************** */
//* Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//*********************************************************************************************************** */
const formatMOvementsDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) {
    return "Today";
  }
  if (daysPassed === 1) {
    return "Yestarday";
  }
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat().format(date);
  }
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

//# *******************   Displaying transactions on UI   *******************

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  //? Using Slice here in order to save Original movements array from mutation due to Sort Method
  const moves = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  moves.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMOvementsDate(date, acc.locale);

    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div> 

`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//# *******************   Displayig Total Balance on UI   *******************

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(
    (accumulator, current) => accumulator + current,
    0
  );
  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
};

//# ****  Displaying Total Cash deposited, Cash withdrawal and Interest  **** //
//? Bottom of web application
const calcDisplaySummery = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((accumulator, mov) => accumulator + mov, 0);

  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((accumulator, mov) => accumulator + mov, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i) => int >= 1)
    .reduce((accumulator, int) => accumulator + int, 0);

  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

//# ******* Creating userNames inside bank accounts ******** #//
const createUserNames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserNames(accounts);

//# ******** Updating User Interface ******** #//
const updateUI = function (acc) {
  //? Display Movements
  displayMovements(acc);

  //? Display balance
  calcDisplayBalance(acc);

  //? Display Summery
  calcDisplaySummery(acc);
};

const startLogOut = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //? In each call, print remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    //? stop timer and logout user at 0 seconds
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Login to get started`;
      containerApp.style.opacity = 0;
    }
    //? Decreasing 1s
    time--;
  };

  //? Setting time to 5 minutes
  let time = 30;
  //? Calling timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//: *********************************************************************************************************** */
//: * **********************--  Event Handler  --***********************************

let currentAccount, timer;

//# *******************   Login Process   *******************
btnLogin.addEventListener("click", function (event) {
  //? prevents form from submitting
  event.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //? Display UI and Current Account
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    //? create current date and time
    const now = new Date();
    //: EXPERIMENTING API
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    };
    const locale = navigator.language; //? From Browser

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //? Clear input fields
    //! Assignment operator works from left to right
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    if (timer) clearInterval(timer);

    timer = startLogOut();

    updateUI(currentAccount);
  }
});
//# ******** Transfering Amount to Recievers Account ******** #//
btnTransfer.addEventListener("click", function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiveAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiveAcc &&
    currentAccount.balance >= amount &&
    receiveAcc?.username !== currentAccount.userName
  ) {
    //? Transfering Amount
    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);

    //?Add Transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiveAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    //reset Timer
    clearInterval(timer);
    timer = startLogOut();
  }
});

//# ******** Taking Loan from Bank ******** #//
btnLoan.addEventListener("click", function (event) {
  event.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(amount);

      //?Add Loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      //reset Timer
      clearInterval(timer);
      timer = startLogOut();

      updateUI(currentAccount);
    }, 3000);
  }
  inputLoanAmount.value = "";
});

//# ******** Deleting Account from Bank Data ******** #//
btnClose.addEventListener("click", function (event) {
  event.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    //! Returns index of Account that we want to delete
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );

    //! Deletes Account
    accounts.splice(index, 1);

    //! Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (event) {
  event.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
//*********************************************************************************************************** */
//* LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//*********************************************************************************************************** */

//!  Practice ---> Chaining
labelBalance.addEventListener("click", function () {

  //! Instead
  const movementsUI = Array.from(
    document.querySelectorAll(".movements__value"),
    (el) => Number(el.textContent.replace("€", ""))
  );
  console.log(movementsUI);
});
