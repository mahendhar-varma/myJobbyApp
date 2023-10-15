const EmploymentTypeItem = props => {
  const {itemDetails, addEmploymentType} = props
  const {label, employmentTypeId} = itemDetails

  const addEmployment = event => {
    addEmploymentType(event.target.value)
  }

  return (
    <li className="filter-item">
      <input
        type="checkbox"
        value={employmentTypeId}
        onChange={addEmployment}
        id={employmentTypeId}
      />
      <label htmlFor={employmentTypeId} className="label-text">
        {label}
      </label>
    </li>
  )
}

export default EmploymentTypeItem
