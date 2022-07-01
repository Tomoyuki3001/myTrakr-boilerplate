import {
  setCategory,
  addNewCategory,
  checkInput,
  addCategory,
} from "./helpers/Category.js";

$(() => {
  $.ajax({
    method: "get",
    url: "http://localhost:3000/categories",
    dataType: "json",
  }).done((category) => {
    console.log("category array", category);
    setCategory(category);
    $("#new-category-btn").on("click", (event) => {
      event.preventDefault();
      $("#add-category-form").hide();
      $("#add-new-category").remove();
      checkInput();
      const newCategoryArray = [];
      category.forEach((element) => {
        newCategoryArray.push(element.name.name);
      });
      const newCategory = addNewCategory();
      console.log("category", newCategory);
      if (newCategoryArray.includes(newCategory.name) == true) {
        alert("This category is already existed");
        return;
      }
      console.log("check", newCategory);
      $.ajax({
        method: "post",
        data: JSON.stringify({ newCategory }),
        url: "http://localhost:3000/categories",
        contentType: "application/json; charset=utf-8",
        traditional: true,
      }).done((data) => {
        console.log("final", data);
        addCategory(data);
        category.push(data);
        console.log("finak array", category);
        $("#category-name").innerHTML = "";
      });
    });
  });
});
