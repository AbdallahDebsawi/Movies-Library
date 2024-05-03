
//1.
const express = require('express');
const cors = require('cors');
const axios = require('axios').default;
require('dotenv').config();

const moviesData = require("./Movie_Data/data.json");
const apiKey = process.env.API_KEY;

//2.
const app = express();
app.use(cors());
const port = 3000

//4.
app.get("/", handleHomePage);
app.get("/favorite", handleFavorite);
app.get("/handleErrors", handleErrors);
app.get('/trending', handleTrending);
app.get("/search", handleSearch);
app.get('/popular', handlePopular);
app.get('/topRated', handleTopRated);




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

// axios.get().then().catch()
function handleTrending(req, res) {
    // waiting to get data from 3rd API
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US"`
    axios.get(url)
        .then(result => {
            console.log(result);
            let movies = result.data.results.map(movie => {
                return new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview);
            })
            res.json(movies);
        })
        .catch((error) => {
            console.log(error);
            res.send("Inside catch")
        })


}

function handleSearch(req, res) {
    let movieName = req.query.name;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieName}`
    axios.get(url)
        .then(result => {
            res.json(result.data.results)
        })
        .catch();
}
function handleTopRated(req, res) {

    let url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
    axios.get(url).then(reslut => {

        let topRatedMovies = reslut.data.results.map((movie) => {
            return new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview);
        });

        res.json(topRatedMovies);

    })
        .catch(error => {
            console.log(error)
        });
}
function handlePopular(req, res) {

    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;
    axios.get(url).then(reslut => {

        let popularMovies = reslut.data.results.map((movie) => {
            return new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview);
        });

        res.json(popularMovies);

    })
        .catch(error => {
            console.log(error)
        });
}









//3.
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

function Movie(id, title, releaseDate, posterPath, overView) {
    this.id = id;
    this.title = title;
    this.releaseDate = releaseDate;
    this.posterPath = posterPath;
    this.overView = overView;

}