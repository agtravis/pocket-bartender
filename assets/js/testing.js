//variables stored are the key, the starting point for the query URL
var liquorCabinet = [];
var liquorImageLinks = [];
var drinksArray;
var drinksObj;

// globally accessible current item - undefined on page load, defined as soon as it is needed, and changes
var currentItem = '';
var apikey = '9973533';
var apiaddress = 'https://www.thecocktaildb.com/api/json/v2/' + apikey + '/';

//The input field and the search button
//I have only stored 2 elements as variables. To clean up the code I can replace each 'document.getElementById' with variables
var userInput = document.getElementById('search');
var searchButton = document.getElementById('search-button');
var searchButtonSM = document.getElementById('search-buttonSM');
var userInputSM = document.getElementById('searchSM');
var liquorCabinetDiv = document.getElementById('liquor-cabinet');
var liquorCabinetDivSM = document.getElementById('liquor-cabinetSM');
var modalMessage = document.getElementById('modal-message');
var modalAlertElement = document.getElementById('modal-alert');
var informationContainer = document.getElementById('information-container');
var informationContainerSM = document.getElementById('information-containerSM');
var modalAlertButton = document.getElementById('modal-alert-button');
var statusInText = document.getElementById('status-in-text');
var statusInButton = document.getElementById('status-in-button');
var statusOutText = document.getElementById('status-out-text');
var statusOutButton = document.getElementById('status-out-button');
var modalElement = document.getElementById('modal');
var displayInfoButton = document.getElementById('display-info');
var cancelButton = document.getElementById('cancel-button');

//populates liquor cabinet on page load from local storage
initialize();

//EVENT LISTENERS

//the modal opens whether the user hits ENTER or clicks the button, passing the input
searchButton.addEventListener('click', function() {
  openModal(userInput.value);
});
searchButtonSM.addEventListener('click', function() {
  openModal(userInputSM.value);
});
userInput.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    openModal(userInput.value);
  }
});
userInputSM.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    openModal(userInputSM.value);
  }
});

//when the liquor cabinet is clicked, if the item clicked is an image, the modal opens passing the element name
//evaluated by slicing the dynamically generated id name
liquorCabinetDiv.addEventListener('click', function(event) {
  var element = event.target;
  if (element.matches('img')) {
    var elementName = element.id.slice(8);
    openModal(elementName);
  }
});
liquorCabinetDivSM.addEventListener('click', function(event) {
  var element = event.target;
  if (element.matches('img')) {
    var elementName = element.id.slice(8);
    openModal(elementName);
  }
});

//if the user ran out, this removes it from local storage and hence the cabinet
statusInButton.addEventListener('click', function() {
  modalElement.classList.add('hide');
  informationContainer.classList.remove('opaque');
  informationContainerSM.classList.remove('opaque');
  liquorCabinet.splice(liquorCabinet.indexOf(currentItem), 1);
  localStorage.setItem('liquor-cabinet', JSON.stringify(liquorCabinet));
  initialize();
});

//if the user adds to their cabinet, this function runs
statusOutButton.addEventListener('click', function() {
  modalElement.classList.add('hide');
  informationContainer.classList.remove('opaque');
  informationContainerSM.classList.remove('opaque');
  if (!liquorCabinet.includes(currentItem)) {
    var queryURL = apiaddress + 'filter.php?i=' + currentItem;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        console.log(response);
        if (response.drinks !== 'None Found') {
          liquorCabinet.push(currentItem);
          localStorage.setItem('liquor-cabinet', JSON.stringify(liquorCabinet));
          initialize();
        } else {
          modalAlert('That is not a real product!');
        }
      }
    };
    xmlhttp.open('GET', queryURL, true);
    xmlhttp.send();
  }
});

//button to close custom alert pop up
modalAlertButton.addEventListener('click', function() {
  modalAlertElement.classList.add('hide');
  informationContainer.classList.remove('opaque');
  informationContainerSM.classList.remove('opaque');
});

//regardless of inventory status, this is where the user chooses to display recipes/facts etc.
displayInfoButton.addEventListener('click', function() {
  modalElement.classList.add('hide');
  informationContainer.classList.remove('opaque');
  informationContainerSM.classList.remove('opaque');
  searchIngredient(currentItem);
});

//just closes the modal without doing anything
cancelButton.addEventListener('click', function() {
  informationContainer.classList.remove('opaque');
  informationContainerSM.classList.remove('opaque');
  modalElement.classList.add('hide');
});

