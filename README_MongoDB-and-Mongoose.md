# CRUD App with Mongoose 

## Lesson Objectives

1. Connect Express to Mongo
1. Create Fruits Model
1. Have Create Route Create data in MongoDB
1. Update our index route to pull from MongoDB
1. Update our show route to pull from MongoDB
1. Update out update route and veiw
1. Update our delete route and view

## Gettin started

1. cd into your fruits app
1. `npm install mongoose`
1. `mkdir db`
1. touch a connection.js inside of the db folder `db/connection.js`

## Connect Express to Mongo

1. Inside connection.js:

```javascript
// db/connection.js
// Require Mongoose:
const mongoose = require('mongoose');

// Store the URI for our database in a variable.
// When we're working locally, we'll have a local DB,
// but in production, we'll have to have a database
// that's connected to the Internet.
const mongoURI = 'mongodb://localhost:27017/fruits-test'

// Use the mongoose connect method to connect to the
// database.  The connect method takes two arguments:
// the address of the database and an object containing
// any options.
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // The connect method is asynchronous, so we can use
  // .then/.catch to run callback functions
  // when the connection is opened or errors out.
  .then((instance) =>
    console.log(`Connected to db: ${instance.connections[0].name}`)
  )
  .catch((error) => console.log('Connection failed!', error));

// Export mongoose so we can use it elsewhere
module.exports = mongoose;
```

## Create Fruits Model

1. `mkdir models`
1. `touch models/fruits.js`
1. Create the fruit schema

```javascript
const mongoose = require('../db/connection')

const fruitSchema = new mongoose.Schema({
    name:  { type: String, required: true },
    color:  { type: String, required: true },
    readyToEat: Boolean
});

const Fruit = mongoose.model('Fruit', fruitSchema);

module.exports = Fruit;
```

## Have Create Route Create data in MongoDB

Inside controller/fruit.js:

```javascript
const Fruit = require('../models/fruits.js');
//... and then farther down the file
app.post('/fruits/', (req, res)=>{
    if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true;
    } else { //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false;
    }
    Fruit.create(req.body, (error, createdFruit)=>{
        res.redirect('/fruits')
    });
});
```

## Have Index Route Render All Fruits

```javascript
app.get('/fruits', (req, res)=>{
    Fruit.find({}, (error, allFruits)=>{
        res.render('index.ejs', {
            fruits: allFruits
        });
    });
});
```

## Have Index Page Link to Show Route via fruit id

```html
<li>
    The
    <a href="/fruits/<%=fruits.id; %>">
        <%=fruits.name; %>
    </a>
    is  <%=fruits.color; %>.

</li>
```

## Update the Show Route to pull by ID isntead of index

```javascript
app.get('/fruits/:id', (req, res)=>{

    Fruit.findById(req.params.id, (err, foundFruit)=>{
        res.render('show.ejs', {
            fruit:foundFruit
        });
    });
```



## Update our Delete Button

In your index.ejs our delete button now needs to pass the id instead of the index of the fruit, lets go ahead and do this for our update routes as well while we are here.

```html
    <h1>
        <a href="/fruits/<%= fruit.id %>">
            <%= fruit.name %>
        </a>
    </h1>
    <form action='/fruits/<%= fruit.id  %>?_method=DELETE' method="POST">
        <input type="submit" value="DELETE" />
    </form>
    <a href="/fruits/<%= fruit.id %>/edit">Edit Me</a>
```


## Make the Delete Route Delete the Model from MongoDB

Also, have it redirect back to the fruits index page when deletion is complete

```javascript
app.delete('/fruits/:id', (req, res)=>{
    Fruit.findByIdAndRemove(req.params.id, (err, data)=>{
        res.redirect('/fruits');//redirect back to fruits index
    });
});
```

## Make sure edit route link is updated edit route

In your `index.ejs` file:

```html
<a href="/fruits/<%=fruits.id; %>/edit">Edit</a>
```

## Update our get edit route/page

First the route:

```javascript
app.get('/fruits/:id/edit', (req, res)=>{
    Fruit.findById(req.params.id, (err, foundFruit)=>{ //find the fruit
        res.render(
    		'edit.ejs',
    		{
    			fruit: foundFruit //pass in found fruit
    		}
    	);
    });
});

```

## Update the put request to send the fruit.id

In the `edit.ejs`

```html
<form action="/fruits/<%=fruit.id%>?_method=PUT" method="POST">
```

## Make the PUT Route Update the Model in MongoDB

```javascript
app.put('/fruits/:id', (req, res)=>{
    if(req.body.readyToEat === 'on'){
        req.body.readyToEat = true;
    } else {
        req.body.readyToEat = false;
    }
    Fruit.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedModel)=>{
        res.redirect('/fruits');
    });
});
```
