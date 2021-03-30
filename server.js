//include express.js
const express = require('express');
const { animals } = require('./data/animals');

//instantiate server
const app = express();

//filter function
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    //we save the animals array as filtered results here
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        //Save personality traits as a dedicated array
        //if personalityTraits is a string, place it into a new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        //loop through each trait in the personalityTraits array
        personalityTraitsArray.forEach(trait => {
            //check the trait against each animal trait in the filteredResults array
            //remember it is initially a copy of the animals array
            //but here we're updating it for each trait in the .forEach() loop.
            //for each trait being targeted by the filter, the filteredResults
            //array will then contain only the entries that contain the trait
            //so at the end we'll have an array of animals that every one 
            //of the traits when the .forEach() loop is finished
            filteredResults = filteredResults.filter (
                animal => animal.personalityTraits.indexOf(trait) != -1
            );
        })
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    
    //return the filtered results
    return filteredResults;
}

//add animals route
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    };
    res.json(results);
});

//chain listen() method to express variable 'app'
app.listen(3001, () => {
    console.log(`API server now on port 3001`);
});