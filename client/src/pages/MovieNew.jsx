import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as constants from '../constants'
import {useMutation, useQueryClient} from "@tanstack/react-query"
import { useNavigate } from 'react-router-dom'
import GenreDropdown from '../components/GenreDropdown'
import {Center, SimpleGrid, Text, Box, Button, FormControl, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper} from '@chakra-ui/react';

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
        onSettled: async (data,error,variables,context) => {
            await queryClient.invalidateQueries(["movies"],{exact:true})
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
        <Center><SimpleGrid column={1} spacing='1.5rem' maxW='50%' minW='30%'>
            
        <Center><Text fontSize='3xl'>New Movie</Text></Center>

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
            <Center><Button type="submit" disabled={newMovieMutation.isLoading}>Submit</Button></Center>
        </form>

    </SimpleGrid></Center>
    </>)
}

export default MovieNew