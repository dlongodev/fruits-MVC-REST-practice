const express = require('express')
const app = express()
const PORT = 3000
const expressEjsLoyouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const fruitsController = require('./controllers/fruits')

// CONFIGURATION //////////////////////////////////////////////////////////

app.use(express.static('public'))
app.use(methodOverride('_method'))

app.use((req, res, next) => {
    console.log('I run for all routes');
    next();
})
app.use(express.urlencoded({ extended: false }));

app.use(expressEjsLoyouts)
app.set('view engine', 'ejs')

app.use('/fruits', fruitsController)

// LISTENER //////////////////////////////////////////////////////////////
app.listen(PORT, console.log(`Can you hear the love on port ${PORT}`))