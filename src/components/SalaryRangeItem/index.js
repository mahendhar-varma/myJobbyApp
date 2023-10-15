const SalaryRangeItem = props => {
  const {itemDetails, addMinimumPackage} = props
  const {label, salaryRangeId} = itemDetails

  const addMinimumSalary = event => {
    addMinimumPackage(event.target.value)
  }

  return (
    <li className="filter-item">
      <input
        type="radio"
        value={salaryRangeId}
        name="minimumPackage"
        id={salaryRangeId}
        onChange={addMinimumSalary}
      />
      <label className="label-text" htmlFor={salaryRangeId}>
        {label}
      </label>
    </li>
  )
}

export default SalaryRangeItem
