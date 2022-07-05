//Account default setting

class Account {
  constructor(username) {
    this.username = username;
    this.transactions = [];
  }

  get balance() {
    return this.transactions.reduce((total, transaction) => {
      return total + transaction;
    }, 0);
  }
}

// Get the ajax data when the page is loaded

const newAccountArray = [];

export const getAccounts = function () {
  $.ajax({
    method: "get",
    url: "http://localhost:3000/accounts",
    dataType: "json",
  }).done((array) => {
    array.forEach((element) => {
      newAccountArray.push(element);
      setNewAccountArray(element);
    });
    console.log("Account's array", newAccountArray);
  });
};

function setNewAccountArray(data) {
  const accountOption = document.createElement("option");
  accountOption.setAttribute("value", data.id);
  accountOption.dataset.name = data.username;
  accountOption.innerHTML = data.username;
  accountOption.classList.add("account-option-class");
  $("#accout-select, #accout-from, #accout-to").append(accountOption);
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
  const newAccount = new Account(addAccountsInput.value);
  $.ajax({
    method: "post",
    data: JSON.stringify({ newAccount }),
    url: "http://localhost:3000/accounts",
    contentType: "application/json; charset=utf-8",
    traditional: true,
  }).done((data) => {
    console.log("account in Account.js", data);
    setNewAccountArray(data);
    // addNewAccountsToTheSelect(data);
  });
};

function addNewAccountsToTheSelect(data) {
  $("#accout-select, #accout-from, #accout-to").append(`
        <option vale>${data.username}</option>
        `);
}

// export const checkSelectOption = function () {
//   const accountSelectOption = document.getElementsByClassName(
//     ".account-option-class"
//   );
//   console.log("sss", accountSelectOption);
// };

// export const addNewAccountsToTheList = function (data) {
//   $("#account-summary").append(`
//         <li>Name: ${data.username}</li>
//         `);
// };

export function getUsernameById(id) {
  //get account that matches with id from parameters
  // return username from account selected
  let username = "";
  console.log("array", newAccountArray);
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
