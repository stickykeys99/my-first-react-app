const express = require('express')
const sqlite3 = require('sqlite3')
const app = express()
let sql

function logError(err) {
    if(err) return console.error(err.message)
}

function dbrun() {
    db.run(sql,(err)=>logError(err))
}

function getGenreRow(res,name) {
    sql = `SELECT * FROM genres WHERE name='${name}' LIMIT 1`
    db.all(sql, (err,genres)=>{
        logError(err)
        if (genres.length === 0) returnVal = {id:null, name: "Unknown"}
        else returnVal = genres[0]
    })
    return returnVal
}

const PORT_NO = 8080

app.listen(PORT_NO, ()=>console.log(`Server opened at port ${PORT_NO}`))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// movie has year, poster (image link), title, then genre

// TODO: put these all in a sqlite database

// these are currently unpersistent, revokes all changes via requests upon reload of the code
const genres = ["Action", "Fantasy"]

let movies = [{title: 'The Dark Knight Rises', year: 2012, genreId: 0, poster: 'https://upload.wikimedia.org/wikipedia/en/8/83/Dark_knight_rises_poster.jpg'}, {title: 'Avatar: The Way of Water', year: 2022, genreId: 1, poster: 'https://i.ebayimg.com/images/g/NLMAAOSw~NZjm0Eh/s-l400.jpg'}]

const db = new sqlite3.Database("./movieland.db",(err)=>logError(err))

// movies endpoints

const mvsRtr = express.Router()
app.use('/movies',mvsRtr)

mvsRtr.param('id',(req,res,next,id)=>{
    // if (id >= movies.length) {
    //     res.status(404).end("No such movie in database")
    // }
    // req.movie = movies[id]
    sql = `SELECT * FROM movies WHERE id=${id} LIMIT 1`
    db.all(sql,(err,movies)=>{
        logError(err)
        if (movies.length === 0) res.status(404).end("No such movie in database")
        req.movie = movies[0]
        // is it allowed to have next here?
        next()
    })
    // if next is here after as usual 
})

// GET /movies - get all movies, filterable by term and genreId
// POST /movies - Create a new Movie record

mvsRtr.route('/')
    .get((req,res)=>{
        data = []
        sql = `SELECT * FROM movies`
        // db.all(sql,(err,movies)=>{
        //     logError(err)
        //     if (movies.length === 0) res.status(404).end("No movies found in database")

        //     myData = movies.map((val)=>({
        //         ...val,
        //         genre: getGenreRow(res,val.genre)
        //     }))

        //     // myData = movies.map((val)=>{
        //     //     db.all(`SELECT * FROM genres WHERE name='${val.genre}' LIMIT 1`, (err,genres)=>{
        //     //         l
        //     //         logError(err)
        //     //         if (genres.length === 0) 
        //     //     })
        //     // })

        //     res.send({
        //         data: myData
        //     })

        // })

        db.each(sql,(err,movie)=>{
            logError(err)
            db.all(`SELECT * from genres WHERE name='${movie.genre}' LIMIT 1`, (err,genres)=>{
                logError(err)
                let genreObj;
                if (genres.length === 0) genreObj = {id: null, name: 'Unknown'}
                else genreObj = genres[0]
                data.push({...movie, genre: genreObj})
            })
        })

        if (data.length === 0) res.send("No movies found in database")

        res.send({
            data: data
        })

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

function getGenre(id) {
    if (id >= genres.length) return "Unknown"
    return genres[id]
}