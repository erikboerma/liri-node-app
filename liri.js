require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


var command = process.argv[2];
var choices = process.argv.slice(3).join(" ");

switch (command) {
    case "concert-this":
        concertThis(choices);
        break;
    case 'spotify-this-song':
        spotifyThisSong(choices);
        break;
    case 'movie-this':
        movieThis(choices);
        break;
    case 'do-what-it-says':
        doWhatItSays(choices);
        break;
    default:
        console.log("Invalid command, please chose from concert-this, spotify-this-song, movie-this or do-what-it-says")
};

function concertThis(choices) {
    axios.get("https://rest.bandsintown.com/artists/" + choices + "/events?app_id=codingbootcamp")
        .then(function (response) {
            for (var i = 2; i < 5; i++) {
                var jsonData = response.data[i];

                var showData = [
                    "----------------------------",
                    "Name of venue: " + jsonData.venue.name,
                    "Location of venue: " + jsonData.venue.city + ", " + jsonData.venue.region,
                    "Time of event: " + jsonData.datetime,
                    "----------------------------"
                ].join("\n\n");

                console.log(showData);
                logIt(showData);

                // console.log("Name of venue: " + response.data[1].venue.name);
                // console.log("Location of venue: " + response.data[1].venue.city + ", " + response.data[1].venue.country);
                // console.log("Time of event: " + response.data[1].datetime);
            }

        }).catch(function (error) {
            if (error === undefined)
                console.log(error);
        });
}

function spotifyThisSong(choices){
console.log(choices)
if(!choices){
    choices = "The Sign";
}
spotify.search({ type: 'track', query: choices })
.then(function(response) {
    for (var i = 0; i < 5; i++) {
        var spotifyResults = [
            "------------------",
                "Artist(s): " + response.tracks.items[i].artists[0].name,
                "Song Name: " + response.tracks.items[i].name,
                "Preview Link: " + response.tracks.items[i].preview_url,
                "Album Name: " + response.tracks.items[i].album.name
        ].join('\n');
        console.log(spotifyResults);
        logIt(spotifyResults);

    }
})
.catch(function(err) {
    console.log(err);
});
}

function movieThis(choices) {
    if (!choices) {
        choices = "mr nobody";
        // console.log(choices)
    }

    axios.get("https://www.omdbapi.com/?t=" + choices + "&apikey=trilogy")
        .then(function (response) {
            // console.log(response);
            var movieResults = [
                "----------------------",
                "Movie Title: " + response.data.Title,
                "Year of Release: " + response.data.Year,
                "IMDB Rating: " + response.data.imdbRating,
                "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value,
                "Country Produced: " + response.data.Country,
                "Language: " + response.data.Language,
                "Plot: " + response.data.Plot,
                "Actors/Actresses: " + response.data.Actors
            ].join('\n');
            console.log(movieResults);
            logIt(movieResults);

        }).catch(function (error) {
            if (error === undefined)
                console.log(error);
        });

}

function doWhatItSays(){
    // console.log('you will do as I tell you!');

fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
        return console.log(error);
    }
    var dataArr = data.split(',');
    spotifyThisSong(dataArr[1]);
    // console.log(dataArr[1]);
})
}

function logIt(log){
    fs.appendFile('log.txt', log + "\n--------------", function (error){
        if(error){
            console.log('Unable to log results');
        }
    })
};