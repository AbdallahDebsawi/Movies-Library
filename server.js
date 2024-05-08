//1.
const express = require('express');
const cors = require('cors');
const axios = require('axios').default;
const bodyParser = require('body-parser');
require('dotenv').config();
const moviesData = require("./Movie_Data/data.json");
const { Client } = require('pg')


const apiKey = process.env.API_KEY;
const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 3001;

const client = new Client(DB_URL)


//2.
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//4.routes
app.get("/", handleHomePage);
app.get("/favorite", handleFavorite);
app.get("/handleErrors", handleErrors);
app.get('/trending', handleTrending);
app.get("/search", handleSearch);
app.get('/popular', handlePopular);
app.get('/topRated', handleTopRated);
app.post("/addMovie", handleAddMovie);
app.get("/getMovies", handleGetMovies);
app.get("/getMovieById/:id", handleGetMovieById);
app.put("/updateMovieById/:id", handleUpdateMovieById)
app.delete("/deleteMovieById/:id", handleDeleteMovieById)




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

function handleAddMovie(req, res) {
    const { title, release_date, poster_path, overView } = req.body;
    // let id = 1;
    let sql = 'INSERT INTO movie(title, release_date, poster_path, overView ) VALUES($1, $2, $3, $4) RETURNING *;'
    let values = [title, release_date, poster_path, overView];
    client.query(sql, values).then((result) => {
        console.log(result.rows);
        return res.status(201).json(result.rows[0]);
    }).catch((err) => {
        res.json(`there was an error:" ${err}`);
    });


}

function handleGetMovies(req, res) {

    let sql = 'SELECT * from movie;'
    client.query(sql).then((result) => {
        res.json(result.rows);

    }).catch((err) => {
        res.json(`there was an error here: ${err}`);
    });
}


function handleGetMovieById(req, res) {
    let { id } = req.params;
    let sql = 'SELECT * from movie WHERE id=$1;'
    let value = [id];
    client.query(sql, value).then((result) => {
        res.json(result.rows[0]);
    }).catch(error => {
        console.log("there was an error", error);
    });
}

function handleUpdateMovieById(req, res) {
    const { id } = req.params;
    const { title, release_date, poster_path, overView } = req.body;

    let sql = `UPDATE movie SET title = $1, release_date = $2, poster_path = $3, overView = $4 WHERE id = $5 RETURNING *;`
    let values = [title, release_date, poster_path, overView, id];

    client.query(sql, values).then(result => {
        res.json(result.rows[0]);
    }

    ).catch(error => {
        console.log("there was an error", error);
    });
}
function handleDeleteMovieById(req, res) {
    const { id } = req.params;
    let sql = 'DELETE FROM movie WHERE id=$1 RETURNING *;'
    let value = [id];
    client.query(sql, value).then(result => {
        res.send(result.rows[0]);
    }
    ).catch(error => {
        console.log("there was an error", error);
    })
}







//3.
client.connect().then(() => {

    app.listen(PORT, () => {
        console.log(`app listening on port ${PORT}`)
    });
})

function Movie(title, release_date, poster_path, overView) {
    // this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overView = overView;

}