import { getUsernameById } from "./Account.js";

//Transaction's class

class Transaction {
  constructor(
    id,
    type,
    accountId,
    category,
    description,
    amount,
    accountIdTo,
    accountIdFrom
  ) {
    this.id = id;
    this.type = type;
    this.accountId = accountId;
    this.category = category;
    this.description = description;
    this.amount = amount;
    this.accountIdTo = accountIdTo;
    this.accountIdFrom = accountIdFrom;
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

class Transfer extends Transaction {
  get value() {
    if (this.accountId == this.accountIdTo) {
      return -this.amount;
    }
    if (this.accountId == this.accountIdFrom) {
      return this.amount;
    }
  }
}

//To get the default information

let newTransactionArray = [];

export function setNewTransaction(transactions) {
  // console.log("transactions", transactions);
  if (transactions.length > 0) {
    const newTransactions = transactions.map((transaction) => {
      if (transaction.type == "deposit") {
        return new Deposit(
          transaction.id,
          transaction.type,
          transaction.accountId,
          transaction.category,
          transaction.description,
          Number(transaction.amount),
          transaction.accountIdFrom,
          transaction.accountIdTo
        );
      }
      if (transaction.type == "withdraw") {
        return new Withdrawal(
          transaction.id,
          transaction.type,
          transaction.accountId,
          transaction.category,
          transaction.description,
          Number(transaction.amount),
          transaction.accountIdFrom,
          transaction.accountIdTo
        );
      }
      if (transaction.type == "transfer") {
        return new Transfer(
          transaction.id,
          transaction.type,
          transaction.accountId,
          transaction.category,
          transaction.description,
          Number(transaction.amount),
          transaction.accountIdFrom,
          transaction.accountIdTo
        );
      }
    });
    return newTransactions;
  }
  return transactions;
}

export const getTransaction = function () {
  $.ajax({
    method: "get",
    url: "http://localhost:3000/transactions",
    dataType: "json",
  }).done((data) => {
    console.log("check", data);
    data.forEach((element) => {
      let newArr = [];
      if (element.length > 0) {
        newArr = element.map((transaction) => {
          if (transaction.type == "deposit") {
            return new Deposit(
              transaction.id,
              transaction.type,
              transaction.accountId,
              transaction.category,
              transaction.description,
              Number(transaction.amount),
              transaction.accountIdFrom,
              transaction.accountIdTo
            );
          }
          if (transaction.type == "withdraw") {
            return new Withdrawal(
              transaction.id,
              transaction.type,
              transaction.accountId,
              transaction.category,
              transaction.description,
              Number(transaction.amount),
              transaction.accountIdFrom,
              transaction.accountIdTo
            );
          }
          if (transaction.type == "transfer") {
            return new Transfer(
              transaction.id,
              transaction.type,
              transaction.accountId,
              transaction.category,
              transaction.description,
              Number(transaction.amount),
              transaction.accountIdFrom,
              transaction.accountIdTo
            );
          }
        });
      }
      newTransactionArray = [...newTransactionArray, ...newArr];
    });
    console.log("data", newTransactionArray);
    setTransactionsToList(newTransactionArray);
    $("#accounts-filter").on("change", () => {
      $("#data-table").remove();
      $("#table-box").append(`
      <table id="data-table">
        <tr>
          <th>transaction Id</th>
          <th>Username</th>
          <th>Transaction Type</th>
          <th>Category</th>
          <th>Description</th>
          <th>Amount</th>
          <th>From</th>
          <th>To</th>
        </tr>
      </table>
      `);
      let optionValue = $("#accounts-filter").val();
      if (optionValue == "all") {
        setTransactionsToList(newTransactionArray);
      } else {
        let result = newTransactionArray.filter(function (value) {
          if (optionValue == value.accountId) {
            return value;
          }
        });
        setTransactionsToList(result);
      }
    });
  });
};

//To post new information

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
  console.log("new transaction", newTransaction);
  if (newTransaction.type == "" || newTransaction.type == undefined) {
    alert("Please select a valid type");
    return;
  }
  if (newTransaction.accountId == "") {
    if (newTransaction.type == "transfer" && newTransaction.accountId == "") {
    } else {
      alert("Please select a valid account");
      return;
    }
    if (
      newTransaction.type == "transfer" &&
      newTransaction.accountIdFrom == ""
    ) {
      alert("Please select a valid 'from account' to trasfer");
      return;
    }
    if (newTransaction.type == "transfer" && newTransaction.accountIdTo == "") {
      alert("Please select a valid 'to account' to trasfer");
      return;
    }
  }
  if (
    newTransaction.type == "transfer" &&
    newTransaction.accountIdFrom == newTransaction.accountIdTo
  ) {
    alert("You can't select the same name accounts");
    return;
  }
  if (
    newTransaction.type == "withdraw" &&
    Number($(`[data-id=${newTransaction.accountId}] span`).text()) <
      newTransaction.amount
  ) {
    alert("This account doesn't have enough amount to withdaraw the money");
    return;
  }
  if (
    newTransaction.type == "transfer" &&
    Number($(`[data-id=${newTransaction.accountIdFrom}] span`).text()) <
      newTransaction.amount
  ) {
    alert("This account doesn't have enough amount to transfer the money");
    return;
  }
  if (newTransaction.category == "") {
    alert("Please select a valid category");
    return;
  }
  if (newTransaction.amount <= 0 || newTransaction.amount == "") {
    alert("Please type valid amount");
    return;
  }
  // if (newTransaction.type == "transfer" && newTransaction.amount ==)
  $.ajax({
    method: "post",
    data: JSON.stringify({ newTransaction }),
    url: "http://localhost:3000/transaction",
    contentType: "application/json; charset=utf-8",
    traditional: true,
  }).done((data) => {
    console.log("transaction data", data);
    addTransactionsToList(data);
    calcurateTransfer(data);
  });
};

function calcurateTransfer(data) {
  const newTransactions = setNewTransaction(data);
  newTransactions.forEach((transaction) => {
    console.log("transaction", transaction);
    const balanceEl = $(`[data-id=${transaction.accountId}] span`);
    const currentBalance = balanceEl.text();
    const newBalance = Number(currentBalance) + transaction.value;
    balanceEl.text(newBalance);
  });
}

//This is a function that I can create and see all information

function setTransactionsToList(data) {
  let accountName = "";
  let accountNameFrom = "";
  let accountNameTo = "";
  let sign = "";
  for (let i = 0; i < data.length; i++) {
    const newTransaction = data[i];
    accountName = getUsernameById(newTransaction.accountId);
    if (newTransaction.type == "deposit") {
      accountNameFrom = "Nothing";
      accountNameTo = getUsernameById(newTransaction.accountId);
      sign = "+";
      newTransaction.amount = newTransaction.value;
    }
    if (newTransaction.type == "withdraw") {
      accountNameTo = "Nothing";
      accountNameFrom = getUsernameById(newTransaction.accountId);
      sign = "";
      newTransaction.amount = newTransaction.value;
    }
    if (newTransaction.type == "transfer") {
      accountNameTo = getUsernameById(newTransaction.accountIdTo);
      accountNameFrom = getUsernameById(newTransaction.accountIdFrom);
      if (newTransaction.accountId == newTransaction.accountIdTo) {
        sign = "";
        newTransaction.amount = newTransaction.value;
      }
      if (newTransaction.accountId == newTransaction.accountIdFrom) {
        sign = "+";
        newTransaction.amount = newTransaction.value;
      }
    }
    $("#data-table").append(`
  <tr id="table-raw">
  <td>${newTransaction.id}</td>
  <td id="id-account">${accountName}</td>
  <td>${newTransaction.type}</td>
  <td>${newTransaction.category}</td>
  <td>${newTransaction.description}</td>
  <td><span>${sign}</span>${newTransaction.amount}</td>
  <td id="id-from">${accountNameTo}</td>
  <td id="id-to">${accountNameFrom}</td>
  </tr>
  `);
  }
}

function addTransactionsToList(data) {
  let accountName = "";
  let accountNameFrom = "";
  let accountNameTo = "";
  let sign = "";
  for (let i = 0; i < data.length; i++) {
    const newTransaction = data[i];
    console.log("check transaction ", newTransaction);
    accountName = getUsernameById(newTransaction.accountId);
    if (newTransaction.type == "deposit") {
      accountNameFrom = "Nothing";
      accountNameTo = getUsernameById(newTransaction.accountId);
      sign = "+";
      newTransaction.amount = newTransaction.amount;
    }
    if (newTransaction.type == "withdraw") {
      accountNameTo = "Nothing";
      accountNameFrom = getUsernameById(newTransaction.accountId);
      sign = "-";
      newTransaction.amount = newTransaction.amount;
    }
    if (newTransaction.type == "transfer") {
      accountNameTo = getUsernameById(newTransaction.accountIdTo);
      accountNameFrom = getUsernameById(newTransaction.accountIdFrom);
      if (newTransaction.accountId == newTransaction.accountIdTo) {
        sign = "+";
        newTransaction.amount = newTransaction.amount;
      }
      if (newTransaction.accountId == newTransaction.accountIdFrom) {
        sign = "-";
        newTransaction.amount = newTransaction.amount;
      }
    }
    $("#data-table").append(`
  <tr>
  <td>${newTransaction.id}</td>
  <td id="id-account">${accountName}</td>
  <td>${newTransaction.type}</td>
  <td>${newTransaction.category}</td>
  <td>${newTransaction.description}</td>
  <td id="${accountName}"><span>${sign}</span>${newTransaction.amount}</td>
  <td id="id-from">${accountNameFrom}</td>
  <td id="id-to">${accountNameTo}</td>
  </tr>
  `);
  }
}

export default {
  getTransaction,
  postNewTransaction,
  setNewTransaction,
};
