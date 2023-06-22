import { useQuery } from "@tanstack/react-query"
import { Link, useSearchParams} from "react-router-dom"

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
        {moviesQuery.data.data.length > 0 ? (<div className="container">{
            moviesQuery.data.data.map((movie,index)=>{return (<div className="movie" key={index}>
                <Link to={`${movie.id}`}><h3>{movie.title}</h3></Link>
                <p>Year: {movie.year}</p>
                <p>Genre: {movie.genre.name}</p>
                <p>Poster:<br/> <img src={movie.poster} alt="Movie poster"/></p>
                <hr/>
            </div>)})
        }</div>) : (
            <p>{moviesQuery.data.message}</p>
        )}
    </>)
}