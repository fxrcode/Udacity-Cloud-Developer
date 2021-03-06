import React from 'react'
import Auth from './auth/Auth'
import { Router, Route } from 'react-router-dom'
import Callback from './components/Callback'
import createHistory from 'history/createBrowserHistory'
import App from './App';
const history = createHistory()

const auth = new Auth(history)   // create an Auth object that contains access token that our app should pass when it sends API requests.

const handleAuthentication = (props: any) => {
  const location = props.location
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication()
  }
}

export const makeAuthRouting = () => {
  return (
    <Router history={history}>
      <div>
        <Route
          path="/callback"   // Demo special route for Auth0 redirect for token
          render={props => {
            handleAuthentication(props)
            return <Callback />
          }}
        />
        <Route  // this is general route for everything else
          render={props => {
            return <App auth={auth} {...props} />
          }}
        />
      </div>
    </Router>
  )
}