//for loop add event listeners on ingredients list to be able to target words
for (var i = 1; i <= 3; ++i) {
  document
    .getElementById('ingredients' + [i])
    .addEventListener('click', function(event) {
      openModal(event.toElement.textContent);
    });
  document
    .getElementById('ingredients' + [i] + 'SM')
    .addEventListener('click', function(event) {
      openModal(event.toElement.textContent);
    });
}

//toggles opacity on coasters to show recipe on click, accounts for paragraph obscuring image
informationContainerSM.addEventListener('click', function(event) {
  var i = event.target.id;
  i = i.charAt(5);
  if (event.target.matches('img') || event.target.matches('p')) {
    if (
      document.getElementById('recipe' + i + 'SM').className.includes('hide')
    ) {
      document.getElementById('recipe' + i + 'SM').classList.remove('hide');
      document.getElementById('image' + i + 'SM').classList.add('opaque');
    } else if (
      !document.getElementById('recipe' + i + 'SM').className.includes('hide')
    ) {
      document.getElementById('recipe' + i + 'SM').classList.add('hide');
      document.getElementById('image' + i + 'SM').classList.remove('opaque');
    }
  }
});

//fills the array from local storage (called on page load)
function initialize() {
  liquorCabinet = JSON.parse(localStorage.getItem('liquor-cabinet'));
  if (liquorCabinet) {
    liquorImageLinks = [];
    for (var i = 0; i < liquorCabinet.length; ++i) {
      var imageURL =
        'https://www.thecocktaildb.com/images/ingredients/' +
        liquorCabinet[i] +
        '-Small.png';
      liquorImageLinks.push(imageURL);
    }
    // console.log(liquorCabinet);
    // console.log(liquorImageLinks);
  } else {
    liquorCabinet = [];
  }
  renderLiquorCabinet();
}

//displays visual representation of the liquor cabinet array
function renderLiquorCabinet() {
  liquorCabinetDiv.innerHTML = '';
  liquorCabinetDivSM.innerHTML = '';
  for (var i = 0; i < liquorCabinet.length; ++i) {
    var newImage = document.createElement('img');
    newImage.setAttribute('src', liquorImageLinks[i]);
    newImage.setAttribute('id', 'cabinet-' + liquorCabinet[i]);
    liquorCabinetDiv.appendChild(newImage);
    var newImageSM = document.createElement('img');
    newImageSM.setAttribute('src', liquorImageLinks[i]);
    newImageSM.setAttribute('id', 'cabinet-' + liquorCabinet[i] + 'SM');
    liquorCabinetDivSM.appendChild(newImageSM);
  }
}

//custom alert pop-up
function modalAlert(message) {
  modalMessage.textContent = message;
  modalAlertElement.classList.remove('hide');
  informationContainer.classList.add('opaque');
  informationContainerSM.classList.add('opaque');
}

//sets which buttons or text to display based on inventory status
//also this is the point where 'currentItem' is assigned (for global use)
function openModal(item) {
  if (item) {
    item = item.toLowerCase();
    item = item.trim();
    currentItem = item;
    if (
      currentItem.charAt(currentItem.length - 1) === 'm' &&
      currentItem.charAt(currentItem.length - 2) === 's'
    ) {
      currentItem = currentItem.slice(0, length - 2);
    }
    userInput.value = '';
    userInputSM.value = '';
    if (liquorCabinet.includes(currentItem)) {
      statusInText.classList.remove('hide');
      statusInButton.classList.remove('hide');
      statusOutText.classList.add('hide');
      statusOutButton.classList.add('hide');
    } else {
      statusInText.classList.add('hide');
      statusInButton.classList.add('hide');
      statusOutText.classList.remove('hide');
      statusOutButton.classList.remove('hide');
    }
    informationContainer.classList.add('opaque');
    informationContainerSM.classList.add('opaque');
    modalElement.classList.remove('hide');
  }
}

//first AJAX call looks for ingredient(s), returns object 'response', calls helper function passing response
function searchIngredient(userChoice) {
  var userIngredient = userChoice;
  var queryURL = apiaddress + 'filter.php?i=' + userIngredient;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText);
      console.log(response);
      if (response.drinks === 'None Found') {
        modalAlert('None Found');
      } else {
        displayDrink(response);
      }
    }
  };
  xmlhttp.open('GET', queryURL, true);
  xmlhttp.send();
}

