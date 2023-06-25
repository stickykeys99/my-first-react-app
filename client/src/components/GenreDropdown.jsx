import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import Select from "react-select"
import constants from "../constants"

const defaultGenres = constants.defaultGenres

const GenreDropdown = ({props}) => {

    const [genres, setGenres] = useState(defaultGenres)
    const [defaultValue, setDefaultValue] = useState(defaultGenres[0])

    const genresQuery = useQuery({
        queryKey: ["genres"],
        enabled: props.options === undefined,
        queryFn: ()=>fetch('http://localhost:8080/genres').then((res)=>res.json())
    })

    useEffect(()=>{
        if (genresQuery.status === 'loading') setGenres([...defaultGenres,{label: 'Loading...', value: 'Loading...', isDisabled: true}])
        else if (genresQuery.status === 'error') setGenres([...defaultGenres,{label: 'Error loading genres', value: 'Error', isDisabled: true}])
        else setGenres([...defaultGenres,...genresQuery.data.data.map((genre)=>({label: genre.name, value: genre.id}))])
    }, [genresQuery.status])

    useEffect(()=>{
        let myGenres = props.options ?? genres
        if (props.filterOption !== undefined) myGenres = genres.filter(props.filterOption)
        
        if (props.ctrlrOnChange !== undefined && myGenres !== undefined && myGenres.length > 0) {
            props.ctrlrOnChange(myGenres[0].value)
        }
        
        if (myGenres !== undefined && myGenres.length > 0) setDefaultValue(myGenres[0])
        // if (props.isControlled) {
        //     console.log(genres)
        //     console.log(myGenres)
        //     console.log(defaultValue)
        // }
    }, [genres])

    if (defaultValue !== undefined)
    return <Select
        {...props}
        options={props.options ?? genres}
        defaultValue={defaultValue}
        // MUST SORT GENRES ON THE BACKEND! BY ID!
        // also try to sort movies, but in reverse ID
    />
    else return <p>Loading dropdown...</p>
    // do not do this....
    // since defaultValue does not reflect state changes, value and onChange needs to be overridden..
    // second useEffect will be removed.. value will be set along with options upon changes to queryStatus
}

export default GenreDropdown