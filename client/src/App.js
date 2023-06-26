import {useState} from 'react'
import {Route, Routes, useNavigate, createSearchParams} from 'react-router-dom'
import {Link} from 'react-router-dom'
import MovieIndex from './pages/MovieIndex'
import MovieNew from './pages/MovieNew'
import MovieView from './pages/MovieView'
import MovieUpdate from './pages/MovieUpdate'
import GenreDropdown from './components/GenreDropdown'
import { Center, Input, Text } from '@chakra-ui/react'

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

        <Center height='3rem' bg='orange'>
            <Link to="/">
                <Text fontSize='3xl' as='b'>MovieLand</Text>
            </Link>
        </Center>

        {/* <input placeholder="Search for movies" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onSubmit={search} />
        <button onClick={search}>Search</button> */}

        <Center>
            <Input
                placeholder='Search for movies'
                value={searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}
                onSubmit={search}
                size='lg'
                width='50%'
                variant='filled'
            />
            <GenreDropdown props={({
                value: selectedGenre,
                onChange: setSelectedGenre,
                styles:{
                    w:'50px'
                }
            })}/>
        </Center>

        {/*Temporary stuff below*/}

        <Link to="/new">New Movie</Link>

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