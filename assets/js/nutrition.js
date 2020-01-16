var credentials = [
  {
    name: 'Justin',
    nutritionAppID: 'a2375bfd',
    nutritionAPIKey: '987371f8354b28cf2ef7c6815009c509'
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
  }
];

// const nutritionAppID = 'd308f986';
const nutritionAppID = credentials[2].nutritionAppID;
// const nutritionAPIKey = '2d7ae686c06de5bd7f5b9300309bd166';
const nutritionAPIKey = credentials[2].nutritionAPIKey;
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

// get the measures of the ingredients, calculate calories that way....
// i.e. 5 oz of Whiskey, find the serving size of the calorie information, compute data
// this is a stretch goal

var calsArray;

function nutritionTest(keyword, ingredientsNumber) {
  calsArray = [];
  console.log(keyword);

  axios({
    method: 'get',
    url: searchEndpoint + search + keyword + searchParameters,
    headers: apiHeaders
  }).then(function(searchResponse) {
    var nutritionQuery = searchResponse.data.common[0].food_name;

    var getNutritionOf = {
      query: nutritionQuery
    };
    console.log(searchResponse);

    console.log(nutritionQuery);
    console.log(getNutritionOf);

    if (keyword.toLowerCase() === nutritionQuery) {
      axios({
        method: 'post',
        url: nutritionEndpoint,
        data: getNutritionOf,
        headers: apiHeaders
      })
        .then(function(nutritionResponse) {
          console.log(nutritionResponse);

          var servingUnit = nutritionResponse.data.foods[0].serving_unit;
          var servingSize = nutritionResponse.data.foods[0].serving_qty;
          var alternativeUnits = nutritionResponse.data.foods[0].alt_measures;

          console.log(servingUnit);
          console.log(servingSize);
          console.log(alternativeUnits);

          console.log(drinksArray);

          var measuresArray = drinksArray[0][ingredientsNumber].measures;
          console.log(measuresArray);
          // i want to get the measuring unit, match it to servingUnit
          // then calculate actual calories by multiplying measure amount by servingSize
          var ingredientCals = nutritionResponse.data.foods[0].nf_calories;

          console.log(ingredientCals);

          calsArray.push(ingredientCals);
          var arraySum = calsArray.reduce((a, b) => a + b, 0);
          var totalCals = Math.round(arraySum);
          document.getElementById('calories' + ingredientsNumber).textContent =
            'Estimated calories: ' + totalCals;
          document.getElementById(
            'calories' + ingredientsNumber + 'SM'
          ).textContent = 'Estimated calories: ' + totalCals;
        })
        .catch(err => console.log(err));
    } else {
      console.log(keyword + ' not found');
      // add could not find nutrition information for keyword
    }
  });
}
