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

const PORT_NO = 8080

app.listen(PORT_NO, ()=>console.log(`Server opened at port ${PORT_NO}`))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// movie has year, poster (image link), title, then genre

const db = new sqlite3.Database("./movieland.db",(err)=>logError(err))

//
// TODO: have the foreign key the genre "id" not the name. will need to rebuild the table, and modify the endpoints
//

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
        next()
    })
})

// GET /movies - get all movies, filterable by term and genreId
// POST /movies - Create a new Movie record

mvsRtr.route('/')
    .get((req,res)=>{
        sql = `SELECT * FROM movies`

        db.all(sql,(err,movies)=>{
            logError(err)
            if (movies.length === 0) res.end("No movies found in database")

            data = []

            movies.forEach((movie,ind)=>{
                db.all(`SELECT * FROM genres WHERE name='${movie.genre}' LIMIT 1`, (err,genres)=>{
                    let genreObj
                    if (genres.length === 0) genreObj = {id: null, name: 'Unknown'}
                    else genreObj = genres[0]
                    data.push({...movie,genre:genreObj})
                    if (ind===movies.length-1) {
                        res.send({data: data})
                    }
                })
            })
        })

        // TODO: filtering via term and genreId
    })
    .post((req,res)=>{
        sql = `INSERT INTO movies(title, year, genre, poster) VALUES (?,?,?,?)`

        db.run(sql,[req.body.title,req.body.year,req.body.genre,req.body.poster],(err)=>logError(err))

        res.end()

        // TODO: validation
    })

// GET /movies/:id - get a movie based on id
// PUT/PATCH /movies/:id - Update the movie details by id
// DELETE /movies/:id - Delete a Movie by :id 

mvsRtr.route('/:id')
    .get((req,res)=>{
        const movie = req.movie
        db.all(`SELECT * FROM genres WHERE name='${movie.genre}' LIMIT 1`, (err,genres)=>{
            let genreObj
            if (genres.length === 0) genreObj = {id: null, name: 'Unknown'}
            else genreObj = genres[0]
            res.json({...movie,genre:genreObj})
        })
    })
    .put((req,res)=>{
        sql = `UPDATE movies SET title = ?, year = ?, genre = ?, poster = ? WHERE id = ?`
        db.run(sql,[req.body.title,req.body.year,req.body.genre,req.body.poster,req.params.id],(err)=>logError(err))
        res.end()

        // TODO: validation
    })
    .delete((req,res)=>{
        sql = `DELETE FROM movies WHERE id = ${req.params.id}`
        dbrun()
        res.end()
    })

// create the same endpoint for /genres
