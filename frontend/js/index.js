import { addNewAccounts, setOptions, addOptions } from "./helpers/Account.js";
import { addLists } from "./helpers/Transaction.js";

$(() => {
  //Start coding here!
  $.ajax({
    method: "get",
    url: "http://localhost:3000/accounts",
    dataType: "json",
  }).done((array) => {
    console.log("account array", array);
    setOptions(array);
    $("#add-accounts-form").on("submit", (event) => {
      event.preventDefault();
      const newCheckArray = [];
      array.forEach((element) => {
        newCheckArray.push(element.username);
      });
      const newAccount = addNewAccounts();
      console.log("accout array", newCheckArray);
      console.log("name", newAccount.username);
      if (newCheckArray.includes(newAccount.username)) {
        alert("This name is already existed");
        return;
      }
      $.ajax({
        method: "post",
        data: JSON.stringify({ newAccount }),
        url: "http://localhost:3000/accounts",
        contentType: "application/json; charset=utf-8",
        traditional: true,
      }).done((data) => {
        console.log("account", data);
        addOptions(data);
        addLists(data);
        array.push(data);
      });
    });
  });
});
