import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import {useNavigate, useParams} from 'react-router-dom'
import constants from '../constants'
import GenreDropdown from '../components/GenreDropdown'
import { Box, Button, Center, FormControl, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, SimpleGrid, Text } from '@chakra-ui/react'

const movSchema = constants.movSchema

const MovieUpdate = () => {
    let params = useParams()

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

    const {control, handleSubmit, watch, formState: {errors}} = useForm({
        resolver: yupResolver(movSchema),
        defaultValues: async () => new Promise((resolve,reject) => {
            if(movieQuery.status === 'success') {
                const movie = movieQuery.data.data[0]
                resolve({
                    title: movie.title,
                    year: movie.year,
                    genre: movie.genre.id,
                    poster: movie.poster
                })
            }
            else {
                reject()
            }
        })
    })

    if (movieQuery.isLoading) return <h1>Loading...</h1>
    if (movieQuery.error) {
        return <h1>{JSON.stringify(movieQuery.error)}</h1>
    }

    const movie = movieQuery.data.data[0]

    return (<>
        <Center><SimpleGrid column={1} spacing='1.5rem' maxW='50%' minW='30%'>
            
        <Center><Text fontSize='3xl'>Updating Movie</Text></Center>

        {(movie !== undefined) ? (<>

        <form onSubmit={handleSubmit(onSubmit)}>

            <FormControl>
                <FormLabel>Title: </FormLabel>
                <Controller
                    name="title"
                    control={control}
                    render={({field}) =>
                        <Input {...field} />
                    }
                />
            </FormControl>
            <Text>{errors.title?.message}</Text>

            <FormControl>
                <FormLabel>Year: </FormLabel>
                <Controller
                    name="year"
                    control={control}
                    render={({field}) => 
                    <NumberInput {...field} type="number">
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    }
                    />
            </FormControl>
            <Text>{errors.year?.message}</Text>

            <FormControl>
                <FormLabel>Genre: </FormLabel>
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
                    })} />
                } />
            </FormControl>
            <Text>{errors.genre?.message}</Text>

            <FormControl>
                <FormLabel>Poster Link: </FormLabel>
                <Controller
                    name="poster"
                    control={control}
                    render={({field}) => 
                    <Input {...field} />
                }
                />
            </FormControl>
            <Text>{errors.poster?.message}</Text>
            <Box h='2rem'></Box>
            <Center><Button type="submit" disabled={updateMovieMutation.isLoading}>Submit</Button></Center>
        </form>

        </>) : (

        <Text>{movieQuery.data.message}</Text>

        )}

    </SimpleGrid></Center>
    </>)
}

export default MovieUpdate