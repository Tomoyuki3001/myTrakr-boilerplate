$("#add-category-form").hide();

function showNewCategory() {
  let option = document.getElementById("category-select");
  let idx = option.selectedIndex;
  if (option[idx].value == "new") {
    $("#add-category-form").show();
  }
}

const categorySelector = document.getElementById("category-select");
categorySelector.addEventListener("change", showNewCategory);

export const setCategory = function (data) {
  data.forEach((element) => {
    const categoryOption = document.createElement("option");
    categoryOption.setAttribute("data-category", element.name.name);
    categoryOption.innerHTML = element.name.name;
    $("#category-select").append(categoryOption);
  });
};

// let categories = [];
let categoryCounter = 0;

// export const getCategories = () => {
//   return categories;
// };

export const addNewCategory = function () {
  const addCategoryInput = document.getElementById("category-name");
  let categoryName = addCategoryInput.value;
  categoryCounter++;
  const newCategory = {
    id: categoryCounter,
    name: categoryName,
  };
  // categories = [...categories, newCategory];
  return newCategory;
};

export const checkInput = function () {
  const categoryInput = document.getElementById("category-name");
  if (categoryInput.value == "") {
    alert("Please type something");
    return false;
  }
};

export const addCategory = function (data) {
  $("#category-select").append(`
          <option>${data.name.name}</option>
          <option id="add-new-category" value="new">Add new...</option>
          `);
};

export default { addNewCategory, setCategory, checkInput, addCategory };
