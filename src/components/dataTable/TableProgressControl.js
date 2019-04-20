import React from 'react'
import PropTypes from 'prop-types'
import { LinearProgress } from 'react-md'

const TableProgressControl = ({ fetching, rows }) => {
  if (fetching) {
    return (
      <div className="table-progress">
        <LinearProgress id="table-progress" />
        <h4>
          Fetching Records...
        </h4>
      </div>
    )
  }

  if (rows.length <= 0) {
    return (
      <h4>
        No Records Found
      </h4>
    )
  }
  return null
}

export default TableProgressControl

TableProgressControl.propTypes = {
  fetching: PropTypes.bool.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired
}
