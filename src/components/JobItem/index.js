import {Link} from 'react-router-dom'

import './index.css'

const JobItem = props => {
  const {jobDetails} = props

  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="route">
      <li className="job-card">
        <div className="top-container">
          <div className="company-logo-container">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="profile-image"
            />
            <div>
              <h1 className="job-title">{title}</h1>
              <p className="rating">{rating}</p>
            </div>
          </div>
          <div className="about-job-container">
            <div className="location-container">
              <p className="about-text">{location}</p>
              <p className="about-text">{employmentType}</p>
            </div>
            <p className="about-text">{packagePerAnnum}</p>
          </div>
          <hr className="line" />
        </div>
        <div className="description-container">
          <h1 className="description-head">Description</h1>
          <p className="description">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobItem
