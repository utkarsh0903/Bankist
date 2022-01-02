'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Utkarsh Garg',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300, 370],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Aayush Garg',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Rahul Dhingra',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Vishesh Rajput',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// const account1 = {
//   owner: 'Utkarsh Garg',
//   movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,

//   movementsDates: [
//     '2019-11-18T21:31:17.178Z',
//     '2019-12-23T07:42:02.383Z',
//     '2020-01-28T09:15:04.904Z',
//     '2020-04-01T10:17:24.185Z',
//     '2020-05-08T14:11:59.604Z',
//     '2020-05-27T17:01:17.194Z',
//     '2020-07-11T23:36:17.929Z',
//     '2020-07-12T10:51:36.790Z',
//   ],
//   currency: 'EUR',
//   locale: 'pt-PT', // de-DE
// };

// const account2 = {
//   owner: 'Aayush Garg',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,

//   movementsDates: [
//     '2019-11-01T13:15:33.035Z',
//     '2019-11-30T09:48:16.867Z',
//     '2019-12-25T06:04:23.907Z',
//     '2020-01-25T14:18:46.235Z',
//     '2020-02-05T16:33:06.386Z',
//     '2020-04-10T14:43:26.374Z',
//     '2020-06-25T18:49:59.371Z',
//     '2020-07-26T12:01:20.894Z',
//   ],
//   currency: 'USD',
//   locale: 'en-US',
// };

// const accounts = [account1, account2];

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

const displayMovements = function (movements, sort = false) {
  containerMovements.textContent = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
                    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                    <div class="movements__value">${mov}€</div>
                 </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// const movements = [23, 36, -40];
// const balance = movements.reduce(function (acc, mov) {
//   return acc + mov;
// });
// console.log(balance);

//How to check maximum using reduce
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300, 370];
// const maximum = movements.reduce((acc, max) => acc > max ? acc : max, 0);
// console.log(maximum);

//Update balance 
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance}€`;
  console.log(accounts);
};

//Deposit summary
const displaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = ` ${incomes}€`;
  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = ` ${Math.abs(out)}€`;
  const interest = acc.movements.filter(mov => mov > 0).map(mov => mov * acc.interestRate / 100).reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${interest}€`
};

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  //Display Balance
  calcDisplayBalance(acc);

  //Display Summary
  displaySummary(acc);
}

const createUsername = function (accs) {
  // Foreach is used here instead of map because we want to mutate(Change) the original array.
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};

createUsername(accounts);

//Login function

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting 
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)

  if (currentAccount.pin === Number(inputLoginPin.value)) {
    //Display UI and Message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //Clearing input fields
    inputLoginPin.value = '';
    inputLoginUsername.value = '';

    //Stoping pointer from blinking
    inputLoginPin.blur();
    inputLoginUsername.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amt = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);
  //console.log(amt, receiverAccount)
  //Clearing input fields
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();

  if (amt > 0 &&
    currentAccount.balance >= amt &&
    receiverAccount &&
    receiverAccount.username !== currentAccount.username) {
    //console.log('Transfer Valid')

    //Deduct Amount
    currentAccount.movements.push(-amt);
    receiverAccount.movements.push(amt);
    updateUI(currentAccount);
  }

})

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (loanAmount > 0 && currentAccount.movements.some(mov => mov >= (0.1 * loanAmount))) {
    currentAccount.movements.push(loanAmount);
    console.log(currentAccount.movements);
    updateUI(currentAccount);
  }
  else {
    alert('Not eligible');
  }
  inputLoanAmount.value = '';
})

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const pin = Number(inputClosePin.value);

  if (currentAccount.pin === pin &&
    inputCloseUsername.value === currentAccount.username) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    //Delete Account
    accounts.splice(index, 1);
    console.log(accounts);
    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
  inputClosePin.blur();
  inputCloseUsername.blur();
})

let sorted = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})
