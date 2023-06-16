import {useEffect, useState} from 'react'
import {Route, Routes} from 'react-router-dom'
import {Link, useMatch, useResolvedPath} from 'react-router-dom'
import MovieIndex from './pages/MovieIndex'
import MovieNew from './pages/MovieNew'
import MovieView from './pages/MovieView'
import MovieUpdate from './pages/MovieUpdate'

function App() {
    const [searchTerm, setSearchTerm] = useState('')

    return (<>
        {/*Static*/}

        <Link to="/"><h1>MovieLand</h1></Link>

        <input placeholder="Search for movies" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        {/*Missing Search Button*/}

        {/*Temporary stuff below*/}

        <Link to="/new">New Movie</Link>
        <Link to="/5">Movie 5</Link>
        <Link to="/5/edit">Edit Movie 5</Link>

        {/*end of static*/}

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