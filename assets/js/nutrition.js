var credentials = [
  {
    name: 'Justin',
    nutritionAppID: 'a2375bfd',
    nutritionAppIDTwo: 'd308f986',
    nutritionAPIKey: '987371f8354b28cf2ef7c6815009c509',
    nutritionAPIKeyTwo: '2d7ae686c06de5bd7f5b9300309bd166'
  },
  {
    name: 'George',
    nutritionAppID: '252a4b13',
    nutritionAPIKey: 'a9ba2319cc4056e4a82957b93300f146'
  },
  {
    name: 'Ari',
    nutritionAppID: '5fab1244',
    nutritionAPIKey: '688319b423dfbd88de75a14ebaa97a7d'
  },
  {
    name: 'Bonus',
    nutritionAppID: 'd308f986',
    nutritionAPIKey: '2d7ae686c06de5bd7f5b9300309bd166'
  }
];

const nutritionAppID = credentials[1].nutritionAppID;
const nutritionAPIKey = credentials[1].nutritionAPIKey;
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
  }).then(function(searchResponse) {
    var nutritionQuery = searchResponse.data.common[0].food_name;

    var getNutritionOf = {
      query: nutritionQuery
    };

    if (keyword.toLowerCase() === nutritionQuery) {
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
          document.getElementById(
            'calories' + ingredientsNumber
          ).textContent = totalCals;
          document.getElementById(
            'calories' + ingredientsNumber + 'SM'
          ).innerHTML =
            'Estimated calories: <span id="caloriesNumSM' +
            ingredientsNumber +
            '">' +
            totalCals +
            '</span>';

          if (totalCals > 500) {
            document.getElementById(
              'caloriesNumSM' + ingredientsNumber
            ).style.color = 'red';
          } else if (totalCals <= 500) {
            document.getElementById(
              'caloriesNumSM' + ingredientsNumber
            ).style.color = 'green';
          }
          if (totalCals > 500) {
            document.getElementById(
              'calories' + ingredientsNumber
            ).style.color = 'red';
          } else if (totalCals <= 500) {
            document.getElementById(
              'calories' + ingredientsNumber
            ).style.color = 'green';
          }
        })
        .catch(err => console.log(err));
    } else {
      var notFound = document.getElementById('error' + ingredientsNumber);
      notFound.textContent =
        keyword + ' was not found in the Nutritionix database.';
      notFound.style.fontSize = '10px';

      var notFoundSM = document.getElementById(
        'error' + ingredientsNumber + 'SM'
      );
      notFoundSM.textContent =
        keyword + ' was not found in the Nutritionix database.';
      notFoundSM.style.fontSize = '10px';
    }
  });
}
