const yup = require('yup') 

const GENRE_NAME_MAX_LENGTH = 20

module.exports = Object.freeze({
    GENRE_NAME_MAX_LENGTH: GENRE_NAME_MAX_LENGTH,
    movSchema: yup.object({
        title: yup.string().required(),
        year: yup.number().required().positive().integer(),
        genre: yup.number().required().positive().integer(),
        poster: yup.string().url().required().default("https://via.placeholder.com/400")
    }),
    genSchema: yup.object({
        name: yup.string().required().max(GENRE_NAME_MAX_LENGTH)
    })
})