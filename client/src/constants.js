const yup = require('yup') 

const GENRE_NAME_MAX_LENGTH = 20
const posterDefault = 'https://via.placeholder.com/400'
const defaultGenres = [
    {label: 'Any', value: ''},
]

module.exports = Object.freeze({
    GENRE_NAME_MAX_LENGTH: GENRE_NAME_MAX_LENGTH,
    posterDefault: posterDefault,
    defaultGenres: defaultGenres,
    movSchema: yup.object({
        title: yup.string().required(),
        year: yup.number().required().positive().integer(),
        genre: yup.number().required().positive().integer(),
        poster: yup.string().url().required().default(posterDefault)
    }),
    genSchema: yup.object({
        name: yup.string().required().max(GENRE_NAME_MAX_LENGTH)
    })
})