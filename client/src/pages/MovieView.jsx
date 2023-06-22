import {useParams, Link} from 'react-router-dom'
import {useQuery} from '@tanstack/react-query'
export default function MovieView() {
    let params = useParams()

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
        <h3>{movie.title}</h3>
        <p>Year: {movie.year}</p>
        <p>Genre: {movie.genre.name}</p>
        <p>Poster:<br/> <img src={movie.poster} alt="Movie poster"/></p>
        <Link to="./edit"><button>Edit Movie</button></Link>
        <Link to="../" relative="path"><button>Delete Movie</button></Link>
    </>)
}