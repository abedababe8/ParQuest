import React, {Component} from 'react'
import { View } from 'react-native'
import { Provider } from 'react-redux'

import store from './redux/store'
import Main from './components/Main'

const App = () => (
  <Provider store={store}>
    <Main/>
  </Provider>
)


export default App
