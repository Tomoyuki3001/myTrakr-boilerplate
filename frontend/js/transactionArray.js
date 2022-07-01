$(() => {
  //Start coding here!
  $.ajax({
    method: "get",
    url: "http://localhost:3000/transactions",
    dataType: "json",
  }).done((transaction) => {
    console.log("transaction array", transaction);
  });
});
