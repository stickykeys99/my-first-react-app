// import {withRouter} from 'react-router-dom'

// export default withRouter(function ViewMovie(props) {
//     return <h1>Viewing {props.match.params.id}</h1>
// })

import {useParams} from 'react-router-dom'

export default function ViewMovie() {
    let params = useParams()
    return <h1>Viewing Movie {params.id}</h1>
}