//variables stored are the key, the starting point for the query URL

var liquorCabinet = [];
var liquorImageLinks = [];

var apikey = '9973533';
var apiaddress = 'https://www.thecocktaildb.com/api/json/v2/' + apikey + '/';

//The input field and the search button
var userInput = document.getElementById('search');
var searchButton = document.getElementById('search-button');

init();

//the search function runs whether the user hits ENTER or clicks the button
searchButton.addEventListener('click', searchIngredient);
userInput.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    searchIngredient();
  }
});

function init() {
  liquorCabinet = JSON.parse(localStorage.getItem('liquor-cabinet'));
  if (liquorCabinet) {
    renderLiquorCabinet();
    liquorImageLinks = [];
    for (var i = 0; i < liquorCabinet.length; ++i) {
      var imageURL =
        'https://www.thecocktaildb.com/images/ingredients/' +
        liquorCabinet[i] +
        '-Medium.png';
      liquorImageLinks.push(imageURL);
    }
    console.log(liquorCabinet);
    console.log(liquorImageLinks);
  } else {
    liquorCabinet = [];
  }
}

function renderLiquorCabinet() {
  // document.getElementById('liquor-cabinet').innerHTML = '';
  //create array of src based on storage array
}

//ignore this code, reference for George, will delete when done!
// function renderSearchedCities() {
//   searchedCitiesUL.innerHTML = '';
//   for (var i = 0; i < searchedCities.length; ++i) {
//     var searchedCity = searchedCities[i];
//     var li = document.createElement('li');
//     li.textContent = searchedCity;
//     li.setAttribute('class', 'searched-city');
//     searchedCitiesUL.appendChild(li);
//   }
// }

//first AJAX call looks for ingredient(s), returns object 'response', calls helper function passing response
function searchIngredient() {
  var userIngredient = userInput.value;
  var queryURL = apiaddress + 'filter.php?i=' + userIngredient;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText);
      console.log(response);
      displayDrink(response);
      if (!liquorCabinet.includes(userIngredient)) {
        liquorCabinet.push(userIngredient);
      }
      localStorage.setItem('liquor-cabinet', JSON.stringify(liquorCabinet));
      init();
    }
  };
  xmlhttp.open('GET', queryURL, true);
  xmlhttp.send();
}

//helper function displays drink name and image, uses drink ID to call getRecipe function
function displayDrink(response) {
  var numDrinks = response.drinks.length;

  for (var i = 1; i <= 3; ++i) {
    var randomDrinkIndex = Math.floor(Math.random() * numDrinks);
    document.getElementById('drink' + i).textContent =
      response.drinks[randomDrinkIndex].strDrink;
    document
      .getElementById('image' + i)
      .setAttribute('src', response.drinks[randomDrinkIndex].strDrinkThumb);
    var drinkId = response.drinks[randomDrinkIndex].idDrink;
    getRecipe(drinkId, i);
  }
}

//next AJAX call uses drink ID to get recipe and ingredients, helper function called to parse ingredients
function getRecipe(drinkId, i) {
  var queryURLsub = apiaddress + 'lookup.php?i=' + drinkId;
  var xmlhttpsub = new XMLHttpRequest();
  xmlhttpsub.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText);
      console.log(response);
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
}
