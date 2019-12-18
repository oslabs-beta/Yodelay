import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
// import rootReducer from './src/reducers/index'
// import saga from './src/sagas/sagas'
import createSagaMiddleware from 'redux-saga'
import App from './containers/App'


// const sagaMiddleware = createSagaMiddleware()
// const store = createStore(
//   rootReducer,
//   composeWithDevTools()
// )
// sagaMiddleware.run(saga)


ReactDOM.render(
    <App/>,
  document.getElementById('root')
);