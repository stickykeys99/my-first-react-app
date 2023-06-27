import {useState} from 'react'
import {Route, Routes, useNavigate, createSearchParams} from 'react-router-dom'
import {Link} from 'react-router-dom'
import MovieIndex from './pages/MovieIndex'
import MovieNew from './pages/MovieNew'
import MovieView from './pages/MovieView'
import MovieUpdate from './pages/MovieUpdate'
import GenreDropdown from './components/GenreDropdown'
import { Box, Button, Center, IconButton, Input, InputGroup, InputRightElement, SimpleGrid, Text } from '@chakra-ui/react'
import {SearchIcon} from '@chakra-ui/icons'
import { defaultGenres } from './constants'

function App() {
    const [searchTerm, setSearchTerm] = useState('')

    const [selectedGenre, setSelectedGenre] = useState(defaultGenres[0])

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

        <SimpleGrid columns={1} spacing='1rem' padding='1rem'>
            <Center>
                <InputGroup width='50%'>
                    <Input
                        placeholder='Search for movies'
                        value={searchTerm}
                        onChange={(e)=>setSearchTerm(e.target.value)}
                        onSubmit={search}
                        size='lg'
                        variant='filled'
                    />
                    <InputRightElement>
                        <IconButton icon={<SearchIcon />} onClick={search}/>
                    </InputRightElement>
                </InputGroup>
                <GenreDropdown props={({
                    value: selectedGenre,
                    onChange: setSelectedGenre,
                })}/>

            </Center>

            <Center>
                <Button>
                    <Link to="/new">New Movie</Link>
                </Button>
            </Center>
        </SimpleGrid>

        <Box height='3rem'></Box>

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