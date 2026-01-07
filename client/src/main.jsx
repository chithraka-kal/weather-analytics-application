import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-s4ymymaa2dllrk3o.us.auth0.com" 
      clientId="utlh28ihOIGMn1YzINPCx6vTAN689Dj9" 
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://weather-api.fidenz" 
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
)