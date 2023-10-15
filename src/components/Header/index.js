import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const logOutApp = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <ul className="header-container">
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="logo"
            />
          </Link>
        </li>
        <div className="links-container">
          <Link to="/" className="link-route">
            <li>
              <h1 className="link-text">Home</h1>
            </li>
          </Link>
          <Link to="/jobs" className="link-route">
            <li>
              <h1 className="link-text">Jobs</h1>
            </li>
          </Link>
        </div>
        <li>
          <button className="button" type="button" onClick={logOutApp}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
