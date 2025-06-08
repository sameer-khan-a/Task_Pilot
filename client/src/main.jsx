import './index.css'
import App from './App.jsx'
import React from 'react'
import ReactDom from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';


ReactDom.createRoot(document.getElementById('root')).render(
<BrowserRouter>
<App />
</BrowserRouter>
)
