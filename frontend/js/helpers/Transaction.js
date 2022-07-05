import { getUsernameById } from "./Account.js";

class Transaction {
  constructor(amount, account) {
    this.amount = amount;
    this.account = account;
  }
  commit() {
    if (this.value < 0 && this.amount > this.account.balance) return;
    this.account.transactions.push(this.value);
    // this.account.balance += this.value;
  }
}

class Withdrawal extends Transaction {
  get value() {
    return -this.amount;
  }
}

class Deposit extends Transaction {
  get value() {
    return this.amount;
  }
}

const newTransactionArray = [];

// export const addNewAccountsToTheList = function (data) {
//   $("#account-summary").append(`
//         <li>Name: ${data.username}</li>
//         `);
// };

// function createTableElements() {
//   $("#data-table").append(`
//   <tr>
//   <td></td>
//   <td></td>
//   <td>${element.type}</td>
//   <td>${element.category}</td>
//   <td>${element.description}</td>
//   <td>${element.amount}</td>
//   <td>${element.}</td>
//   <td></td>
//   </tr>
//   `);
// }

export const getTransaction = function () {
  $.ajax({
    method: "get",
    url: "http://localhost:3000/transactions",
    dataType: "json",
  }).done((data) => {
    data.forEach((element) => {
      newTransactionArray.push(element);
    });
    console.log("Transaction's array", newTransactionArray);
  });
};

export const postNewTransaction = function () {
  const newTransaction = {
    accountId: $("#accout-select").val(),
    accountIdFrom: $("#accout-from").val(),
    accountIdTo: $("#accout-to").val(),
    amount: $("#amount-input").val(),
    type: $('input:radio[name="input"]:checked').val(),
    description: $("#description-input").val(),
    category: $("#category-select").val(),
  };
  $.ajax({
    method: "post",
    data: JSON.stringify({ newTransaction }),
    url: "http://localhost:3000/transaction",
    contentType: "application/json; charset=utf-8",
    traditional: true,
  }).done((data) => {
    console.log("transaction in Transaction.js", data);
    // loop data
    // get username
    // append new row in table
    let accountName = "";
    let accountNameFrom = "";
    let accountNameTo = "";
    let amount = $("#amount-input").val();
    for (let i = 0; i < data.length; i++) {
      accountName = getUsernameById(data[i].accountId);
      if (newTransaction.type == "deposit") {
        accountNameFrom = "Nothing";
        accountNameTo = getUsernameById(data[i].accountId);
        data[i].amount = "+" + amount;
      }
      if (newTransaction.type == "withdraw") {
        accountNameTo = "Nothing";
        accountNameFrom = getUsernameById(data[i].accountId);
        data[i].amount = "-" + amount;
      }
      if (newTransaction.type == "transfer") {
        accountNameTo = getUsernameById(data[i].accountIdTo);
        accountNameFrom = getUsernameById(data[i].accountIdFrom);
        data[0].amount = "-" + amount;
        data[1].amount = "+" + amount;
      }
      $("#data-table").append(`
  <tr>
  <td>${data[i].id}</td>
  <td id="id-account">${accountName}</td>
  <td>${data[i].type}</td>
  <td>${data[i].category}</td>
  <td>${data[i].description}</td>
  <td>${data[i].amount}</td>
  <td id="id-from">${accountNameFrom}</td>
  <td id="id-to">${accountNameTo}</td>
  </tr>
  `);
    }
  });
};

export default { getTransaction, postNewTransaction };
