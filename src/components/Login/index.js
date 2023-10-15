import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', showError: false}

  onSuccessLogin = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  onFailureLogin = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const jwtToken = data.jwt_token
      this.onSuccessLogin(jwtToken)
    } else {
      const errorMsg = data.error_msg
      this.onFailureLogin(errorMsg)
    }
  }

  addUsername = event => {
    this.setState({username: event.target.value})
  }

  addPassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {username, password, showError, errorMsg} = this.state
    const showErrorElement = showError ? (
      <p className="error-text">*{errorMsg}</p>
    ) : null
    return (
      <div className="login-container">
        <div className="login-cards">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
          <form onSubmit={this.onSubmitForm} className="form-elements">
            <label className="label" htmlFor="username">
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              placeholder="Username"
              onChange={this.addUsername}
              className="inputs"
              id="username"
            />
            <label className="label" htmlFor="password">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={this.addPassword}
              className="inputs"
              id="password"
            />
            <button type="submit" className="button">
              Login
            </button>
          </form>
          {showErrorElement}
        </div>
      </div>
    )
  }
}

export default Login
