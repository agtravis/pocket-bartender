//variables stored are the key, the starting point for the query URL

var liquorCabinet = [];
var liquorImageLinks = [];

// globally accessible current item - undefined on page load, defined as soon as it is needed, and changes
var currentItem = '';

var apikey = '9973533';
var apiaddress = 'https://www.thecocktaildb.com/api/json/v2/' + apikey + '/';

//The input field and the search button
//I have only stored 2 elements as variables. To clean up the code I can replace each 'document.getElementById' with variables
var userInput = document.getElementById('search');
var searchButton = document.getElementById('search-button');

// testing
var drinksArray;
var drinksObj;

//populates liquor cabinet on page load from local storage
initialize();

//the modal opens whether the user hits ENTER or clicks the button, passing the input
searchButton.addEventListener('click', function() {
  openModal(userInput.value);
});

userInput.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    openModal(userInput.value);
  }
});

//the function that fills the array from local storage
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
  document.getElementById('liquor-cabinet').innerHTML = '';
  for (var i = 0; i < liquorCabinet.length; ++i) {
    var newImage = document.createElement('img');
    newImage.setAttribute('src', liquorImageLinks[i]);
    newImage.setAttribute('id', 'cabinet-' + liquorCabinet[i]);
    document.getElementById('liquor-cabinet').appendChild(newImage);
  }
}

//when the liquor cabinet is clicked, if the item clicked is an image, the modal opens passing the element name
//evaluated by slicing the dynamically generated id name
document
  .getElementById('liquor-cabinet')
  .addEventListener('click', function(event) {
    var element = event.target;
    if (element.matches('img')) {
      var elementName = element.id.slice(8);
      openModal(elementName);
    }
  });

//sets which buttons or text to display based on inventory status
//also this is the point where 'currentItem' is assigned (for global use)
function openModal(item) {
  if (item) {
    item = item.toLowerCase();
    item = item.trim();
    currentItem = item;
    console.log(currentItem);
    document.getElementById('search').value = '';
    if (liquorCabinet.includes(item)) {
      document.getElementById('status-in-text').classList.remove('hide');
      document.getElementById('status-in-button').classList.remove('hide');
      document.getElementById('status-out-text').classList.add('hide');
      document.getElementById('status-out-button').classList.add('hide');
    } else {
      document.getElementById('status-in-text').classList.add('hide');
      document.getElementById('status-in-button').classList.add('hide');
      document.getElementById('status-out-text').classList.remove('hide');
      document.getElementById('status-out-button').classList.remove('hide');
    }
    document.getElementById('modal').classList.remove('hide');
  }
}

//if the user ran out, this removes it from local storage and hence the cabinet
document
  .getElementById('status-in-button')
  .addEventListener('click', function() {
    document.getElementById('modal').classList.add('hide');
    liquorCabinet.splice(liquorCabinet.indexOf(currentItem), 1);
    localStorage.setItem('liquor-cabinet', JSON.stringify(liquorCabinet));
    initialize();
  });

//if the user adds to their cabinet, this function runs
document
  .getElementById('status-out-button')
  .addEventListener('click', function() {
    document.getElementById('modal').classList.add('hide');
    if (!liquorCabinet.includes(currentItem)) {
      var queryURL = apiaddress + 'filter.php?i=' + currentItem;
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var response = JSON.parse(this.responseText);
          console.log(response);
          if (response.drinks !== 'None Found') {
            liquorCabinet.push(currentItem);
            localStorage.setItem(
              'liquor-cabinet',
              JSON.stringify(liquorCabinet)
            );
            initialize();
          } else {
            alert('That is not a real product!');
          }
        }
      };
      xmlhttp.open('GET', queryURL, true);
      xmlhttp.send();
    }
  });

//regardless of inventory status, this is where the user chooses to display recipes/facts etc.
document.getElementById('display-info').addEventListener('click', function() {
  document.getElementById('modal').classList.add('hide');
  searchIngredient(currentItem);
});

//just closes the modal without doing anything
document.getElementById('cancel-button').addEventListener('click', function() {
  document.getElementById('modal').classList.add('hide');
});

