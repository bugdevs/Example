import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Drawer, Toolbar, Button, FontIcon, SelectField
} from 'react-md'

class FilterDrawer extends PureComponent {
  constructor(props) {
    super(props)
    const { gridColumns } = this.props
    const filtered = gridColumns
      .filter(item => item.key)
      .map(item => ({ value: item.key, label: item.name }))

    this.empty = {
      category: '',
      value: '',
      label: ''
    }

    this.state = {
      menuItems: filtered,
      selected: { ...this.empty }
    }
  }

  handlefilterCategorySelect = (value, index) => {
    const { filterCategorySelect } = this.props
    const { selected: prevSelected, menuItems } = this.state

    const selected = { ...prevSelected, category: value, label: menuItems[index].label }
    this.setState({ selected }, () => {
      filterCategorySelect(selected)
    })
  }

  handlefilterValueSelect = (value) => {
    const { selected: prevSelected } = this.state

    const selected = { ...prevSelected, value }
    this.setState({ selected })
  }

  filterApply = () => {
    const { filterApply } = this.props
    const { selected } = this.state
    if (!selected.value) {
      return
    }
    this.setState({ selected: { ...this.empty } }, () => {
      filterApply(selected)
    })
  }

  render() {
    const {
      filterDrawerShow
      , filterDrawerToggle, portal
    } = this.props

    const { menuItems, selected } = this.state

    return (
      <div>
        <Drawer
          className="filter-drawer"
          type={Drawer.DrawerTypes.TEMPORARY}
          onVisibilityChange={filterDrawerToggle}
          visible={filterDrawerShow}
          portal={portal}
          header={(
            <Toolbar
              nav={(
                <Button icon onClick={filterDrawerToggle}>
                  arrow_forward
                </Button>
              )}
              className="md-divider-border md-divider-border--bottom"
            />
          )}
          position="right"
        >
          <div className="contents">
            <SelectField
              className="filter-text"
              id="filter-category"
              label="Filter Category"
              placeholder="Select Filter Category"
              menuItems={menuItems}
              simplifiedMenu
              onChange={this.handlefilterCategorySelect}
              value={selected.category}
            />

            <SelectField
              className="filter-text"
              id="filter-value"
              label="Filter Value"
              placeholder="Select Filter Value"
              menuItems={['Andre', 'Indira', 'Yves', 'Dorette', 'Leroy', 'Celestyna']}
              simplifiedMenu
              onChange={this.handlefilterValueSelect}
              value={selected.value}
            />

            <Button
              flat
              swapTheming
              className="btn-filter"
              iconBefore={false}
              iconEl={(
                <FontIcon>
                  add
                </FontIcon>
              )}
              onClick={this.filterApply}
              secondary
            >
                Add Filter
            </Button>
          </div>
        </Drawer>
      </div>)
  }
}

export default FilterDrawer

FilterDrawer.propTypes = {
  gridColumns: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    key: PropTypes.string,
    sortable: PropTypes.bool,
    format: PropTypes.func
  })).isRequired,
  filterDrawerShow: PropTypes.bool.isRequired,
  filterDrawerToggle: PropTypes.func.isRequired,
  filterCategorySelect: PropTypes.func.isRequired,
  filterApply: PropTypes.func.isRequired,
  portal: PropTypes.bool
}
