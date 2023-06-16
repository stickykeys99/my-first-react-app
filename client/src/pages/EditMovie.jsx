// import {withRouter} from 'react-router-dom'

// export default withRouter(function EditMovie(props) {
//     return <h1>Editing {props.match.params.id}</h1>
// })

import {useParams} from 'react-router-dom'

export default function EditMovie() {
    let params = useParams()
    return <h1>Editing Movie {params.id}</h1>
}