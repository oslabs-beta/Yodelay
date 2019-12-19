import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
// import saga from './src/sagas/sagas'
import createSagaMiddleware from 'redux-saga'
import App from './containers/App'
import rootReducer from './reducers'


const sagaMiddleware = createSagaMiddleware()

// sagaMiddleware.run(saga)

const store = createStore(
  rootReducer,
  composeWithDevTools()
)

ReactDOM.render(
  <Provider store={store} >
    <App/>
  </Provider>,
  document.getElementById('root')
);