import {useEffect, useState} from 'react'

import MovieCard from './MovieCard'

import './App.css'
import SearchIcon from './search.svg'

// d48bbe47

const API_URL = 'http://www.omdbapi.com?apikey=d48bbe47'

const App = () => {
    const [movies, setMovies] = useState([])
    const [searchTerm, setSearchTerm] = useState('12 Angry Men')

    const searchMovies = async (title) => {
        const response = await fetch(`${API_URL}&s=${title}`)
        const data = await response.json()

        setMovies(data.Search)
    }

    useEffect(() => {
        searchMovies('12 Angry Men')
    }, [])

    return (
        <div className='app'>
            <h1>MovieLand</h1>
            <div className='search'>
                <input placeholder="Search for movies" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <img src={SearchIcon} alt="search" onClick={() => searchMovies(searchTerm)}/>
            </div>

            {
                movies?.length > 0 ? (<div className="container">
                    {movies.map((movie) => (
                        <MovieCard movie={movie} />
                    ))}
                </div>) : (
                    <div className="empty">
                        <h2>No movies found</h2>
                    </div>
                )
            }
        </div>
    )
}

export default App