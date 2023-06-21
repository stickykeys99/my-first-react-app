const express = require('express')
const sqlite3 = require('sqlite3')
const yup = require('yup')
const app = express()
const constants = require('../constants')
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
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*")
    next()
})

// movie has year, poster (image link), title, then genre

const db = new sqlite3.Database("./movieland.db",(err)=>logError(err))

// schema

const movSchema = yup.object({
    title: yup.string().required(),
    year: yup.number().required().positive().integer(),
    genre: yup.number().required().positive().integer(),
    poster: yup.string().url().required().default("https://via.placeholder.com/400")
})

const genSchema = yup.object({
    name: yup.string().required().max(constants.GENRE_NAME_MAX_LENGTH)
})

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
        sql = `SELECT * FROM movies WHERE title LIKE ? AND genre LIKE ?`

        db.all(sql,[`%${req.query.term || ''}%`, req.query.genre || '%%'],(err,movies)=>{
            logError(err)
            if (movies.length === 0) res.end({data: [], message: "No movies found in database"})

            data = []

            movies.forEach((movie)=>{
                db.all(`SELECT * FROM genres WHERE id='${movie.genre}' LIMIT 1`, (err,genres)=>{
                    let genreObj
                    if (genres.length === 0) genreObj = {id: 1, name: 'Unknown'}
                    else genreObj = genres[0]
                    data.push({...movie,genre:genreObj})
                    if (data.length===movies.length) {
                        res.send({data: data})
                    }
                })
            })
        })
    })
    .post((req,res)=>{
        sql = `INSERT INTO movies(title, year, genre, poster) VALUES (?,?,?,?)`

        movSchema.validate(req.body, {abortEarly: false}).then((movie)=>{
            db.run(sql,[movie.title,movie.year,movie.genre,movie.poster],(err)=>{
                logError(err)
                res.end()
            })}
        ).catch((err)=>{
            res.status(404).send([err.name, err.errors])
        })
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
            res.json({data: [{...movie,genre:genreObj}]})
        })
    })
    .put((req,res)=>{
        sql = `UPDATE movies SET title = ?, year = ?, genre = ?, poster = ? WHERE id = ${req.params.id}`

        movSchema.validate(req.body, {abortEarly: false}).then((movie)=>{
            db.run(sql,[movie.title,movie.year,movie.genre,movie.poster],(err)=>{
                logError(err)
                res.end()
            })}
        ).catch((err)=>{
            res.status(404).send([err.name, err.errors])
        })
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
            if (genres.length === 0) res.end({data: [], message: "No genres found"})
            res.send({data: genres})
        })
    })
    .post((req,res)=>{
        sql = `INSERT INTO genres(name) VALUES (?)`
    
        genSchema.validate(req.body, {abortEarly: false}).then((genre)=>{
            db.run(sql,[genre.name],(err)=>{
                logError(err)
                res.end()
            })
        }).catch((err)=>{
            res.status(404).send([err.name,err.errors])
        })
    })

gnrsRtr.route('/:id')
    .get((req,res)=>{
        res.send({data: [req.genre]})
    })
    .put((req,res)=>{
        sql = `UPDATE genres SET name = ? WHERE id = ${req.params.id}`
        genSchema.validate(req.body, {abortEarly: false}).then((genre)=>{
            db.run(sql,genre.name,(err)=>{
                logError(err)
                res.end()
            })
        }).catch((err)=>{
            res.status(404).send([err.name,err.errors])
        })
        res.end()
    })
    .delete((req,res)=>{
        sql = `DELETE FROM genres WHERE id = ${req.params.id}`
        dbrun()
        res.end()
    })