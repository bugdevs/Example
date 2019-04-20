import React, { Component } from 'react'

import { ControlledTable } from 'utility-belt'
import { TextField, Chip, FontIcon } from 'react-md'
import users from './mockData/users'

export default class App extends Component {
  render () {
    const formatJobTitle = (key, row, i, rows) => <Chip label={String(row[key])} />

    const tableActions = []

    const gridProperties = {
      search: '',
      filter: [],
      sort_column: 'created_at',
      sort_direction: 'desc',
      start: 0,
      limit: 50
    }

    const gridColumns = [
      { name: 'First Name', key: 'first_name', sortable: true },
      { name: 'Last Name', key: 'last_name', sortable: true },
      { name: 'Company Email', key: 'email', sortable: true },
      {
        name: 'Job Title', key: 'job_title', sortable: true, format: formatJobTitle
      },
      { name: 'Department', key: 'department', sortable: true },
      { name: 'Actions', type: 'menu', menu: tableActions }
    ]

    return (
        <ControlledTable
          enableFilter
          toolbarActions={[]}
          rowsPerPage={10}
          gridTitle={'test'}
          gridColumns={gridColumns}
          gridData={users}
          gridRowCount={users.length}
          gridProperties={gridProperties}
          gridDataRefresh={() => null}
          filterCategorySelect={() => null}
          filterApply={() => null}
        />
    )
  }
}
