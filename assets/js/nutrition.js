const nutritionAppID = 'd308f986';
const nutritionAPIKey = '2d7ae686c06de5bd7f5b9300309bd166';
const userID = 0;
const nutritionEndpoint = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
const searchEndpoint = 'https://trackapi.nutritionix.com/v2/search/instant';
const searchParameters = '&self=false&branded=false&common=true&common_general=true&common_grocery=true&common_restaurant=true&locale=en_US&detailed=false&claims=false';
const apiHeaders = {
  'content-type': 'application/json',
  accept: 'application/json',
  'x-app-id': nutritionAppID,
  'x-app-key': nutritionAPIKey,
  'x-remote-user-id': userID
};

// testing with fake keyword
var fakeKey = '?query=whiskey' // var realKey = '?query=' + keyword
var queryURL = searchEndpoint +  fakeKey + searchParameters;

init();

function init() {
  nutritionTest();
}

function nutritionTest() {
  document
    .getElementById('nutrition-test-button')
    .addEventListener('click', function() {
      axios({
        method: 'get',
        url: queryURL,
        headers: apiHeaders
      })
        .then(function(searchResponse) {
          console.log(searchResponse);
          console.log('name: ' + searchResponse.data.common[0].food_name);

          var nutritionQuery = searchResponse.data.common[0].food_name;
          var getNutritionOf = { query: nutritionQuery };

          axios({
            method: 'post',
            url: nutritionEndpoint,
            data: getNutritionOf,
            headers: apiHeaders
          }).then(function(nutritionResponse) {
            console.log(nutritionResponse);
            console.log('calories: ' + nutritionResponse.data.foods[0].nf_calories);
          });
        })
        .catch(err => console.log(err));
    });
}
