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
  $("#category-form").hide();
});

$("#category-select").on("change", () => {
  showNewCategory();
});

//Transactions

getTransaction();

$("#new-transaction-btn").on("click", (event) => {
  event.preventDefault();
  postNewTransaction();
});

$("#default-radio").hide();

//Radio buttons part
$("#from-box, #to-box").hide();

$('[name="input"]').change(function () {
  if ($('[name="input"]:checked').val() === "transfer") {
    $("#from-box, #to-box").show();
    $("#acc-box").hide();
  } else {
    $("#from-box, #to-box").hide();
    $("#acc-box").show();
  }
});

$("#radio-deposit, #radio-withdraw").click(function () {
  $("#from-box select").val("select").change();
  $("#to-box select").val("select").change();
});
