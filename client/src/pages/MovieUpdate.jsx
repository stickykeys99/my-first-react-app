import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import {useNavigate, useParams} from 'react-router-dom'
import constants from '../constants'
import GenreDropdown from '../components/GenreDropdown'

const movSchema = constants.movSchema

const MovieUpdate = () => {
    let params = useParams()

    const {control, handleSubmit, watch, formState: {errors}} = useForm({
        resolver: yupResolver(movSchema)
    })

    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const updateMovieMutation = useMutation({
        mutationFn: (variables) => {
            fetch(`http://localhost:8080/movies/${params.id}`, {method:'PUT', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                id: params.id,
                title: variables.title,
                year: variables.year,
                genre: variables.genre,
                poster: variables.poster,
            })}).then((res)=>res.json()).catch((err)=>console.error(err))
        },
        onSettled: async (data,error,variables,context) => {
            await queryClient.invalidateQueries(["movies"],{exact:true})
            await queryClient.invalidateQueries(["movies",params.id])
            alert("Movie updated.")
            navigate({
                pathname: `/${params.id}`
            })
        }
    })

    const onSubmit = (data) => {
        updateMovieMutation.mutate({
            id: params.id,
            title: data.title,
            year: data.year,
            genre: data.genre,
            poster: data.poster,
        })
    }

    const movieQuery = useQuery({
        queryKey: ["movies",params.id],
        queryFn: () => fetch(`http://localhost:8080/movies/${params.id}`, {method:'GET'}).then((res)=>res.json()).catch((err)=>console.error(err))
    })

    if (movieQuery.isLoading) return <h1>Loading...</h1>
    if (movieQuery.error) {
        return <h1>{JSON.stringify(movieQuery.error)}</h1>
    }

    const movie = movieQuery.data.data[0]

    return (<>
        <h2>Editing Movie</h2>
        {(movie !== undefined) ? (<>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="title"
                    control={control}
                    render={({field}) =>
                        <input {...field} defaultValue={movie.title}/>
                    }
                />
                {/* note that the defaultValues are passed to the field but not to the controller... will be fixed when you make your own input fields like select */}
                <p>{errors.title?.message}</p>
                <Controller
                    name="year"
                    control={control}
                    render={({field}) => 
                        <input {...field} type="number" defaultValue={movie.year}/>
                    }
                />
                <p>{errors.year?.message}</p>

                <Controller
                name="genre"
                control={control}
                render={({
                    field: { onChange }
                  }) => 
                    <GenreDropdown
                    props={({
                        filterOption: genre => Number.isInteger(genre.value),
                        ctrlrOnChange: onChange,
                        isControlled: true,
                        defaultValue: {label: movie.genre.name, value: movie.genre.id}
                    })}
                    />
                    }
                />

                <p>{errors.genre?.message}</p>

                {/* this should say "Poster link" */}
                <Controller
                    name="poster"
                    control={control}
                    render={({field}) => 
                        <input {...field} defaultValue={movie.poster}/>
                    }
                />
                <p>{errors.poster?.message}</p>

                <input type="submit" disabled={updateMovieMutation.isLoading}/>
            </form>
        </>) : (
            <p>{movieQuery.data.message}</p>
        )}
    </>)
}

export default MovieUpdate