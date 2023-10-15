import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobItem: {},
    skills: [],
    lifeAtCompany: {},
    apiStatus: apiStatusConstants.initial,
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobItem()
  }

  getJobItem = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const item = data.job_details
      const updatedData = {
        companyLogoUrl: item.company_logo_url,
        companyWebsiteUrl: item.company_website_url,
        employmentType: item.employment_type,
        id: item.id,
        jobDescription: item.job_description,
        location: item.location,
        packagePerAnnum: item.package_per_annum,
        rating: item.rating,
        title: item.title,
        skills: item.skills,
        lifeAtCompany: item.life_at_company,
      }

      const {skills, lifeAtCompany} = updatedData

      const updatedSkills = skills.map(items => ({
        imageUrl: items.image_url,
        name: items.name,
      }))

      const updatedLifeAtCompany = {
        description: lifeAtCompany.description,
        imageUrl: lifeAtCompany.image_url,
      }

      const similarJobs = data.similar_jobs.map(similar => ({
        companyLogoUrl: similar.company_logo_url,
        id: similar.id,
        employmentType: similar.employment_type,
        jobDescription: similar.job_description,
        location: similar.location,
        packagePerAnnum: similar.package_per_annum,
        rating: similar.rating,
        title: similar.title,
      }))

      this.setState({
        jobItem: updatedData,
        skills: updatedSkills,
        lifeAtCompany: updatedLifeAtCompany,
        apiStatus: apiStatusConstants.success,
        similarJobs,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobItemSuccessUi = () => {
    const {jobItem, skills, lifeAtCompany, similarJobs} = this.state

    console.log(lifeAtCompany, similarJobs)

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobItem
    return (
      <div className="job-item-bg">
        <div className="job-card">
          <div className="top-container">
            <div className="company-logo-container">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
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
            <hr className="line1" />
          </div>
          <div className="description-container">
            <div className="visit-container">
              <h1 className="description-head">Description</h1>
              <a
                href={companyWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                className="anchor"
              >
                Visit
              </a>
            </div>
            <p className="description">{jobDescription}</p>
          </div>

          <div className="skills-container">
            <h1 className="skills-head">Skills</h1>
            <ul className="skill-container">
              {skills.map(skill => (
                <li className="skill-item" key={skill.name}>
                  <img
                    src={skill.imageUrl}
                    alt={skill.name}
                    className="skill-image"
                  />
                  <p className="skill-text">{skill.name}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="life-at-company-container">
            <h1 className="life-head">Life at Company</h1>
            <div className="life-at-company-items-container">
              <p className="description">{lifeAtCompany.description}</p>
              <img
                src={lifeAtCompany.imageUrl}
                alt="life at company"
                className="life-image"
              />
            </div>
          </div>
        </div>
        <div className="similar-job-container">
          <h1 className="similar-head">Similar Jobs</h1>
          <ul className="similar-jobs-container">
            {similarJobs.map(similarJob => (
              <li className="job-card similar-job-card" key={similarJob.id}>
                <div className="top-container">
                  <div className="company-logo-container">
                    <img
                      src={similarJob.companyLogoUrl}
                      alt="similar job company logo"
                      className="profile-image"
                    />
                    <div>
                      <h1 className="job-title head">{similarJob.title}</h1>
                      <p className="rating">{similarJob.rating}</p>
                    </div>
                  </div>
                  <div className="description-container">
                    <h1 className="description-head">Description</h1>
                    <p className="description">{similarJob.jobDescription}</p>
                  </div>
                  <div className="about-job-container">
                    <div className="location-container">
                      <p className="about-text">{similarJob.location}</p>
                      <p className="about-text">{similarJob.employmentType}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  retryButtonClicked = () => {
    this.getJobItem()
  }

  renderJobItemFailureUi = () => (
    <div className="not-found-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="not-found-image"
      />
      <h1 className="not-found-head">Oops! Something Went Wrong</h1>
      <p className="not-found-text">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="button"
        type="button"
        onClick={this.retryButtonClicked}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingUi = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobItemRequiredUi = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemSuccessUi()
      case apiStatusConstants.failure:
        return this.renderJobItemFailureUi()
      case apiStatusConstants.inProgress:
        return this.renderLoadingUi()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderJobItemRequiredUi()}
      </>
    )
  }
}

export default JobItemDetails
