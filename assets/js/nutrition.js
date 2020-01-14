// const nutritionAppID = 'd308f986';
const nutritionAppID = 'a2375bfd';
// const nutritionAPIKey = '2d7ae686c06de5bd7f5b9300309bd166';
const nutritionAPIKey = '987371f8354b28cf2ef7c6815009c509';
const userID = 0;
const nutritionEndpoint =
  'https://trackapi.nutritionix.com/v2/natural/nutrients';
const searchEndpoint = 'https://trackapi.nutritionix.com/v2/search/instant';
const search = '?query=';
const searchParameters =
  '&self=false&branded=false&common=true&common_general=true&common_grocery=true&common_restaurant=true&locale=en_US&detailed=false&claims=false';
const apiHeaders = {
  'content-type': 'application/json',
  accept: 'application/json',
  'x-app-id': nutritionAppID,
  'x-app-key': nutritionAPIKey,
  'x-remote-user-id': userID
};

var calsArray;

function nutritionTest(keyword, ingredientsNumber) {
  calsArray = [];

  axios({
    method: 'get',
    url: searchEndpoint + search + keyword + searchParameters,
    headers: apiHeaders
  })
    .then(function(searchResponse) {
      var nutritionQuery = searchResponse.data.common[0].food_name;
      var getNutritionOf = { query: nutritionQuery };

      axios({
        method: 'post',
        url: nutritionEndpoint,
        data: getNutritionOf,
        headers: apiHeaders
      })
        .then(function(nutritionResponse) {
          var ingredientCals = nutritionResponse.data.foods[0].nf_calories;
          calsArray.push(ingredientCals);
          var arraySum = calsArray.reduce((a, b) => a + b, 0);
          var totalCals = Math.round(arraySum);
          document.getElementById('calories' + ingredientsNumber).textContent = 'Estimated calories: ' + totalCals;
        })
    })
    .catch(err => console.log(err));
}
