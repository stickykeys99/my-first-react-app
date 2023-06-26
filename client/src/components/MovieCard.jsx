import { Box, Flex, Image, Text } from "@chakra-ui/react"
import React from 'react'

const MovieCard = ({movie}) => {

    console.log(movie.poster)
    return <Flex direction='column' w='xs'>
        <Image src={movie.poster} alt='Movie image' w='inherit' />
        <Text fontSize='lg'>{movie.title}</Text>
        <Text fontSize='lg'>{movie.year}</Text>
        <Text fontSize='lg'>{movie.genre.name}</Text>
        {/* <Box bg='tomato' flex={1}></Box> */}
    </Flex>
}

export default MovieCard