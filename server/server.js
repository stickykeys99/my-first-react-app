const express = require('express')
const app = express()

const PORT_NO = 8080

app.listen(PORT_NO, ()=>console.log(`Server opened at port ${PORT_NO}`))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// movie has year, poster (image link), title, then genre

// TODO: put these all in a sqlite database

// these are currently unpersistent, revokes all changes via requests upon reload of the code
const genres = ["Action", "Fantasy"]

let movies = [{title: 'The Dark Knight Rises', year: 2012, genreId: 0, poster: 'https://upload.wikimedia.org/wikipedia/en/8/83/Dark_knight_rises_poster.jpg'}, {title: 'Avatar: The Way of Water', year: 2022, genreId: 1, poster: 'https://i.ebayimg.com/images/g/NLMAAOSw~NZjm0Eh/s-l400.jpg'}]

// movies endpoints

const mvsRtr = express.Router()
app.use('/movies',mvsRtr)

mvsRtr.param('id',(req,res,next,id)=>{
    if (id >= movies.length) {
        res.status(404).end("No such movie in database")
    }
    req.movie = movies[id]
    next()
})

// GET /movies - get all movies, filterable by term and genreId
// POST /movies - Create a new Movie record

mvsRtr.route('/')
    .get((req,res)=>{
        res.send(movies)
        // TODO: filtering via term and genreId
    })
    .post((req,res)=>{
        let movie = {title: req.body.title,
            year: req.body.year,
            genreId: req.body.genreId,
            poster: req.body.poster
        }
        movies.push(movie)
        res.end()

        // TODO: validation
    })

// GET /movies/:id - get a movie based on id
// PUT/PATCH /movies/:id - Update the movie details by id
// DELETE /movies/:id - Delete a Movie by :id 

mvsRtr.route('/:id')
    .get((req,res)=>{
        res.json(req.movie)
        return genres[req.movie.genreId]
    })
    .put((req,res)=>{
        let movie = {title: req.body.title,
            year: req.body.year,
            genreId: req.body.genreId,
            poster: req.body.poster
        }
        movies.splice(req.params.id,1,movie)
        res.end()
        // TODO: validation
    })
    .delete((req,res)=>{
        let id = req.params.id
        movies.splice(id,1)
        res.end()
    })

// create the same endpoint for /genres
// movie endpoints must return genre