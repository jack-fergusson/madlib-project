const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
require('dotenv').config();
const path = require('path');

// hosting services wont have same port as you
const PORT = process.env.PORT || 3000;

// import { Configuration, OpenAIApi } from "openai";
const Configuration = require("openai").Configuration;
const OpenAIApi = require("openai").OpenAIApi;

// lists of artists and nouns to pull from
const artists = ["Vincent van Gogh", "Salvador Dali", "Leonardo da Vinci"];
const nouns = ["a clown", "a house", "a shoe", "themself"];

// initialize the app
const app = express();

// set the app's view engine to ejs
app.set('view engine', 'ejs');
// Allow the app to parse the bodies of res's
app.use(bodyParser.urlencoded({extended: true}));
// give access to static files such as stylesheets
app.use(express.static(path.join(__dirname, "public")));

app.set('views', path.join(__dirname, 'views'));

// Empty string to contain the output from AI
var output = "..\public\images\cow-walking.gif";
var artist = "";
var noun = "";
var result = "";
var spendTwoCents = 0;


// Creat the prompt given an adjective
function generatePrompt() {
    artist = artists[Math.floor(Math.random()*artists.length)];
    noun = nouns[Math.floor(Math.random()*artists.length)];

    return artist + " painting of a " + noun;
}

// new object to pass when creating an instance
// of the API. It contains information
// such as the API key.
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
// creat an instance of the API
const openai = new OpenAIApi(configuration);

// root route
app.get("/", function(req, res) {
    res.render("home", {

    });
});

app.get("/image", function(req, res) {
    res.render("image", {
        output: output,
        nouns: nouns,
        artists: artists,
        result: result,
    });
});

// what to do upon post request from root
// must be an asynchronous function to account
// for response from API.
app.post("/", async function(req, res) {
    // console.log(req.body.adjective);
    // // extract the given adjective using bodyParser
    // const adjective = req.body.adjective;

    // // call the API given the prompt & other 
    // // options. Store response in an object.
    // const completion = await openai.createCompletion({
    //     model: "text-curie-001",
    //     prompt: generatePrompt(adjective),
    //     temperature: 0.6,
    //     max_tokens: 64,
    //   });
    // // change the value for the output string
    // output = completion.data.choices[0].text;

    if (spendTwoCents) {
        const response = await openai.createImage({
            prompt: generatePrompt(),
            n: 1,
            size: "256x256",
        });
        output = response.data.data[0].url;
    }

    // redirect to root, where output should now show
    res.redirect("/image");
});

app.post("/image", function(req, res) {
    if (req.body.artist == artist && req.body.noun == noun) {
        result = "Huzzah! You did it."
    } else {
        result = ("Sorry, Artist: " + artist + " Noun: " + noun);
    }

    res.redirect("/image");
});

app.listen(PORT, function() {
    console.log("Server running on port " + PORT);
});