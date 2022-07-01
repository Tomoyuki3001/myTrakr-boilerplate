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

export const addNewAccounts = function () {
  const addAccountsInput = document.getElementById("add-accounts-input");
  let accountsName = addAccountsInput.value;
  const newAccounts = new Account(accountsName);
  return newAccounts;
};

export const setOptions = function (data) {
  data.forEach((element) => {
    const accountOption = document.createElement("option");
    accountOption.setAttribute("data-account", element.username);
    accountOption.innerHTML = element.username;
    $("#accout-select, #accout-from, #accout-to").append(accountOption);
  });
};

export const addOptions = function (data) {
  $("#accout-select, #accout-from, #accout-to").append(`
        <option>${data.username}</option>
        `);
};

export default { addNewAccounts, setOptions, addOptions };
