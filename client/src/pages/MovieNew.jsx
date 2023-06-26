import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as constants from '../constants'
import Select from 'react-select'
import {useMutation, useQueryClient} from "@tanstack/react-query"
import { useNavigate } from 'react-router-dom'
import GenreDropdown from '../components/GenreDropdown'

const movSchema = constants.movSchema
const posterDefault = constants.posterDefault

const MovieNew = () => {
    const {control, handleSubmit, watch, formState: {errors}} = useForm({
        resolver: yupResolver(movSchema),
    })

    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const newMovieMutation = useMutation({
        mutationFn: (variables) => {
            fetch(`http://localhost:8080/movies`, {method:'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                title: variables.title,
                year: variables.year,
                genre: variables.genre,
                poster: variables.poster,
            })}).then((res)=>res.json()).catch((err)=>console.error(err))
        },
        onSettled: (data,error,variables,context) => {
            queryClient.invalidateQueries(["movies"],{exact:true})
            alert("Movie created.")
            navigate({
                pathname: '/',
            })
        }
    })

    const onSubmit = (data) => {
        newMovieMutation.mutate({
            title: data.title,
            year: data.year,
            genre: data.genre,
            poster: data.poster,
        })
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
                    field: { onChange }
                  }) => 
                    <GenreDropdown
                    // options={genres}
                    // filterOption={genre => Number.isInteger(genre.value)}
                    // onChange={val=>onChange(val.value)}
                    // // defaultValue={()=>{
                    // //     if (genres.length > 0) {
                    // //     onChange(genres[0].value)
                    // //     return genres[0]
                    // // }}}
                    // ctrlrOnChange={onChange}
                    // isControlled={true}
                    props={({
                        filterOption: genre => Number.isInteger(genre.value),
                        // onChange: val=>onChange(val.value),
                        ctrlrOnChange: onChange,
                        isControlled: true
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
                    <input {...field} placeholder={posterDefault} />
                }
            />
            <p>{errors.poster?.message}</p>
            <input type="submit" disabled={newMovieMutation.isLoading}/>
            
            {/* {newMovieMutation.isLoading ? "Loading..." : null}
            {newMovieMutation.isError && JSON.stringify(newMovieMutation.error)} */}
        </form>
    </>)
}

export default MovieNew