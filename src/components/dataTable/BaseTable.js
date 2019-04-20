import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import {
  DataTable
  , TableHeader
  , TableBody
  , TableRow
  , TableColumn
  , Button
  , TablePagination
  , MenuButtonColumn
  , ListItem
} from 'react-md'

import { tableSort } from '../../utils/baseTools'
import TableProgressControl from './TableProgressControl'

class BaseTable extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      sortedBy: {},
      rows: [],
      fetching: false,
      rowsPerPage: props.rowsPerPage || 50
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.tableData) {
      return {
        fetching: true
      }
    }
    return {
      rows: nextProps.tableData,
      fetching: false
    }
  }

  constructSimpleButtons = (data, buttons, customButtons) => {
    if (customButtons) {
      return { button: customButtons, data }
    }
    return buttons.map((button, i) => (
      <Button
        icon
        key={i}
        className={button.class_name}
        onClick={button.handler.bind(this, data)}
        tooltipLabel={button.label}
        tooltipPosition="top"
      >
        { button.icon }
      </Button>
    ))
  }

  constructMenuButton = (data, menu) => (
    menu.map((item, i) => (
      <ListItem
        key={`table-menu-button-${i}`}
        leftIcon={item.leftIcon}
        primaryText={item.primaryText}
        onClick={item.onClick.bind(this, data)}
      />
    ))
  )

  handleTableHeadClick = (columnObject) => {
    const { handleSorting } = this.props
    const { rows, sortedBy: sortedByPrev } = this.state
    const sorted = !sortedByPrev[columnObject.key]
    const sortedBy = { ...sortedByPrev }
    sortedBy[columnObject.key] = sorted

    if (handleSorting) {
      columnObject.direction = sorted ? 'desc' : 'asc'
      handleSorting(columnObject)
    }

    this.setState({
      rows: tableSort(rows, columnObject.key, sorted),
      sortedBy
    })
  }

  handlePagination = (start, rowsPerPage, page, data) => {
    const { handlePagination, tableData } = this.props
    if (handlePagination) {
      handlePagination(start, rowsPerPage, page)
      this.setState({ rowsPerPage, page })
    } else {
      let rowData = []
      if (data) {
        rowData = data
      } else {
        rowData = tableData
      }

      this.setState({
        rows: rowData.slice(start, start + rowsPerPage),
        page,
        rowsPerPage
      })
    }
  }

  render() {
    const {
      columns
      , baseId
      , plain
      , rowCount
      , tableHeight = 500
    } = this.props

    const {
      sortedBy
      , rows
      , fetching
      , page
      , rowsPerPage
    } = this.state

    const tableHead = columns.map((column, i) => {
      if (column.sortable) {
        return (
          <TableColumn
            key={`base-tablehead-column-${i}`}
            role="button"
            grow={column.grow}
            sorted={sortedBy[column.key] ? sortedBy[column.key] : false}
            onClick={this.handleTableHeadClick.bind(this, column)}
          >
            { column.name }
          </TableColumn>
        )
      }
      return (
        <TableColumn key={`base-tablehead-column-${i}`}>
          { column.name }
        </TableColumn>
      )
    })

    const tableBody = rows.map((row, i) => (
      <TableRow key={`base-tablebody-row-${i}`}>
        {
          columns.map((column, c) => {
            if (column.type && column.type === 'menu') {
              return (
                <MenuButtonColumn
                  key={`base-tablebody-column-${c}`}
                  tooltipLabel="actions"
                  menuItems={this.constructMenuButton(row, column.menu)}
                  icon
                >
                  more_vert
                </MenuButtonColumn>
              )
            }

            if (column.type && column.type === 'actions') {
              return (
                <TableColumn
                  key={`base-tablebody-column-${c}`}
                >
                  { this.constructSimpleButtons(row, column.actions, column.customActions) }
                </TableColumn>
              )
            }

            return (
              <TableColumn
                key={`base-tablebody-column-${c}`}
                numeric={column.numeric}
              >
                { column.format ? column.format(column.key, row, i, rows) : String(row[column.key]) }
              </TableColumn>
            )
          })
        }
      </TableRow>))

    return (
      <div id={baseId}>
        {
          fetching || rows.length <= 0
            ? <TableProgressControl fetching={fetching} rows={rows} />
            : (
              <DataTable
                plain={plain}
                baseId={baseId}
                fixedHeader
                fixedFooter
                fixedHeight={tableHeight}
              >
                <TableHeader>
                  <TableRow>
                    { tableHead }
                  </TableRow>
                </TableHeader>

                <TableBody>
                  { tableBody }
                </TableBody>

                <TablePagination
                  rows={rowCount}
                  page={page}
                  rowsPerPageItems={[10, 50, 100, 150, 250, 500]}
                  rowsPerPage={rowsPerPage}
                  onPagination={this.handlePagination}
                />
              </DataTable>
            )
        }
      </div>
    )
  }
}

export default BaseTable

BaseTable.propTypes = {
  plain: PropTypes.bool.isRequired,
  tableHeight: PropTypes.number,
  rowsPerPage: PropTypes.number.isRequired,
  baseId: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    key: PropTypes.string,
    sortable: PropTypes.bool,
    format: PropTypes.func
  })),
  tableData: PropTypes.arrayOf(PropTypes.object),
  rowCount: PropTypes.number,
  handlePagination: PropTypes.func,
  handleSorting: PropTypes.func
}
