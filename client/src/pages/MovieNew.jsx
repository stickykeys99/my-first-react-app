import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as constants from '../constants'
import Select from 'react-select'

const movSchema = constants.movSchema
const posterDefault = constants.posterDefault

const MovieNew = ({genres}) => {

    // genres was passed as a prop. a better solution might be through cached queries from react query

    if (genres === undefined) { /* if `genres` was never passed, query it, then pass data to newGenres */}
    // else
    const newGenres = genres.filter(genre=>Number.isInteger(genre.value))

    return <_MovieNew genres={newGenres} />
}

const _MovieNew = ({genres}) => {
    const {control, handleSubmit, watch, formState: {errors}} = useForm({
        resolver: yupResolver(movSchema),
    })

    const onSubmit = (data) => {
        console.log(data)
    }

    return (<>
        <h2>New Movie</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="title"
                control={control}
                render={({field}) => 
                    <input {...field} />
                }
            />
            <p>{errors.title?.message}</p>
            <Controller
                name="year"
                control={control}
                render={({field}) => 
                    <input {...field} type="number" />
                }
            />
            <p>{errors.year?.message}</p>

            <Controller
                name="genre"
                control={control}
                render={({
                    field: { onChange, value }
                  }) => 
                    <Select
                        options={genres}
                        filterOption={genre => Number.isInteger(genre.value)}
                        onChange={val=>onChange(val.value)}
                        defaultValue={()=>{
                            if (genres.length > 0) {
                            onChange(genres[0].value)
                            return genres[0]
                        }}}
                    />
                }
            />
            <p>{errors.genre?.message}</p>

            {/* this should say "Poster link" */}
            <Controller
                name="poster"
                control={control}
                render={({field}) => 
                    <input {...field} placeholder={posterDefault} />
                }
            />
            <p>{errors.poster?.message}</p>
            <input type="submit" />
        </form>
    </>)
}

export default MovieNew