//displays drink name and image, uses drink ID to now call makeDrinks function
function displayDrink(response) {
  for (var i = 1; i <= 3; ++i) {
    document.getElementById('recipe' + i + 'SM').classList.add('hide');
    document.getElementById('image' + i + 'SM').classList.remove('opaque');
    document.getElementById('drink-container-' + i).classList.add('hide');
    document
      .getElementById('drink-container-' + i + 'SM')
      .classList.add('hide');
  }
  var numDrinks = response.drinks.length;
  drinksArray = [];
  drinksObj = {};

  for (var i = 1; i <= 3; ++i) {
    var randomDrinkIndex = Math.floor(Math.random() * numDrinks);
    document.getElementById('drink' + i).textContent =
      response.drinks[randomDrinkIndex].strDrink;
    document.getElementById('drink' + i + 'SM').textContent =
      response.drinks[randomDrinkIndex].strDrink;
    document
      .getElementById('image' + i)
      .setAttribute('src', response.drinks[randomDrinkIndex].strDrinkThumb);
    document
      .getElementById('image' + i + 'SM')
      .setAttribute('src', response.drinks[randomDrinkIndex].strDrinkThumb);
    var drinkId = response.drinks[randomDrinkIndex].idDrink;

    makeDrinks(drinkId, i);

    drinksObj[i] = {};
    drinksObj[i]['name'] = response.drinks[randomDrinkIndex].strDrink;
  }
  drinksArray.push(drinksObj);
  document.getElementById('drink-container-1').classList.remove('hide');
  if (
    document.getElementById('drink2').textContent !==
      document.getElementById('drink1').textContent &&
    document.getElementById('drink2').textContent !==
      document.getElementById('drink3').textContent
  ) {
    document.getElementById('drink-container-2').classList.remove('hide');
  }
  if (
    document.getElementById('drink3').textContent !==
      document.getElementById('drink1').textContent &&
    document.getElementById('drink3').textContent !==
      document.getElementById('drink2').textContent
  ) {
    document.getElementById('drink-container-3').classList.remove('hide');
  }

  document.getElementById('drink-container-1SM').classList.remove('hide');
  if (
    document.getElementById('drink2SM').textContent !==
      document.getElementById('drink1SM').textContent &&
    document.getElementById('drink2SM').textContent !==
      document.getElementById('drink3SM').textContent
  ) {
    document.getElementById('drink-container-2SM').classList.remove('hide');
  }
  if (
    document.getElementById('drink3SM').textContent !==
      document.getElementById('drink1SM').textContent &&
    document.getElementById('drink3SM').textContent !==
      document.getElementById('drink2SM').textContent
  ) {
    document.getElementById('drink-container-3SM').classList.remove('hide');
  }
}

//next AJAX call uses drink ID to get recipe and ingredients, helper function called to parse ingredients
function getRecipe(drinkId, i) {
  var queryURLsub = apiaddress + 'lookup.php?i=' + drinkId;
  var xmlhttpsub = new XMLHttpRequest();
  xmlhttpsub.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText);
      document.getElementById('recipe' + i).textContent =
        response.drinks[0].strInstructions;
      document.getElementById('recipe' + i + 'SM').textContent =
        response.drinks[0].strInstructions;
      fillIngredients(response, i);
    }
  };
  xmlhttpsub.open('GET', queryURLsub, true);
  xmlhttpsub.send();
}

//fills arrays with ingredients and measures. Could also do with a single array of anonymous objects.
//accounts for null values. condition is <=15 because each drink response has this many potential ingredients
//code kind of clunky inside for loops, perhaps can be streamlined - not sure of scope for iterators?
function fillIngredients(response, currentDrink) {
  //VS CODE shows response here as not called but it is....
  var ingredients = [];
  var ingredientsWithSpanHTML = [];
  for (var i = 1; i <= 15; ++i) {
    var indexString = i.toString();
    var newIngredient = 'response.drinks[0].strIngredient' + indexString; //...here where it is evaluated from a string...
    var newIng = eval(newIngredient);
    if (newIng !== null) {
      ingredients.push(newIng);
      ingredientsWithSpanHTML.push(
        '<span class="clickable-ingredient">' + newIng + '</span>'
      );
    }
  }
  var measures = [];
  for (var k = 1; k <= 15; ++k) {
    var indexStringk = k.toString();
    var newMeasure = 'response.drinks[0].strMeasure' + indexStringk; //...and here
    var newMeas = eval(newMeasure);
    if (newMeas !== null) {
      measures.push(newMeas);
    } else {
      measures.push('');
    }
  }
  var ingredientToAdd = '';
  for (var j = 0; j < ingredientsWithSpanHTML.length; ++j) {
    ingredientToAdd += measures[j] + ' ' + ingredientsWithSpanHTML[j] + '<br>';
  }
  document.getElementById(
    'ingredients' + currentDrink
  ).innerHTML = ingredientToAdd;
  document.getElementById(
    'ingredients' + currentDrink + 'SM'
  ).innerHTML = ingredientToAdd;

  drinksArray[0][currentDrink]['ingredients'] = ingredients;
  drinksArray[0][currentDrink]['measures'] = measures;
}

