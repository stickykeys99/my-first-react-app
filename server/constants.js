const yup = require('yup') 

module.exports = Object.freeze({
    GENRE_NAME_MAX_LENGTH: 20,
    movSchema: yup.object({
        title: yup.string().required(),
        year: yup.number().required().positive().integer(),
        genre: yup.number().required().positive().integer(),
        poster: yup.string().url().required().default("https://via.placeholder.com/400")
    }),
    genSchema: yup.object({
        name: yup.string().required().max(this.GENRE_NAME_MAX_LENGTH)
    })
})