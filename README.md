# My Node Express Mongoose Setup Checklist

- make a new repo or fork an existing repo and clone it to your working folder
- cd into cloned directory `touch server.js`
- create main folders for MVC workflow (make sure to plan first)
  - example: `mkdir controllers db models public views`
- DON'T FORGET: `touch .gitignore` file and add `node_modules` in the file
- install dependencies (make sure to plan it first or do it as needed)
  - `npm init -y` 
  - `npm install express`, `npm install mongoose`, `npm install ejs`, `express-ejs-layouts`, `method-override`
- setup create your js and ejs files as needed and test configurations and connections
- most likely this might be the file structure to begin:

```.
├── README.md
├── controllers
│   └── store.js
├── db
│   ├── connection.js
│   ├── seeds.js
│   └── storeSeeds.js
├── models
│   └── product.js
├── package-lock.json
├── package.json
├── public
│   ├── css
│   └── img
├── server.js
└── views
    ├── edit.ejs
    ├── index.ejs
    ├── layout.ejs
    ├── new.ejs
    └── show.ejs
```
- git add and commit often!
- make git messages very clear and discriptive
- get the routes and functions to work before design
- seed your data with dummy data and get store working before moving forward



