import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import JobItem from '../JobItem'
import Header from '../Header'
import SalaryRangeItem from '../SalaryRangeItem'
import EmploymentTypeItem from '../EmploymentTypeItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Job extends Component {
  state = {
    jobsList: [],
    profileObject: {},
    searchInput: '',
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
    employmentType: [],
    minimumPackage: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobsList()
  }

  getProfile = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const profileDetails = data.profile_details
      const updatedProfileData = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profileObject: updatedProfileData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  getJobsList = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})
    const {searchInput, employmentType, minimumPackage} = this.state

    const employmentFilter = employmentType.join(',')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentFilter}&minimum_package=${minimumPackage}&search=${searchInput}`

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const {jobs} = data
      const updatedJobsList = jobs.map(item => ({
        companyLogoUrl: item.company_logo_url,
        employmentType: item.employment_type,
        id: item.id,
        jobDescription: item.job_description,
        location: item.location,
        packagePerAnnum: item.package_per_annum,
        rating: item.rating,
        title: item.title,
      }))
      this.setState({
        jobsList: updatedJobsList,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  addSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  getSearchResults = () => {
    this.getJobsList()
  }

  addEmploymentType = value => {
    const {employmentType} = this.state
    if (employmentType.includes(value)) {
      const updatedType = employmentType.filter(item => item !== value)
      this.setState({employmentType: updatedType}, this.getJobsList)
    } else {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, value],
        }),
        this.getJobsList,
      )
    }
  }

  addMinimumPackage = minimumPackage => {
    this.setState({minimumPackage}, this.getJobsList)
  }

  renderLoadingUi = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileSuccessUi = () => {
    const {profileObject} = this.state
    const {name, profileImageUrl, shortBio} = profileObject
    return (
      <div className="profile-container">
        <img
          src="https://i.ibb.co/tqnjYTT/my-image1.webp"
          alt="profile"
          className="profile-image"
        />
        <h1 className="name">Mahendhar KMV</h1>
        <p className="name-text">Software Developer Trainee</p>
      </div>
    )
  }

  retryButtonClicked = () => {
    this.getProfile()
  }

  renderProfileFailureUi = () => (
    <div className="not-found-container">
      <button
        className="button"
        type="button"
        onClick={this.retryButtonClicked}
      >
        Retry
      </button>
    </div>
  )

  renderProfileRequiredUi = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileSuccessUi()
      case apiStatusConstants.failure:
        return this.renderProfileFailureUi()
      case apiStatusConstants.inProgress:
        return this.renderLoadingUi()
      default:
        return null
    }
  }

  renderJobsSuccessUi = () => {
    const {jobsList} = this.state

    if (jobsList.length === 0) {
      return (
        <div className="not-found-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="not-found-image"
          />
          <h1 className="not-found-head">No Jobs Found</h1>
          <p className="not-found-text">
            We could not find any jobs. Try other filters
          </p>
        </div>
      )
    }
    return (
      <ul className="job-items-container">
        {jobsList.map(item => (
          <JobItem key={item.id} jobDetails={item} />
        ))}
      </ul>
    )
  }

  jobRetryButtonClicked = () => {
    this.getJobsList()
  }

  renderJobsFailureUi = () => (
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
        onClick={this.jobRetryButtonClicked}
      >
        Retry
      </button>
    </div>
  )

  renderJobsRequiredUi = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsSuccessUi()
      case apiStatusConstants.failure:
        return this.renderJobsFailureUi()
      case apiStatusConstants.inProgress:
        return this.renderLoadingUi()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="left-section">
            {this.renderProfileRequiredUi()}
            <hr className="line" />
            <div className="filters-container-sm">
              <div className="filters-container">
                <h1 className="filter-head">Type of Employment</h1>
                <ul className="ul-container">
                  {employmentTypesList.map(item => (
                    <EmploymentTypeItem
                      key={item.employmentTypeId}
                      itemDetails={item}
                      addEmploymentType={this.addEmploymentType}
                    />
                  ))}
                </ul>
                <hr className="line" />
              </div>

              <div className="filters-container">
                <h1 className="filter-head">Salary Range</h1>
                <ul className="ul-container">
                  {salaryRangesList.map(item => (
                    <SalaryRangeItem
                      key={item.salaryRangeId}
                      itemDetails={item}
                      addMinimumPackage={this.addMinimumPackage}
                    />
                  ))}
                </ul>
                <hr className="line" />
              </div>
            </div>
            <hr className="line-sm" />
          </div>

          <div className="right-section">
            <form className="form-element">
              <input
                value={searchInput}
                placeholder="search"
                type="search"
                className="input"
                onChange={this.addSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.getSearchResults}
              >
                <BsSearch className="search-icon" />
              </button>
            </form>
            {this.renderJobsRequiredUi()}
          </div>
        </div>
      </>
    )
  }
}

export default Job
