require("dotenv").config();
var keys = require("./keys");

var command = process.argv[2];
var input = process.argv[3];

if (command === "spotify-this-song") {
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(keys.spotify);
    spotify.search({
        type: 'track',
        query: input,
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Song Title: " + data.tracks.items[0].name);
        console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("Preview URL: " + data.tracks.items[0].preview_url);

    });
} else if (command === "concert-this") {

    var bands = require("request");
    bands("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp", function (error, response, body) {

        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
           //console.log(data[0].offers);
            // Name of the venue
            // Venue location
            // Date of the Event (use moment to format this as "MM/DD/YYYY")
            console.log("Venue: " + data[0].venue.name + "\nLocation: " + data[0].venue.city + ", " + data[0].venue.region + "\nDate of Event: " + data[0].venue.datetime);
        }
    });
} else if (command === "movie-this") {

    var omdb = require("request");

    // Then run a request to the OMDB API with the movie specified
    omdb("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy", function (error, response, body) {


        if (!error && response.statusCode === 200) {

            // * Title of the movie.
            // * Year the movie came out.
            // * IMDB Rating of the movie.
            // * Rotten Tomatoes Rating of the movie.
            // * Country where the movie was produced.
            // * Language of the movie.
            // * Plot of the movie.
            // * Actors in the movie.
            var data = JSON.parse(body);
            console.log("Title: " + data.Title + "\nRelease Year: " + data.Year + "\nIMDB Rating: " + data.Ratings[0].Value + "\nRotten Tomatoes Rating: " + data.Ratings[1].Value + "\nCountry: " + data.Country + "\nLanguage: " + data.Language + "\nPlot: " + data.Plot + "\nActors: " + data.Actors);
        }
    });

} else {
    console.log("do whatever");
}