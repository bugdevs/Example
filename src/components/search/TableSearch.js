import React, { PureComponent } from 'react'
import FontIcon from 'react-md/lib/FontIcons'
import TextField from 'react-md/lib/TextFields'
import { debouncer } from '../../utils/tools'

export default class TableSearch extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { keyword: '' }
  }

  searchChange = (value) => {
    const { onSearchChange } = this.props
    this.setState({ keyword: value })
    debouncer(() => {
      onSearchChange(value)
    }, 700)
  }

  render() {
    const { keyword } = this.state
    return (
      <TextField
        id="search"
        label="Search"
        lineDirection="left"
        placeholder="Enter Search Keyword"
        leftIcon={(
          <FontIcon>
            search
          </FontIcon>
        )}
        onChange={this.searchChange}
        value={keyword}
      />
    )
  }
}
