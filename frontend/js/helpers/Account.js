//Account default setting

import { setNewTransaction } from "./Transaction.js";
import { domainUrl } from "./Common.js";

class Account {
  constructor(username, id, transactions = []) {
    this.username = username;
    this.transactions = transactions;
    this.id = id;
  }

  get balance() {
    // return this._balance
    return this.transactions.reduce((total, transaction) => {
      return total + transaction.value;
    }, 0);
  }

  // set setBalance(newValue) {
  //   this._balance = newValue;
  // }
}

// Get the ajax data when the page is loaded

const newAccountArray = [];

export const getAccounts = function () {
  $.ajax({
    method: "get",
    url: `${domainUrl}/accounts`,
    dataType: "json",
  }).done((array) => {
    array.forEach((element) => {
      setNewAccountArray(element);
      newAccountArray.push(element);
      const newTransactions = setNewTransaction(element.transactions);
      const newAccount = new Account(
        element.username,
        element.id,
        newTransactions
      );
      setAccountsummary(newAccount);
    });
  });
};

function setNewAccountArray(data) {
  const accountOption = document.createElement("option");
  accountOption.setAttribute("value", data.id);
  accountOption.dataset.name = data.username;
  accountOption.innerHTML = data.username;
  accountOption.classList.add("account-option-class");
  $(".select_account").append(accountOption);
}

//Set default account summary
function setAccountsummary(data) {
  $("#account-summary").append(`
    <li data-id="${data.id}">Account : ${data.username} Balance : <span id="summary-balance">${data.balance}</span></li>
    `);
}

// create new account and send to server

export const createNewAccounts = function () {
  const addAccountsInput = document.getElementById("add-accounts-input");
  const newNameCheckArray = [];
  newAccountArray.forEach((element) => {
    newNameCheckArray.push(element.username);
  });
  if (newNameCheckArray.includes(addAccountsInput.value)) {
    alert("This name is already existed");
    return;
  }

  const newAccount = { username: addAccountsInput.value, transactions: [] };
  $.ajax({
    method: "post",
    data: JSON.stringify({ newAccount }),
    url: `${domainUrl}/accounts`,
    contentType: "application/json; charset=utf-8",
    traditional: true,
  }).done((data) => {
    const newAccount = new Account(data.username, data.id);
    newAccountArray.push(newAccount);
    setNewAccountArray(newAccount);
    setAccountsummary(newAccount);
  });
};

export function getUsernameById(id) {
  let username = "";
  newAccountArray.forEach((element) => {
    if (id == element.id) {
      username = element.username;
    }
  });
  return username;
}

export default {
  getAccounts,
  createNewAccounts,
  getUsernameById,
};
