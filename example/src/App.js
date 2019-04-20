import React, { Component } from 'react'

import { Sample } from 'utility-belt'
import { TextField } from 'react-md'

export default class App extends Component {
  render () {
    return (
      <div>
        <Sample text='Modern React component module' />
        <TextField
          id="floating-center-title"
          label="Title"
          lineDirection="center"
          placeholder="Hello World"
          className="md-cell md-cell--bottom"
        />
      </div>
    )
  }
}
