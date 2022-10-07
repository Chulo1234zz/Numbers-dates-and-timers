'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-10-01T17:01:17.194Z',
    '2022-10-11T23:36:17.929Z',
    '2022-10-06T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-GB', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const formatMovementDate = function (date,locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  //  date = new Date()? console.log('Today'):console.log(`${daysPassed} days passed`);;
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed > 1 && daysPassed <= 7) return `${daysPassed} days ago`;
  else {/* 
    const day1 = `${date.getDate()}`.padStart(2, 0);
    const month1 = `${date.getMonth() + 1}`.padStart(2, 0);
    const year1 = `${date.getFullYear()}`.padStart(2, 0);
    return `${day1}/${month1},${year1}`; */
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const presentDate = new Date();
    // console.log(presentDate);
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date,acc.locale);
    // console.log(date);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

// fake always logged in
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // logged in as of//creating date
    const new2 = new Date(); /* 
    const day = `${new2.getDate()}`.padStart(2, 0);
    const month = `${new2.getMonth() + 1}`.padStart(2, 0);
    const year = `${new2.getFullYear()}`.padStart(2, 0);
    const hours = `${new2.getHours()}`.padStart(2, 0);
    const minutes = `${new2.getMinutes()}`.padStart(2, 0);
    labelDate.textContent  = `${day}/${month}/${year}, ${hours}:${minutes}`;*/

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };

    // getting the locale from the users computer
    // const locale = navigator.language;
    // console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(
      new2
    ); //pass in the locale(language-country) and
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);
    // update loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// instead of using the number operator to convert str to number use '+'
// conversion
// console.log(+'13');
// instead of Number()

// parsing

// console.log(Number.parseInt('30px', 10));
// to check if a value is a number or not use the isFinite() function with ur Number object
// console.log(Number.isFinite(20)); //true
// console.log(Number.isFinite('20')); //false
// console.log(Number.isFinite(+'20'));

// math and rounding
// 1. square root
console.log(Math.sqrt(25));
// or
console.log(25 ** (1 / 2));

// 2.
console.log(Math.max(5, 18, 23, 11, 4));
// 3.
// calculating the radius of a circle with the radiues from css being 10px
console.log(Math.PI * Number.parseFloat('10px') ** 2); //₶r²

// 4.
// math.random and math.trunc used in generating random dice rolls
console.log(Math.trunc(Math.random() * 6) + 1);
// rounding integers
// formula to generate random integerz between two values
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
// 0...1 -> 0...(max - min) -> min...max
console.log(randomInt(10, 20));

// .ceil(),.floor(),.trunc(),.round() the best of them all is .floor() coz it also works perfectly with negative values

// rounding decimals

// remainder operator
console.log(5 % 2);

// even or odd
// console.log(6 % 2 === 0);

// function to prove it
const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(9));

// fun example
labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    // 0,2,4,6
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    // 1,3,5,7,9 (odd)
    else {
      row.style.backgroundColor = 'blue';
      row.style.color = 'white';
    }
  });
});

// working with bigint
// since a number only uses 53 out of 64 bits for stroing th actual digit, there is a size limit which is:
console.log(2 ** 53 - 1); //the biggest number that js can safely represent :9007199254740991
// console.log(9007199254740991); it doesnt go higher than this
console.log(Number.MAX_SAFE_INTEGER);

// bigint that allows us to use numbers bigger than the max_safe_integer
console.log(481167283037484937361292998n);

// all noral operations work between two bigints
// u cant mix bigint with normal digits except u transform the normal integer to bigint using Bigint()
const huge = 256646558583939445627278282827n;
const small = 23;
// console.log(huge*small); wont work coz small is a normal int
console.log(huge * BigInt(small)); //converted normal int to bigint

// the only differences are the comparism operator and the plus operator when working with strings
console.log(20n === 20);
// divisions with big int will cut the decimal part
console.log(11n / 4n);

// creating dates
// first way
const now = new Date();
// console.log(now);
// 2nd way
// parsing the date based on an inputted string
// console.log(new Date('Oct 06 2022 20:13:40'));
// this method is pretty unreliable unless u get the string from a js generated return like
// console.log(new Date(account1.movementsDates[0]));
// 3rd method
// parsing in the values one by one [note month is zero based like arrays]
// console.log(new Date(2037, 7, 25, 19, 45, 8));

// 4th method
// the constructor that counts milliseconds after the initial unix time which is Jan 1 , 1970
// console.log(new Date(0));
// console.log(new Date(3*24*60*60*1000));//3 days after the unix time

// working with dates
// dates are another special type of objects
// const future = new Date(new Date(2037, 7, 25, 19, 45));
// console.log(future);
// to get the year
// console.log(future.getFullYear());
// get month
// console.log(future.getMonth() + 1);

// get: date,minute,hour,second     /toISOtime Date.now
// set:date,minute,hour,second

// operations with dates
// whenever we want to convert a date to a number it converts to a time stamp which is in milliseconds so we can use that to calculate
const future = new Date(new Date(2037, 7, 25, 19, 45));
// console.log(Number(future));

// function that takes in two dates and returns the number of days that have passed
// console.log(calcDaysPassed(new Date(2022,8,25),new Date(2022,8,29,10,8)));
