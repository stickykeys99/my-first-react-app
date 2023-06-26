import {useParams, Link, useNavigate} from 'react-router-dom'
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query'
import MovieCard from '../components/MovieCard'
import { Box, Button, Center, Flex, SimpleGrid } from '@chakra-ui/react'
export default function MovieView() {
    let params = useParams()

    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const deleteMovieMutation = useMutation({
        mutationFn: () => {
            fetch(`http://localhost:8080/movies/${params.id}`, {method: 'DELETE'})
        },
        onSettled: async (data,error,variables,context) => {
            await queryClient.invalidateQueries(["movies"],{exact:true})
            alert("Movie successfully deleted.")
            navigate({
                pathname: '/',
            })
        }
    })

    const deleteMovie = () => {
        deleteMovieMutation.mutate()
    }

    // note that some data from the main page may be passed, either as a prop or cache from react query.
    // it is not done here. the same data is again re-queried

    const movieQuery = useQuery({
        queryKey: ["movies",params.id],
        queryFn: () => fetch(`http://localhost:8080/movies/${params.id}`, {method:'GET'}).then((res)=>res.json()).catch((err)=>console.error(err))
    })
    
    if (movieQuery.isLoading) return <h1>Loading...</h1>
    if (movieQuery.error) {
        return <h1>{JSON.stringify(movieQuery.error)}</h1>
    }
    
    const movie = movieQuery.data.data[0]
    console.log(movie)
    return (<>
        {(movie !== undefined) ? (<>
            <SimpleGrid columns={1} spacing='1rem' >
                <Center><MovieCard movie={movie} /></Center>
                <Center><Link to="./edit"><Button>Edit Movie</Button></Link></Center>
                <Center><Button onClick={deleteMovie} disabled={deleteMovieMutation.isLoading}>Delete Movie</Button></Center>
            </SimpleGrid></>) : (
            <p>{movieQuery.data.message}</p>
        )}
    </>)
}