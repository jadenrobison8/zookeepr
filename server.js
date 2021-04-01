//include express.js
const express = require('express');
const { animals } = require('./data/animals');

//instantiate server
const PORT = process.env.PORT || 3001;
const app = express();

const fs = require('fs');
const path = require('path');
const { isRegExp } = require('util');

//parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
app.use(express.json());


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

//findbyid takes an array of animals and returns animals objects
function findById(id,animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray) {
    console.log(body);
    //our functions main code will go here
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    //return finished code to post route for response
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.name || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

//add animals route
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    };
    res.json(results);
});

//new get route for animals
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

//POST route
app.post('/api/animals', (req,res) => {
    //req.body is where our incoming content will be
    req.body.id = animals.length.toString();

    //if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

//chain listen() method to express variable 'app'
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});