const express = require('express')
const sqlite3 = require('sqlite3')
const app = express()
let sql

// TODO: yup

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

// movies endpoints

const mvsRtr = express.Router()
app.use('/movies',mvsRtr)

mvsRtr.param('id',(req,res,next,id)=>{
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
        sql = `SELECT * FROM movies WHERE title LIKE '%${req.query.term}%'`
        if (req.query.genre !== undefined) sql += ` AND genre = ${req.query.genre}`

        db.all(sql,(err,movies)=>{
            logError(err)
            if (movies.length === 0) res.end("No movies found in database")

            data = []

            movies.forEach((movie,ind)=>{
                db.all(`SELECT * FROM genres WHERE id='${movie.genre}' LIMIT 1`, (err,genres)=>{
                    let genreObj
                    if (genres.length === 0) genreObj = {id: 1, name: 'Unknown'}
                    else genreObj = genres[0]
                    data.push({...movie,genre:genreObj})
                    if (ind===movies.length-1) {
                        res.send({data: data})
                    }
                })
            })
        })
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
        db.all(`SELECT * FROM genres WHERE id='${movie.genre}' LIMIT 1`, (err,genres)=>{
            let genreObj
            if (genres.length === 0) genreObj = {id: 1, name: 'Unknown'}
            else genreObj = genres[0]
            res.json({data: {...movie,genre:genreObj}})
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

const gnrsRtr = express.Router()
app.use('/genres',gnrsRtr)

gnrsRtr.param('id',(req,res,next,id)=>{
    sql = `SELECT * FROM genres WHERE id=${id} LIMIT 1`
    db.all(sql,(err,genres)=>{
        logError(err)
        if (genres.length === 0) res.status(404).end("No such genre")
        req.genre = genres[0]
        next()
    })
})

gnrsRtr.route('/')
    .get((req,res)=>{
        sql = `SELECT * FROM genres`
        db.all(sql,(err,genres)=>{
            logError(err)
            if (genres.length === 0) res.end("No genres found")
            res.send({data: genres})
        })
    })
    .post((req,res)=>{
        sql = `INSERT INTO genres(name) VALUES ('${req.body.name}')`
        dbrun()
        res.end()
    })

gnrsRtr.route('/:id')
    .get((req,res)=>{
        res.send({data: req.genre})
    })
    .put((req,res)=>{
        sql = `UPDATE genres SET name = '${req.body.name}' WHERE id = ${req.params.id}`
        dbrun()
        res.end()
    })
    .delete((req,res)=>{
        sql = `DELETE FROM genres WHERE id = ${req.params.id}`
        dbrun()
        res.end()
    })