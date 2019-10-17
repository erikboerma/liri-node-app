require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var choices = process.argv[3];