// var drinkContainers = [
//   document.getElementById('drink-container-1'),
//   document.getElementById('drink-container-2'),
//   document.getElementById('drink-container-3')
// ];

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
        alert('none');
      } else {
        displayDrink(response);
      }
    }
  };
  xmlhttp.open('GET', queryURL, true);
  xmlhttp.send();
}

//helper function displays drink name and image, uses drink ID to now call makeDrinks function
function displayDrink(response) {
  var numDrinks = response.drinks.length;
  // going to be used to get the nutrition information
  drinksArray = [];
  drinksObj = {};

  for (var i = 1; i <= 3; ++i) {
    var randomDrinkIndex = Math.floor(Math.random() * numDrinks);
    document.getElementById('drink' + i).textContent =
      response.drinks[randomDrinkIndex].strDrink;
    document
      .getElementById('image' + i)
      .setAttribute('src', response.drinks[randomDrinkIndex].strDrinkThumb);
    var drinkId = response.drinks[randomDrinkIndex].idDrink;
    document.getElementById('drink-container-1').classList.remove('hide');
    document.getElementById('drink-container-2').classList.remove('hide');
    document.getElementById('drink-container-3').classList.remove('hide');
    makeDrinks(drinkId, i);

    // get the name of the drink, push it to an object
    drinksObj[i] = {};
    drinksObj[i]['name'] = response.drinks[randomDrinkIndex].strDrink;
  }

  // pushes the drinksObj to the drinksArray
  drinksArray.push(drinksObj);
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
  var ingredients = [];
  for (var i = 1; i <= 15; ++i) {
    var indexString = i.toString();
    var newIngredient = 'response.drinks[0].strIngredient' + indexString;
    var newIng = eval(newIngredient);
    if (newIng !== null) {
      ingredients.push(newIng);
    }
  }
  var measures = [];
  for (var k = 1; k <= 15; ++k) {
    var indexStringk = k.toString();
    var newMeasure = 'response.drinks[0].strMeasure' + indexStringk;
    var newMeas = eval(newMeasure);
    if (newMeas !== null) {
      measures.push(newMeas);
    } else {
      measures.push('');
    }
  }
  var ingredientToAdd = '';
  for (var j = 0; j < ingredients.length; ++j) {
    ingredientToAdd += measures[j] + ' ' + ingredients[j] + '<br>';
  }
  document.getElementById(
    'ingredients' + currentDrink
  ).innerHTML = ingredientToAdd;

  // sets the drinksArray object key and values
  drinksArray[0][currentDrink]['ingredients'] = ingredients;
  drinksArray[0][currentDrink]['measures'] = measures;
}

// creates a 'make drink' button for each drink container
// calls getRecipe function
// then gives each button a click function that will display the ingredients and instructions
// if the button already exists (i.e. when choosing a new liquor and getting new recipes)
// it removes the button and creates a new one so that they do not repeat
// clicking the button again will hide it
function makeDrinks(whichDrink, containerNumber) {
  var drinkBtn = document.createElement('button');
  var drinkContainer = document.getElementById(
    'drink-container-' + containerNumber
  );
  var drinkRecipes = document.getElementById('recipe' + containerNumber);
  var drinkIngredients = document.getElementById(
    'ingredients' + containerNumber
  );

  drinkBtn.innerText = 'Make this drink';
  drinkBtn.style.display = 'block';
  drinkBtn.setAttribute('class', 'btn');
  drinkBtn.setAttribute('id', 'make-drink-' + containerNumber);
  drinkRecipes.style.display = 'none';
  drinkIngredients.style.display = 'none';

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
      if (
        drinkRecipes.style.display === 'block' &&
        drinkIngredients.style.display === 'block'
      ) {
        drinkRecipes.style.display = 'none';
        drinkIngredients.style.display = 'none';
      } else {
        drinkRecipes.style.display = 'block';
        drinkIngredients.style.display = 'block';
      }
    });
}

function nutritionInformation() {
  console.log(drinksArray);
}

//control user input

//handle 404

//control length of array/size of cabinet?
