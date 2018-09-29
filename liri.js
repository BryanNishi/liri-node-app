//load APIs from ignored file
require("dotenv").config();

//define global variables
var keys = require("./keys");
var fs = require("fs");
var command = process.argv[2];
var input = process.argv[3];
var nodeArgs = process.argv;
var input = "";
//if user search is longer than one word, this will concatenate it to a usefull string.
for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        input = input + "+" + nodeArgs[i];
    } else {
        input += nodeArgs[i];
    }
}
//Log search into log.txt
fs.appendFileSync("log.txt", "\n" + command + input + "\n", function (err) {
    if (err) throw err;
});

//*************************************************Spotify search********************************************************
if (command === "spotify-this-song") {
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(keys.spotify);
    //Defualt search term
    if (!input) {
        input = "The Sign  ace of base";
    }
    //Spotify request
    spotify.search({
        type: 'track',
        query: input,
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var spotifyData = [
            "Song Title: " + data.tracks.items[0].name,
            "Artist: " + data.tracks.items[0].album.artists[0].name,
            "Album: " + data.tracks.items[0].album.name,
            "Preview URL: " + data.tracks.items[0].preview_url,
        ].join("\n\n");
        //display result
        console.log(spotifyData);
        //log result to log.txt
        fs.appendFileSync("log.txt", spotifyData, function (err) {
            if (err) throw err;
        });
    });
    //*********************************************************concert search*****************************************************
} else if (command === "concert-this") {
    //Default search term
    if (!input) {
        input = "Taylor Swift";
    }
    //bands in town request
    var bands = require("request");
    bands("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp", function (error, response, body) {

        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            //init moment and format time response
            var moment = require("moment");
            var time = moment(data[0].datetime).format('ddd MMM Do YYYY h:mm a');
            //loop for each event
            for (i = 0; i < data.length; i++) {
                var concertData = [
                    "Artist: " + input,
                    "Venue: " + data[i].venue.name,
                    "Location: " + data[i].venue.city + ", " + data[i].venue.region,
                    "Date of Event: " + time,
                ].join("\n\n");
                //display result(s)
                console.log(concertData);
                //Log result to log.txt
                fs.appendFileSync("log.txt", concertData, function (err) {
                    if (err) throw err;
                });
            }
        }
    });
    //************************************************************Movie Search******************************************************
} else if (command === "movie-this") {

    var omdb = require("request");
    //default serach term
    if (!input) {
        input = "Mr. Nobody";
    }
//ombd request
    omdb("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            var movieData = [
                "Title: " + data.Title,
                "Release Year: " + data.Year,
                "IMDB Rating: " + data.Ratings[0].Value,
                "Rotten Tomatoes Rating: " + data.Ratings[1].Value,
                "Country: " + data.Country,
                "Language: " + data.Language,
                "Plot: " + data.Plot,
                "Actors: " + data.Actors
            ].join("\n\n");
            //display result
            console.log(movieData);
            //log result to log.txt
            fs.appendFileSync("log.txt", movieData, function (err) {
                if (err) throw err;
            });
        }
    });
//*********************************************************random.txt search*****************************************************
} else if (command === "do-what-it-says") {
    //get search term from random.txt file
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        //concatenate if text is more than one word
        dataArr = data.split(", ");
        for (i = 0; i < dataArr.length; i++) {
            var searchTerm = dataArr[i];
        }
        //run same spotify function as above
        var Spotify = require('node-spotify-api');
        var spotify = new Spotify(keys.spotify);
        spotify.search({
            type: 'track',
            query: searchTerm,
        }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            var whatItSaysData = [
                "Song Title: " + data.tracks.items[0].name,
                "Artist: " + data.tracks.items[0].album.artists[0].name,
                "Album: " + data.tracks.items[0].album.name,
                "Preview URL: " + data.tracks.items[0].preview_url,
            ].join("\n\n");
            console.log(whatItSaysData);
            fs.appendFileSync("log.txt", whatItSaysData, function (err) {
                if (err) throw err;
            });
        });
    })

//*****************************************************no input************************************************************
} else {
    console.log("please enter a command(concert-this, spotify-this-song, movie-this, or do-what-it-says) and search term");
}