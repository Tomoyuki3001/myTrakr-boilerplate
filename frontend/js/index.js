import { getAccounts, createNewAccounts } from "./helpers/Account.js";
import {
  getCategories,
  postNewCategory,
  showNewCategory,
} from "./helpers/Category.js";

import { getTransaction, postNewTransaction } from "./helpers/Transaction.js";

//Accounts

getAccounts();

$("#add-accounts-form").on("submit", (event) => {
  event.preventDefault();
  createNewAccounts();
});

//Categories

getCategories();

$("#new-category-btn").on("click", (event) => {
  event.preventDefault();
  postNewCategory();
  $("#add-category-form").hide();
  $("#add-new-category").remove();
});

$("#category-select").on("change", () => {
  showNewCategory();
  console.log("change");
});

//Transactions

getTransaction();

$("#new-transaction-btn").on("click", (event) => {
  event.preventDefault();
  postNewTransaction();
});

//Radio buttons part

$('#radio-deposit[name="input"]').click(function () {
  $("#from-box, #to-box").hide();
  $("#acc-box").show();
  console.log("input value", $('#radio-deposit[name="input"]').val());
});
$('#radio-withdraw[name="input"]').click(function () {
  $("#from-box, #to-box").hide();
  $("#acc-box").show();
  console.log("input value", $('#radio-withdraw[name="input"]').val());
});
$('#radio-transfer[name="input"]').click(function () {
  $("#from-box, #to-box").show();
  $("#acc-box").hide();
  console.log("input value", $('#radio-transfer[name="input"]').val());
});
