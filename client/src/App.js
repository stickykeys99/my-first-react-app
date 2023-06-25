import {useState} from 'react'
import {Route, Routes, useNavigate, createSearchParams} from 'react-router-dom'
import {Link} from 'react-router-dom'
import MovieIndex from './pages/MovieIndex'
import MovieNew from './pages/MovieNew'
import MovieView from './pages/MovieView'
import MovieUpdate from './pages/MovieUpdate'
import GenreDropdown from './components/GenreDropdown'

function App() {
    const [searchTerm, setSearchTerm] = useState('')

    const [selectedGenre, setSelectedGenre] = useState()

    const navigate = useNavigate()

    const search = () => {
        navigate({
            pathname: '/',
            search: `?${createSearchParams({term: searchTerm, genre: selectedGenre.value})}`
        })
    }

    return (<>

        <Link to="/"><h1>MovieLand</h1></Link>

        <input placeholder="Search for movies" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onSubmit={search} />
        <button onClick={search}>Search</button>

        <GenreDropdown props={({
            value: selectedGenre,
            onChange: setSelectedGenre,
        })}/>

        {/*Temporary stuff below*/}

        <Link to="/new">New Movie</Link>
        <Link to="/5">Movie 5</Link>
        <Link to="/5/edit">Edit Movie 5</Link>

        {/*end of temp*/}

        {/*Dynamic via routes*/}
        <div className="container">
            <Routes>
                <Route path="/" element={<MovieIndex />} />
                <Route path="/new" element={<MovieNew />} />
                <Route path="/:id" element={<MovieView />} />
                <Route path="/:id/edit" element={<MovieUpdate />} />
            </Routes>
        </div>
    </>)
}

export default App