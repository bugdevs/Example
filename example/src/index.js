import React from 'react'
import ReactDOM from 'react-dom'
import WebFontLoader from 'webfontloader';

import './style/index.css'
import App from './App'

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
});

ReactDOM.render(<App />, document.getElementById('root'))
