import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import {Select} from "chakra-react-select"
import constants from "../constants"

const defaultGenres = constants.defaultGenres

const GenreDropdown = ({props}) => {

    const [genres, setGenres] = useState(defaultGenres)
    const [value, setValue] = useState()
    const [width, setWidth] = useState(10)

    const genresQuery = useQuery({
        queryKey: ["genres"],
        enabled: props.options === undefined,
        queryFn: ()=>fetch('http://localhost:8080/genres').then((res)=>res.json())
    })

    useEffect(()=>{
        if (genresQuery.status === 'loading') setGenres([...defaultGenres,{label: 'Loading...', value: 'Loading...', isDisabled: true}])
        else if (genresQuery.status === 'error') setGenres([...defaultGenres,{label: 'Error loading genres', value: 'Error', isDisabled: true}])
        else {
            let myGenres = [...defaultGenres,...genresQuery.data.data.map((genre)=>({label: genre.name, value: genre.id}))]
            setGenres(myGenres)

            if (props.filterOption !== undefined) myGenres = myGenres.filter(props.filterOption)

            if (props.defaultValue !== undefined && props.ctrlrOnChange !== undefined) {
                props.ctrlrOnChange(props.defaultValue.value)
                setValue(props.defaultValue)
                return
            }

            if (props.ctrlrOnChange !== undefined && myGenres !== undefined && myGenres.length > 0) {
                props.ctrlrOnChange(myGenres[0].value)
            }

            if (myGenres !== undefined && myGenres.length > 0) setValue(myGenres[0])

            if (myGenres !== undefined) {
                setWidth(Math.max(myGenres.map((genre)=>genre.label.length))*8)
            }
        }
    }, [genresQuery.status])

    return <Select
        {...props}
        options={props.options ?? genres}
        value={props.value ?? value}
        onChange={(newValue)=>{
            if (props.onChange !== undefined) props.onChange(newValue)
            else setValue(newValue)
            if (props.ctrlrOnChange !== undefined) props.ctrlrOnChange(newValue.value)
        }}
    />
}

export default GenreDropdown