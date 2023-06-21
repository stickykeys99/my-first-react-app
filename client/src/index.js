import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import App from './App'

const queryClient = new QueryClient({})

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <App/>
            <ReactQueryDevtools />
        </BrowserRouter>
    </QueryClientProvider>
)