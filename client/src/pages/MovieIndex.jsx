import { useQuery } from "@tanstack/react-query"
import { Link, useSearchParams} from "react-router-dom"
import MovieCard from "../components/MovieCard"
import { Box, Center, SimpleGrid } from "@chakra-ui/react"

export default function MovieIndex() {

    let [params, _] = useSearchParams()

    const moviesQuery = useQuery({
        queryKey: ["movies", Object.fromEntries(params.entries())],
        queryFn: () => fetch(`http://localhost:8080/movies/?${params.toString()}`, {method:'GET'}).then((res)=>res.json()).catch((err)=>console.error(err))
    })
    
    if (moviesQuery.isLoading) return <h1>Loading...</h1>
    if (moviesQuery.error) {
        return <h1>{JSON.stringify(moviesQuery.error)}</h1>
    }

    return (<>
        {moviesQuery.data.data.length > 0 ? (
            <Center><SimpleGrid columns={[1,2,3]} spacing='2rem' w='70%'>
                {moviesQuery.data.data.map((movie)=>{
                    return <Link to={`${movie.id}`}>
                        <MovieCard movie={movie} />
                    </Link>
                })}
            </SimpleGrid></Center>
        ) : (
            <p>{moviesQuery.data.message}</p>
        )}
    </>)
}