// creates the MAKE DRINK button and hides the drink information aside from the picture
// calls getRecipe()
// calls getNutrition() on click, which gets the value for calories for each ingredient (if it can find it)
// totals up the calories and adds it to the DOM
// clicking the button again will hide the elements
function makeDrinks(whichDrink, containerNumber) {
  var drinkBtn = document.createElement('button');
  var drinkContainer = document.getElementById(
    'drink-container-' + containerNumber
  );
  var drinkRecipes = document.getElementById('recipe' + containerNumber);
  var drinkIngredients = document.getElementById(
    'ingredients' + containerNumber
  );
  var drinkCalories = document.getElementById('calories' + containerNumber);

  drinkBtn.innerText = 'Make this drink';
  drinkBtn.style.display = 'block';
  drinkBtn.setAttribute('class', 'btn make-drink-button');
  drinkBtn.setAttribute('id', 'make-drink-' + containerNumber);
  drinkRecipes.style.display = 'none';
  drinkIngredients.style.display = 'none';
  drinkCalories.style.display = 'none';

  if (document.getElementById('make-drink-' + containerNumber) === null) {
    drinkContainer.insertBefore(drinkBtn, drinkContainer.childNodes[2]);
  } else {
    var oldDrinkBtn = document.getElementById('make-drink-' + containerNumber);
    drinkContainer.removeChild(oldDrinkBtn);
    drinkContainer.insertBefore(drinkBtn, drinkContainer.childNodes[2]);
  }

  getRecipe(whichDrink, containerNumber);

  document
    .getElementById('make-drink-' + containerNumber)
    .addEventListener('click', function() {
      var drinkName = drinksArray[0][containerNumber].name;
      var getDrinkName = document.getElementById(
        'drink-container-' + containerNumber
      ).childNodes[1].textContent;
      var getIngredients = drinksArray[0][containerNumber].ingredients;

      if (getDrinkName === drinkName) {
        for (var i = 0; i < getIngredients.length; i++) {
          var ingredientsKeyword = getIngredients[i];
          if (
            !document.getElementById('calories' + containerNumber).textContent
          ) {
            nutritionTest(ingredientsKeyword, containerNumber);
          }
        }
      }

      if (
        drinkRecipes.style.display === 'block' &&
        drinkIngredients.style.display === 'block' &&
        drinkCalories.style.display === 'block'
      ) {
        drinkRecipes.style.display = 'none';
        drinkIngredients.style.display = 'none';
        drinkCalories.style.display = 'none';
      } else {
        drinkRecipes.style.display = 'block';
        drinkIngredients.style.display = 'block';
        drinkCalories.style.display = 'block';
      }
    });

  document
    .getElementById('image' + containerNumber + 'SM')
    .addEventListener('click', function() {
      if (
        !document.getElementById('calories' + containerNumber + 'SM')
          .textContent
      ) {
        var drinkName = drinksArray[0][containerNumber].name;
        var getDrinkName = document.getElementById(
          'drink-container-' + containerNumber
        ).childNodes[1].textContent;
        var getIngredients = drinksArray[0][containerNumber].ingredients;

        if (getDrinkName === drinkName) {
          for (var i = 0; i < getIngredients.length; i++) {
            var ingredientsKeyword = getIngredients[i];
            nutritionTest(ingredientsKeyword, containerNumber);
          }
        }

        if (
          drinkRecipes.style.display === 'block' &&
          drinkIngredients.style.display === 'block' &&
          drinkCalories.style.display === 'block'
        ) {
          drinkRecipes.style.display = 'none';
          drinkIngredients.style.display = 'none';
          drinkCalories.style.display = 'none';
        } else {
          drinkRecipes.style.display = 'block';
          drinkIngredients.style.display = 'block';
          drinkCalories.style.display = 'block';
        }
      }
    });
}
