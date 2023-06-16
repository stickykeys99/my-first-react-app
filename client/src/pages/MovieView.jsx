import {useParams} from 'react-router-dom'

export default function MovieView() {
    let params = useParams()
    return <h1>Viewing Movie {params.id}</h1>
}