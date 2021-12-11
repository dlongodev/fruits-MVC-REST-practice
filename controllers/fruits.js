const express = require('express')
const router = express.Router()
const Fruit = require('../models/fruits')

// SHOW ROUTS //////////////////////////////////////////////////////////////
router.get('/', (req, res) => {
    Fruit.find({}, (err, fruits) => {
        res.render('index', { fruits })
    })
})
router.get('/new', (req, res) => {
    res.render('new')
})
router.get('/:id', (req, res) => {
    Fruit.findById(req.params.id, (err, fruit) => {
        res.render('show', { fruit })
    })
})
// POST /////////////////////////////////////////////////////////////
router.post('/', (req, res) => {
    // console.log('Req.body is', req.body);
    if (req.body.readyToEat === 'on') {
        req.body.readyToEat = true
    } else {
        req.body.readyToEat = false
    }
    Fruit.create(req.body, (err, createdFruit) => {
       res.redirect('/fruits') 
    })
    // res.send(req.body)
    // res.send(fruits)
    
})

// DELETE //////////////////////////////////////////////////////////////
router.delete('/:id', (req, res) => {
    Fruit.findByIdAndRemove(req.params.id, (err, deletedFruit) => {
        res.redirect('/fruits')
    })
    // fruits.splice(req.params.index, 1)
})

// PUT //////////////////////////////////////////////////////////////
router.put('/:id', (req, res) => {
    if (req.body.readyToEat === 'on') {
        req.body.readyToEat = true
    } else {
        req.body.readyToEat = false
    }
    Fruit.findByIdAndUpdate(req.params.id, req.body, { new: true}, (err, updatedModel) => {
        res.redirect('/fruits')
    })
    // fruits[req.params.index] = req.body
    // res.redirect('/fruits')
})

router.get('/:id/edit', (req, res) => {
    Fruit.findById(req.params.id, (err, fruit) => {
        res.render('edit', { fruit })
    })
    
    // res.render('edit', {
    //     fruit: fruits[req.params.index],
    //     index: req.params.index
    // })
})


module.exports = router