import {useEffect, useState} from 'react'
import {Route, Routes} from 'react-router-dom'
import {Link, useMatch, useResolvedPath} from 'react-router-dom'
import Home from './pages/Home'
import AddMovie from './pages/AddMovie'
import ViewMovie from './pages/ViewMovie'
import EditMovie from './pages/EditMovie'

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
                <Route path="/" element={<Home />} />
                <Route path="/new" element={<AddMovie />} />
                <Route path="/:id" element={<ViewMovie />} />
                <Route path="/:id/edit" element={<EditMovie />} />
            </Routes>
        </div>
    </>)
}

export default App