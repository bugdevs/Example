import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Grid, Cell, Paper, Toolbar, Button
} from 'react-md'

import BaseTable from './BaseTable'
import TableSearch from '../search/TableSearch'
import ActiveFilters from '../filter/ActiveFilters'
import FilterDrawer from '../filter/FilterDrawer'

class ControlledTable extends PureComponent {
  constructor() {
    super()
    this.state = {
      filterDrawerShow: false,
      selectedFilter: '',
      filters: []
    }
  }

  handlePagination = (start, rowsPerPage) => {
    const { gridDataRefresh, gridProperties } = this.props
    const limit = start + rowsPerPage
    gridDataRefresh({ ...gridProperties, start, limit })
  }

  handleSorting = ({ key, direction }) => {
    const { gridDataRefresh, gridProperties } = this.props
    gridDataRefresh({ ...gridProperties, sort_column: key, sort_direction: direction })
  }

  handleGridSearch = (keyword) => {
    const { gridDataRefresh, gridProperties } = this.props
    const { start, limit } = gridProperties
    gridDataRefresh({
      ...gridProperties, search: keyword, limit: limit - start, start: 0
    })
  }

  handleFilterApply = ({ value, category }) => {
    const { gridDataRefresh, gridProperties } = this.props
    const { filters: prevFilters, selectedFilter } = this.state

    const foundCategory = prevFilters.find(filter => filter.category === category)
    if (foundCategory && foundCategory.values.includes(value)) {
      return
    }

    let filters = []
    if (!foundCategory) {
      filters = [...prevFilters, { category, values: [value], label: selectedFilter.label }]
    } else {
      const removeChoice = prevFilters.filter(filter => filter.category !== category)
      filters = [...removeChoice, { ...foundCategory, values: [...foundCategory.values, value] }]
    }

    this.setState({ filters }, () => {
      const cleanFilters = filters.map(item => ({ key: item.category, values: item.values }))
      gridDataRefresh({ ...gridProperties, filter: cleanFilters })
    })
  }

  handleFilterRemove = (event, { category, value }) => {
    const { gridDataRefresh, gridProperties } = this.props
    const { filters: prevFilters } = this.state

    const foundCategory = prevFilters.find(each => (category === each.category))

    let filters = []
    const removeChoice = prevFilters.filter(each => (each.category !== foundCategory.category))
    if (foundCategory.values.length === 1) {
      filters = removeChoice
    } else {
      filters = [...removeChoice,
        { ...foundCategory, values: [...foundCategory.values.filter(each => each !== value)] }]
    }

    this.setState({ filters }, () => {
      gridDataRefresh({ ...gridProperties, filters })
    })
  }

  filterCategorySelect = (selected, index) => {
    const { filterCategorySelect } = this.props

    this.setState({ selectedFilter: selected }, () => {
      filterCategorySelect(selected)
    })
  }

  handleFilterDrawerToggle = () => {
    const { filterDrawerShow } = this.state
    this.setState({ filterDrawerShow: !filterDrawerShow })
  }

  render() {
    const {
      toolbarActions
      , gridColumns
      , gridData
      , gridTitle = 'Default Table'
      , gridRowCount
      , rowsPerPage = 50
      , enableFilter
      , tableHeight
      , portal
    } = this.props

    const { filterDrawerShow, filters } = this.state

    return (
      <div className="controlled-table">
        {
          toolbarActions
          && (
            <Paper zDepth={0} className="base-paper">
              <Toolbar inset children={toolbarActions} />
            </Paper>
          )
        }

        <Paper zDepth={0} className="base-paper table-container">
          <Grid>
            <Cell size={8}>
              <h3 className="page-title">
                {gridTitle}
              </h3>
            </Cell>

            <Cell size={4}>
              <div className="table-controls">
                <TableSearch onSearchChange={this.handleGridSearch} />

                <Button icon primary onClick={this.handleFilterDrawerToggle}>
                  filter_list
                </Button>
              </div>
            </Cell>
          </Grid>
          {
            enableFilter
            && (
              <ActiveFilters filters={filters} filterRemove={this.handleFilterRemove} />
            )
          }
          <BaseTable
            plain
            tableHeight={tableHeight}
            rowsPerPage={rowsPerPage}
            baseId={gridTitle}
            columns={gridColumns}
            tableData={gridData}
            rowCount={gridRowCount}
            handlePagination={this.handlePagination}
            handleSorting={this.handleSorting}
          />
          {
            enableFilter
            && (
              <FilterDrawer
                gridColumns={gridColumns}
                filterDrawerShow={filterDrawerShow}
                filterDrawerToggle={this.handleFilterDrawerToggle}
                filterCategorySelect={this.filterCategorySelect}
                filterApply={this.handleFilterApply}
                portal={portal}
              />
            )
          }
        </Paper>
      </div>)
  }
}

export default ControlledTable

ControlledTable.propTypes = {
  enableFilter: PropTypes.bool,
  toolbarActions: PropTypes.arrayOf(PropTypes.element),
  rowsPerPage: PropTypes.number,
  gridTitle: PropTypes.string,
  gridColumns: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    key: PropTypes.string,
    sortable: PropTypes.bool,
    format: PropTypes.func
  })),
  gridData: PropTypes.arrayOf(PropTypes.object),
  gridRowCount: PropTypes.number,
  gridProperties: PropTypes.shape({
    search: PropTypes.string,
    filter: PropTypes.array,
    sort_column: PropTypes.string,
    sort_direction: PropTypes.string,
    start: PropTypes.number,
    limit: PropTypes.number
  }),
  gridDataRefresh: PropTypes.func,
  filterCategorySelect: PropTypes.func
}
