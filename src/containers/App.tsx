import React, { Component } from 'react'
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
// 
import { RootState } from '../reducers'
import { Button } from '../components/common/Button'
import { incrementActionCreator } from '../actions';
// import {} from '../actions'
// import { loggedInSelector } from '../reducers/login'

// sets type for props
interface AppProps {
  incrementActionCreator: (...arg: any[]) => any
  // loggedIn: boolean
  // isTransactionsLoading: boolean
  // activeNotifications: NotificationWithDuration[]
  // expireNotificationsAction: ExpireNotificationsActionCreator
}
class App extends Component<AppProps> {
  render() {
    const {
      incrementActionCreator
    } = this.props
    return (
      <>
        <Button text='enter' onClick={ () => {incrementActionCreator(1)}} >
        </Button>
      </>
    )
  }
}

// gives the app component access to state and actions from the store
export default connect(
  (state: RootState) => ({
    increment: state.increment
  }),
  {
    incrementActionCreator: incrementActionCreator,
  }
)(App)