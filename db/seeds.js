const mongoose = require('./connection')
const Fruit = require('../models/fruits')
const fruitSeeds = require('./seeds.json')

Fruit.deleteMany({})
    .then(() => {
    return Fruit.insertMany(fruitSeeds)
    })
    .then(data => console.log(data))
    .catch(err => console.log(err))
    .finally(() => {
        process.exit()
    })