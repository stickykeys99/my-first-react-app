import {useState, useEffect} from 'react'
import {Route, Routes, useNavigate, createSearchParams} from 'react-router-dom'
import {Link} from 'react-router-dom'
import MovieIndex from './pages/MovieIndex'
import MovieNew from './pages/MovieNew'
import MovieView from './pages/MovieView'
import MovieUpdate from './pages/MovieUpdate'
import { useQuery } from '@tanstack/react-query'
import Select from 'react-select'
import * as constants from './constants'

const defaultGenres = constants.defaultGenres

function App() {
    const [searchTerm, setSearchTerm] = useState('')

    const [selectedGenre, setSelectedGenre] = useState(defaultGenres[0])
    const [genres, setGenres] = useState(defaultGenres)

    const genresQuery = useQuery({
        queryKey: ["genres"],
        queryFn: ()=>fetch('http://localhost:8080/genres').then((res)=>res.json())
    })

    useEffect(()=>{
        if (genresQuery.status === 'loading') setGenres([...defaultGenres,{label: 'Loading...', value: 'Loading...', isDisabled: true}])
        else if (genresQuery.status === 'error') setGenres([...defaultGenres,{label: 'Error loading genres', value: 'Error', isDisabled: true}])
        else setGenres([...defaultGenres,...genresQuery.data.data.map((genre)=>({label: genre.name, value: genre.id}))])
    }, [genresQuery.status])

    const navigate = useNavigate()

    const search = () => {
        navigate({
            pathname: '/',
            search: `?${createSearchParams({term: searchTerm, genre: selectedGenre.value})}`
        })
    }

    return (<>
        {/*Static*/}

        <Link to="/"><h1>MovieLand</h1></Link>

        <input placeholder="Search for movies" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onSubmit={search} />
        <button onClick={search}>Search</button>

        <Select
            defaultValue={selectedGenre}
            onChange={setSelectedGenre}
            options={genres}
            placeholder="Any"
        />

        {/*Temporary stuff below*/}

        <Link to="/new">New Movie</Link>
        <Link to="/5">Movie 5</Link>
        <Link to="/5/edit">Edit Movie 5</Link>

        {/*end of static*/}

        {/*Dynamic via routes*/}
        <div className="container">
            <Routes>
                <Route path="/" element={<MovieIndex />} />
                <Route path="/new" element={<MovieNew genres={genres}/>} />
                <Route path="/:id" element={<MovieView />} />
                <Route path="/:id/edit" element={<MovieUpdate />} />
            </Routes>
        </div>
    </>)
}

export default App