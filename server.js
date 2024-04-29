
//1.
const express = require('express');
const moviesData = require("./Movie_Data/data.json");

//2.
const app = express()
const port = 3000

//4.
app.get("/", handleHomePage);
app.get("/favorite", handleFavorite);
app.get("/handleErrors", handleErrors);



//functions:
function handleHomePage(req, res) {
    let newMovie = new Movie(moviesData.title, moviesData.poster_path, moviesData.overview);
    res.json(newMovie);
}

function handleFavorite(req, res) {
    res.send("Welcome to Favorite Page");
}
function handleErrors(req, res) {
    if (res.statusCode == 500) {
        res.json({
            "status": 500,
            "responseText": "Sorry, something went wrong"
        });
    }
    if (res.statusCode == 404) {
        res.json({
            "status": 404,
            "responseText": "Sorry, something went wrong"
        });
    }
    if (res.statusCode == 200) {
        res.json({
            "status": 200,
            "responseText": "Everything is okay"
        });
    }

}
//3.
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

function Movie(title, posterPath, overView) {
    this.title = title;
    this.posterPath = posterPath;
    this.overView = overView;

}