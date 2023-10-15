import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="home-containers">
      <h1 className="title">Find The Job That Fits Your Life</h1>
      <p className="description-home">
        Millions of people are searching for jobs, salary, information, company
        reviews. Find the job that fits your abilities and potential.
      </p>
      <Link to="/jobs" className="link-route">
        <button type="button" className="button">
          Find Jobs
        </button>
      </Link>
    </div>
  </>
)

export default Home
