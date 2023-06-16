import {useParams} from 'react-router-dom'

export default function MovieUpdate() {
    let params = useParams()
    return <h1>Editing Movie {params.id}</h1>
}