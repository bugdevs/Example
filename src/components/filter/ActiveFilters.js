import React from 'react'
import PropTypes from 'prop-types'
import { Chip, FontIcon } from 'react-md'

const ActiveFilters = ({ filters, filterRemove }) => (
  <div className="active-filters">
    {
      filters.map(({ values, label, category }) => (
        values.map((value, i) => (
          <Chip
            key={`active-filter-chip-${i}`}
            className="filter-chip"
            label={(
              <span>
                <span className="chip-key">
                  { `${label}:` }
                </span>
                { value }
              </span>
            )}
            removable
            rotateIcon={false}
            children={(
              <FontIcon
                className="btn-close"
                onClick={event => filterRemove(event, { category, value })}
              >
                cancel
              </FontIcon>
            )}
          />
        ))
      ))
    }
  </div>)

export default ActiveFilters

ActiveFilters.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string.string,
    label: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string)
  })).isRequired,
  filterRemove: PropTypes.func.isRequired
}
