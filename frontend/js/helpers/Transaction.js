import { getUsernameById } from "./Account.js";

//Transaction's class

class Transaction {
  constructor(transaction) {
    this.id = transaction.id;
    this.type = transaction.type;
    this.accountId = transaction.accountId;
    this.category = transaction.category;
    this.description = transaction.description;
    this.amount = Number(transaction.amount);
    this.accountIdTo = transaction.accountIdTo;
    this.accountIdFrom = transaction.accountIdFrom;
  }
  commit() {
    if (this.value < 0 && this.amount > this.account.balance) return;
    this.account.transactions.push(this.value);
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
    if (this.accountId == this.accountIdFrom) {
      return -this.amount;
    }
    if (this.accountId == this.accountIdTo) {
      return this.amount;
    }
  }
}

//Create new class with Transaction class

let newTransactionArray = [];

function convertTransaction(transaction) {
  if (transaction.type == "deposit") {
    return new Deposit(transaction);
  }
  if (transaction.type == "withdraw") {
    return new Withdrawal(transaction);
  }
  if (transaction.type == "transfer") {
    return new Transfer(transaction);
  }
}

//To get the default information

export function setNewTransaction(transactions) {
  if (transactions.length > 0) {
    const newTransactions = transactions.map((transaction) => {
      return convertTransaction(transaction);
    });
    return newTransactions;
  }
  return transactions;
}

function deposit(transaction) {
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

export const getTransaction = function () {
  $.ajax({
    method: "get",
    url: "http://localhost:3000/transactions",
    dataType: "json",
  }).done((data) => {
    console.log("get data", data);
    data.forEach((element) => {
      let newArr = [];
      if (element.length > 0) {
        newArr = element.map((transaction) => {
          return convertTransaction(transaction);
        });
      }
      newTransactionArray = [...newTransactionArray, ...newArr];
    });
    setTransactionsToList(newTransactionArray);
    $("#accounts-filter").on("change", () => {
      $("#data-table").remove();
      $("#table-box").append(`
      <table class="transaction_table" id="data-table">
        <tr class="transaction_table_raw">
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
  $.ajax({
    method: "post",
    data: JSON.stringify({ newTransaction }),
    url: "http://localhost:3000/transaction",
    contentType: "application/json; charset=utf-8",
    traditional: true,
  }).done((data) => {
    setTransactionsToList(data);
    calcurateTransfer(data);
  });
};

function calcurateTransfer(data) {
  const newTransactions = setNewTransaction(data);
  newTransactions.forEach((transaction) => {
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
  data.forEach((newTransaction) => {
    accountName = getUsernameById(newTransaction.accountId);
    if (newTransaction.type == "deposit") {
      accountNameFrom = "ー";
      accountNameTo = getUsernameById(newTransaction.accountId);
    }
    if (newTransaction.type == "withdraw") {
      accountNameTo = "ー";
      accountNameFrom = getUsernameById(newTransaction.accountId);
      sign = "-";
    }
    if (newTransaction.type == "transfer") {
      accountNameTo = getUsernameById(newTransaction.accountIdTo);
      accountNameFrom = getUsernameById(newTransaction.accountIdFrom);
      if (newTransaction.accountId == newTransaction.accountIdTo) {
        sign = "";
      }
      if (newTransaction.accountId == newTransaction.accountIdFrom) {
        sign = "-";
      }
    }
    $("#data-table").append(`
    <tr class="transaction_table_raw" id="table-raw">
    <td>${newTransaction.id}</td>
    <td id="id-account">${accountName}</td>
    <td>${newTransaction.type}</td>
    <td>${newTransaction.category}</td>
    <td>${newTransaction.description}</td>
    <td><span>${sign}</span>${newTransaction.amount}</td>
    <td id="id-from">${accountNameFrom}</td>
    <td id="id-to">${accountNameTo}</td>
    </tr>
    `);
  });
}

export default {
  getTransaction,
  postNewTransaction,
  setNewTransaction,
};
