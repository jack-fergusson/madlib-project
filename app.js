const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
require('dotenv').config();

// import { Configuration, OpenAIApi } from "openai";
const Configuration = require("openai").Configuration;
const OpenAIApi = require("openai").OpenAIApi;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var output = "";

function generatePrompt(adjective) {
    return "Write me a short" + adjective + " poem.";
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get("/", function(req, res) {
    res.render("home", {
        output: output
    });
});

app.post("/", async function(req, res) {
    console.log(req.body.adjective);
    const adjective = req.body.adjective;

    const completion = await openai.createCompletion({
        model: "text-curie-001",
        prompt: generatePrompt(adjective),
        temperature: 0.6,
        max_tokens: 64,
      });
    output = completion.data.choices[0].text;

    res.redirect("/");
});

app.listen(3000, function() {
    console.log("Server running on port 3000!");
});