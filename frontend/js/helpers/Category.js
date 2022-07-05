// Show up or hide the "Add new..."

export function showNewCategory() {
  let option = document.getElementById("category-select");
  let idx = option.selectedIndex;
  if (option[idx].value == "new") {
    $("#category-form").show();
  }
}

// Get the ajax data when the page is loaded

const newCategorysArray = [];

export const getCategories = function () {
  $("#category-form").hide();
  $.ajax({
    method: "get",
    url: "http://localhost:3000/categories",
    dataType: "json",
  }).done((data) => {
    console.log("Category's array", data);
    data.forEach((element) => {
      newCategorysArray.push(element);
      setCategory(element);
    });
  });
};

function setCategory(element) {
  const categoryOption = document.createElement("option");
  categoryOption.innerHTML = element.name;
  categoryOption.setAttribute("value", element.name);
  $("#category-select").append(categoryOption);
}

//Post a new category to ajax data

function createNewCategory() {
  const addCategoryInput = document.getElementById("category-name");
  let categoryName = addCategoryInput.value;
  const newCategory = {
    newCategory: categoryName,
  };
  return newCategory;
}

function addNewCategoriesToTheSelect(data) {
  $("#category-select").append(`
        <option>${data.name}</option>
        `);
}

export const postNewCategory = function () {
  const categoryInput = document.getElementById("category-name");
  const checkingCategoryArray = [];
  newCategorysArray.forEach((element) => {
    checkingCategoryArray.push(element.name);
  });

  if (categoryInput.value == "") {
    alert("Please type something");
    return false;
  }
  if (checkingCategoryArray.includes(categoryInput.value)) {
    alert("This name is already existed");
    return;
  }
  const category = createNewCategory();
  $.ajax({
    method: "post",
    data: JSON.stringify(category),
    url: "http://localhost:3000/categories",
    contentType: "application/json; charset=utf-8",
    traditional: true,
  }).done((data) => {
    addNewCategoriesToTheSelect(data);
  });
};

export default {
  getCategories,
  postNewCategory,
  showNewCategory,
};
