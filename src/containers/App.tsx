import React, { FunctionComponent } from 'react'
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { RootState } from '../reducers'
import { Button } from '../components/common/Button'
import { incrementActionCreator } from '../actions';
import { countSelector } from '../reducers/test';
// import {} from '../actions'
// import { loggedInSelector } from '../reducers/login'

// sets type for props
interface AppProps {
  incrementAction: typeof incrementActionCreator
  // remove later -->  incrementAction: (...arg: any[]) => any
}
export const App: FunctionComponent<AppProps> = props => {
  {
    const {
      incrementAction
    } = props
    return (
      <>
        <Button text='enter' onClick={ () => {incrementAction(1)}} >
        </Button>
      </>
    )
  }
}

// gives the app component access to state and actions from the store
export default connect(

  //using selector
  (state: RootState) => ({
      test: countSelector(state)
    })
    ,
  //not using selector
  // (state: RootState) => ({
  //   test: state.test
  // }),
  
  {
    incrementAction: incrementActionCreator,
  }
)(App)