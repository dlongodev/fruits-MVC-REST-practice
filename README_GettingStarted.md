## Create an Index route

## Setup our app

1. `mkdir fruits`
1. `cd fruits`
1. touch `server.js`
1. `npm init -y`
1. `npm install express`
1. require express and set up a basic server that logs listening when you start the app
1. start the app with nodemon and make sure it is working

Let's have a set of resources which is just a javascript array. To create an **index** (index = like table of contents, lists all the items) route, we'd do the following:

```javascript
// DEPENDENCIES
const express = require('express')
// CONFIGURATION
const app = express()
const PORT = 3000

// 'DATA'
const fruits = ['apple', 'banana', 'pear']

// ROUTES
// index
app.get('/fruits/', (req, res) => {
  res.send(fruits)
})

// Listener
app.listen(PORT, () => {
  console.log('listening on port', PORT)
})
```

Now go to http://localhost:3000/fruits/

Success?
![](https://i.imgur.com/v2sfviM.png)

**Thought question:** What happens when you go to http://localhost:3000 ?
Why?

## Install JSON Formatter to make viewing JSON easier

- JSON stands for Javascript Object Notation
- It's just a way to represent data that looks like a Javascript object or array
- JSON Formatter extension just makes it easier to view JSON data.

Install it:

1.  Go to https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa
1.  Click on "Add To Chrome"

## Create a Show route

To create a show route, we'd do this:

```javascript
// DEPENDENCIES
const express = require('express')

// CONFIGURATION
const app = express()
const PORT = 3000
// SET UP ROUTES TO ACCEPT FORMS/JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

// 'DATA'
const fruits = ['apple', 'banana', 'pear']

// ROUTES
// index route
app.get('/fruits/', (req, res) => {
  res.send(fruits)
})

//add show route
app.get('/fruits/:indexOfFruitsArray', (req, res) => {
  res.send(fruits[req.params.indexOfFruitsArray])
})

app.listen(PORT, () => {
  console.log('listening on port', PORT)
})
```

Now go to http://localhost:3000/fruits/1

## Enhance the data in your data array

- Right now are data array `fruits` is just an array of strings
- We can store anything in the array, though.
- Let's enhance our data a bit:

```javascript
// DEPENDENCIES
const express = require('express')

// CONFIGURATION
const app = express()
const PORT = 3000

// 'DATA'
const fruits = [
  {
    name: 'apple',
    color: 'red',
    readyToEat: true
  },
  {
    name: 'pear',
    color: 'green',
    readyToEat: false
  },
  {
    name: 'banana',
    color: 'yellow',
    readyToEat: true
  }
]

// ROUTES
// index
app.get('/fruits/', (req, res) => {
  res.send(fruits)
})

// show
app.get('/fruits/:indexOfFruitsArray', (req, res) => {
  res.send(fruits[req.params.indexOfFruitsArray])
})

// Listener
app.listen(PORT, () => {
  console.log('listening on port', PORT)
})
```


Next, we want to be able to create a new fruit. Let's review our 7 restful routes:


|#|Action|URL|HTTP Verb|EJS view filename|
|:---:|:---:|:---:|:---:|:---:|
|1| Index | /fruits/ | GET | index.ejs |
|2| Show | /fruits/:index | GET | show.ejs |
|3| **New** | **/fruits/new**| **GET** | **new.ejs** |
|4| Create | /fruits/ | POST| none |
|5| Edit ||||
|6| Update ||||
|7| Destroy |||||

## Create a new route and page

1. Let's create a page that will allow us to create a new fruit using a form
1. First, we'll need a route for displaying the page in our server.js file **IMPORTANT: put this above your show route, so that the show route doesn't accidentally pick up a /fruits/new request**

    ```javascript
    //put this above your show.ejs file
    app.get('/fruits/new', (req, res) => {
        res.render('new.ejs');
    });
    ```

1. Now lets's create the html for this page in our /views/new.ejs file

- `touch views/new.ejs`

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>New Form</title>
  </head>
  <body>

  </body>
</html>
```


1. Visit http://localhost:3000/fruits/new to see if it works

## Add interactivity to your site with forms

We can use forms to allow the user to enter their own data:


Breaking down the parts of a form

- `<form>` - this encompasses all the elements in a form
  - `action` where should this form be sent (for us it will be the relative path `/fruits`)
  - `method` - this will be a `POST` route, which is in line for our 7 RESTful routes pattern for creating a new fruit
- `<label>` - this is for visual formatting and web accessibility
  - `for` attribute that should match `id` in the companion `input` - again for web accessibility
- `<input />` - a self closing tag
  - `type` we'll use `text`, `checkbox` and `submit` for this project but there are many more like, `number`, `password`... you can always google for a more exhaustive list
  - `name` - this field **MUST** match your key value for your incoming data. This gets parsed as the key with `body-parser`


```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
    </head>
    <body>
      <h1>New Fruit Page</h1>
      <form action="/fruits" method="POST">
        <label for="name">Name</label>
        <input type="text" name="name" id="name"/>
        <label for="color">Color</label>
        <input type="text" name="color" id="color" />
        <label for="isReadyToEat">Is Ready to Eat</label>
        <input type="checkbox" name="readyToEat" id="isReadyToEat" />
        <input type="submit" value="Create Fruit">
      </form>
    </body>
</html>
```

Our create route will require the HTTP action POST. We can't make POST requests through our browser's URL.

Rather, we'll start out by using cURL. cURL will let us test our route. Once we have it working, we can build out some EJS. Always try to build as little as possible and test it.

## Describe what is cURL

- Is a command line tool that acts like a browser's requests
- cURL stands for `client for URL` [Docs](https://curl.haxx.se/docs/)
- You can use it to make requests to a website [Handy resource of flags and commands with an express server](https://gist.github.com/subfuzion/08c5d85437d5d4f00e58)
- All it does is send a request and then take the response and write it to the terminal
  - no formatting

## Describe when we might use cURL

- You want to create a route and test that it works
  - with a GET request, you can just type the route into the URL bar in the browser and see if it works. No muss no fuss  
  - Separate the functionality of EJS from your routes so you build more iteratively and you can isolate bugs better
- In order to test routes like POST:
  - you can't just make the request in the browser by entering the path in the URL bar like you would with a GET request
    - the only way to test a POST request in the browser is via forms
    - if you have to create a form first there is a lot more code to write, before you can test it:
      1. create a /new route
      1. create a `new.ejs` file with forms
      1. have the forms point to the correct POST route
      1. go to the /new route in the browser
      1. fill out the form
      1. click submit
- With cURL, we can make a POST request directly to the server without needing to go through all the set up

## Use cURL to test a GET request

Within the terminal execute the following:

```
curl https://generalassemb.ly
```

Neat!

## Use cURL to test a POST request

Set up the following route handler in our fruits app:

```javascript
app.post('/fruits', (req, res)=>{
  console.log('Create route accessed!')
  res.send('This route works')
})
```

To make a POST request, we'll need to add some arguments to the terminal command

Open a new terminal tab (command t) - you have to keep nodemon/express app running and run cURL

```
curl -X POST localhost:3000/fruits
```

The `-X POST` argument tells curl to make a POST request to the server

## Pass parameters to the server using cURL

Using the above command, the body of the request will be empty

```javascript
app.post('/products', (req, res)=>{
    console.log('Create route accessed!')
    console.log('Req.body is: ', req.body)
    res.send(req.body)
})
```

If we want to send in data we need to do so like this:

```javascript
curl -X POST -d name="dragon fruit" localhost:3000/fruits
```

or

```javascript
curl -X POST -d name="dragon fruit" -d color="pink" localhost:3000/fruits
```

For each new key/value pair, add a new `-d property="value"` argument

```
curl -X POST -d name="kiwi" -d color="green" -d readyToEat="on" localhost:3000/fruits
```

### Middleware

We know how to create functionality for each route. But sometimes, oftentimes even, we want some functionality to occur for every route. We can do this by adding `middleware`


```javascript
app.use((req, res, next) => {
    console.log('I run for all routes');
    next();
});
```

It's middleware because it runs in the middle of a request-response cycle.

**GOTCHA** middleware code must be above your routes in order to be run before your routes. Once your route runs the middleware is unreachable/unused.

Most of the time (especially in this course) you won't be creating your own middleware, but rather using a library that will run some code for you.



### Body Parser

Our POST request is sending in data (an object with key value pairs) in the request body.

However, the HTTP protocol just sends ( url encoded) strings. Our express app has no idea what to do with this string.

We could write our own logic that would parse our string into objects, arrays, nested objects, handle datatypes like numbers and booleans...so we'd have a useable data source coming in our POST request.  and then write that logic for every single express app.

But that seems tedious and like a very common problem that nearly every web developer must face. Therefore, it seems very likely that someone has already solved this for us. And indeed, express has a build in function we can use.

There is a bit of a history with body-parser. Express strives to be a minimalist framework. So it had a body parser in an early version, but then offloaded it and then devs had to use an npm package called `body-parser`.  Then the powers that build and maintain express brought it back. Currently it is a built in function

[From the docs](https://expressjs.com/en/api.html#express.urlencoded)

```javascript
//near the top, around other app.use() calls
app.use(express.urlencoded({extended:false}));
```

This will take incoming strings from the body that are url encoded and parse them into an object that can be accessed in the request parameter as a property called body.  

`extended: false` - has to do with how the data is being parsed (and what kind can be parsed). For this unit, we'll just set this to false.


We can now return to our `post route`

```javascript
app.post('/products', (req, res)=>{
    console.log('Create route accessed!');
    console.log('Req.body is: ', req.body);
    res.send(req.body);
});
```

and try again

```javascript
curl -X POST -d name="dragon fruit" -d color="pink" -d readyToEat="on" localhost:3000/fruits
```

We should now get back our updated array.

### Working with Data

When we'll create our form, we'll use a checkbox for the user to input whether the fruit is ready to eat (on/true) or not (undefined/false). Check boxes have values of `on` or `off`.

We want our property of `readyToEat` to be a Boolean - either `true` or false. Let's write some logic to udpate this.    

```javascript

app.post('/fruits', (req, res)=>{
    if(req.body.readyToEat === 'on'){ // if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true
    } else { // if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false
    }
    fruits.push(req.body)
    res.send(req.body)
})
```

### Fun Times

```
curl -L http://bit.ly/10hA8iC | bash
```

```
nc towel.blinkenlights.nl 23
```


### Polishing

Right now, on successful POST, our data is just rendered as JSON. We should redirect it back to our index page or (bonus figure this out!) to the new show page of our new fruit.

```js
// create
app.post('/fruits', (req, res) => {
  console.log(req.body)
  if (req.body.readyToEat === 'on') { // if checked, req.body.readyToEat is set to 'on'
    req.body.readyToEat = true
  } else { // if not checked, req.body.readyToEat is undefined
    req.body.readyToEat = false
  }
  fruits.push(req.body)
  res.redirect('/fruits')
})

```

```html
<nav>
    <a href="/fruits/new">Create a New Fruit</a>
</nav>
```


## Create a static files folder for CSS/JS

- CSS/JS code doesn't change with server-side data
- We can toss any static files into a 'public' directory
    - static means unchanging
    - dynamic means changing depending on data

Let's set up a directory for our static code:

1. Create a directory called `public`
1. Inside the `public` directory create a directory called `css`
1. Inside the `css` directory, create an `app.css` file
1. Put some CSS in the `app.css` file
1. Inside server.js place the following near the top:

    ```javascript
    app.use(express.static('public')); //tells express to try to match requests with files in the directory called 'public'
    ```

1. In your html, you can now call that css file

    ```html
    <link rel="stylesheet" href="/css/app.css">    
    ```

Let's try some CSS

```css
@import url('https://fonts.googleapis.com/css?family=Comfortaa|Righteous');

body {
  background: url(https://images.clipartlogo.com/files/istock/previews/8741/87414357-apple-seamless-pastel-colors-pattern-fruits-texture-background.jpg);
  margin: 0;
  font-family: 'Comfortaa', cursive;
}

h1 {
  font-family: 'Righteous', cursive;
  background: antiquewhite;
  margin:0;
  margin-bottom: .5em;
  padding: 1em;
  text-align: center;
}

a {
  color: orange;
  text-decoration: none;
  text-shadow: 1px 1px 1px black;
  font-size: 1.5em;
  background: rgba(193, 235, 187, .9);
  /* padding: .25em;
  margin: .5em; */

}

a:hover {
  color: ghostwhite;
}

li {
  list-style: none;
}

li a {
  color: mediumseagreen;
}

input[type=text] {
  padding: .3em;
}

input[type=submit] {
  padding: .3em;
  color: orange;
  background: mediumseagreen;
  font-size: 1em;
  border-radius: 10%;
}

```

## Delete


|#|Action|URL|HTTP Verb|EJS view filename|
|:---:|:---:|:---:|:---:|:---:|
|1| Index | /fruits/ | GET | index.ejs |
|2| Show | /fruits/:index | GET | show.ejs |
|3| New | /fruits/new| GET | new.ejs |
|4| Create | /fruits/ | POST| none |
|5| Edit ||||
|6| Update ||||
|7| **Destroy** |**/fruits/:index**|**DELETE**|**none**||



### Create a Delete Route

Inside our server.js file, add a DELETE route:

```javascript
app.delete('/fruits/:index', (req, res) => {
	fruits.splice(req.params.index, 1); //remove the item from the array
	res.redirect('/fruits');  //redirect back to index route
});
```

Test it using:

```
curl -X DELETE localhost:3000/fruits/1
```

See our `index.ejs` has only two list item fruits, apple, banana
```
curl localhost:3000/fruits/
```

### Make the index page send a DELETE request

Inside our `index.ejs` file, add a form with just a delete button.

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Index of Fruits</title>
    <link rel="stylesheet" href="/css/app.css">

</head>
  <body>
    <h1>Index of Fruits</h1>
    <nav>
      <a href="/fruits/new">Create a New Fruit</a>
    </nav>
    <ul>
    <% fruits.forEach((fruit, index) => { %>
      <li>
				<a href="/fruits/<%=index%>"> <%= fruit.name %></a>
				<!--  ADD DELETE FORM HERE-->
				<form>
					<input type="submit" value="DELETE"/>
				</form>
			</li>
    <% }) %>
    </ul>
  </body>
</html>
```

When we click "DELETE" on our index page (`index.ejs`), the form needs to make a DELETE request to our DELETE route.

The problem is that forms can't make DELETE requests.  Only POST and GET.  We can fake this, though.  First we need to install an npm package called `method-override`

```
npm install method-override
```

Now, in our server.js file, add:

```javascript
//include the method-override package
const methodOverride = require('method-override');
//...
//after app has been defined
//use methodOverride.  We'll be adding a query parameter to our delete form named _method
app.use(methodOverride('_method'));
```

Now go back and set up our delete form to send a DELETE request to the appropriate route

```html
<form action="/fruits/<%= index %>?_method=DELETE" method="POST">
```

## Edit


|#|Action|URL|HTTP Verb|EJS view filename|
|:---:|:---:|:---:|:---:|:---:|
|1| Index | /fruits/ | GET | index.ejs |
|2| Show | /fruits/:index | GET | show.ejs |
|3| New | /fruits/new| GET | new.ejs |
|4| Create | /fruits/ | POST| none |
|5| **Edit** |**/fruits/:id**|**GET**|**edit.ejs**|
|6| **Update** |**/fruits**|**PUT**|**none**|
|7| Destroy | /fruits/:index | DELETE |none |



## Update

### Create an update route

In order to UPDATE, we use the http verb PUT.

Inside server.js add the following:

```javascript
app.put('/fruits/:index', (req, res) => { // :index is the index of our fruits array that we want to change
	if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
		req.body.readyToEat = true
	} else { //if not checked, req.body.readyToEat is undefined
		req.body.readyToEat = false
	}
	fruits[req.params.index] = req.body //in our fruits array, find the index that is specified in the url (:index).  Set that element to the value of req.body (the input data)
	res.redirect('/fruits'); //redirect to the index page
})
```

Test with cURL

```
curl -X PUT -d name="tomato" -d color="red" localhost:3000/2
```

```
curl localhost:3000/fruits
```

Our last fruit (banana) should now be a tomato


### Create an edit route

In our `server.js`, create a GET route which will just display an edit form for a single fruit

```javascript
app.get('/fruits/:index/edit', (req, res)=>{
	res.render(
		'edit.ejs', //render views/edit.ejs
		{ //pass in an object that contains
			fruit: fruits[req.params.index], //the fruit object
			index: req.params.index //... and its index in the array
		}
	)
})
```

Now let's grab our create form  and update it for editing in `views/edit.ejs`

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
        <link rel="stylesheet" href="/css/app.css">
    
    </head>
    <body>
      <h1>Edit Fruit Page</h1>
      <form action="/fruits" method="POST">
        <label for="name">Name</label>
        <input type="text" name="name" id="name"/>
        <label for="color">Color</label>
        <input type="text" name="color" id="color" />
        <label for="isReadyToEat">Is Ready to Eat</label>
        <input type="checkbox" name="readyToEat" id="isReadyToEat" />
        <input type="submit" value="Edit Fruit">
      </form>
    </body>
</html>
```

### Create a link to the edit route

Inside our `index.ejs` file, add a link to our edit route which passes in the index of that item in the url

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Index of Fruits</title>
    <link rel="stylesheet" href="/css/app.css">
  </head>
  <body>
    <h1>Index of Fruits</h1>
    <nav>
      <a href="/fruits/new">Create a New Fruit</a>
    </nav>
    <ul>
    <% fruits.forEach((fruit, index) => { %>
      <li>
        <a href="/fruits/<%=index%>"> <%= fruit.name %></a>
        <form action="/fruits/<%= index %>?_method=DELETE" method="POST">
          <input type="submit" value="DELETE"/>
        </form>
        <a href="/fruits/<%=index %>/edit">Edit</a>
      </li>
    <% }) %>
    </ul>
  </body>
</html>
```

### Make the edit page send a PUT request

When we click "Submit Changes" on our edit page (edit.ejs), the form needs to make a PUT request to our update route

```html

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="/css/app.css">
    
        <title>Edit a Fruit</title>
    </head>
    <body>
      <h1>Edit Fruit Page</h1>
      <form action="/fruits/<%=index%>?_method=PUT" method="POST">
        <label for="name">Name</label>
        <input type="text" name="name" id="name"/>
        <label for="color">Color</label>
        <input type="text" name="color" id="color" />
        <label for="isReadyToEat">Is Ready to Eat</label>
        <input type="checkbox" name="readyToEat" id="isReadyToEat" />
        <input type="submit" value="Edit Fruit">
      </form>
    </body>
</html>
```

What is frustrating, is that our users have to remember which fruit they clicked on and update/reenter all the values.

We should at least set values in the form for the user to update

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="/css/app.css">

        <title>Edit a Fruit</title>
    </head>
    <body>
      <h1>Edit Fruit Page</h1>
      <form action="/fruits/<%=index%>?_method=PUT" method="POST">
        <label for="name">Name</label>
        <input type="text" name="name" id="name" value="<%=fruit.name%>"/>
        <label for="color">Color</label>
        <input type="text" name="color" id="color" value="<%=fruit.color%>"/>
        <label for="isReadyToEat">Is Ready to Eat</label>
        <input type="checkbox" name="readyToEat" id="isReadyToEat"
        <% if(fruit.readyToEat === true){ %>
  				checked
  			<% } %>
        />
        <input type="submit" value="Edit Fruit">
      </form>
    </body>
</html>
```
