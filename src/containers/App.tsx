import React, { Component } from 'react'
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
// import { connect } from 'react-redux'
// import { RootState } from '../reducers'
import { Button } from '../components/common/Button'
// import {} from '../actions'
// import { loggedInSelector } from '../reducers/login'

interface AppProps {
  // loggedIn: boolean
  // isTransactionsLoading: boolean
  // activeNotifications: NotificationWithDuration[]
  // expireNotificationsAction: ExpireNotificationsActionCreator
}
class App extends Component<AppProps> {
  render() {
    // const {
    //   loggedIn,
    //   isTransactionsLoading,
    //   activeNotifications,
    //   expireNotificationsAction,
    // } = this.props
    return (
      <>
        <Button text='enter' >
        </Button>
      </>
    )
  }
}

export default App;
// export default connect(
//   (state: RootState) => ({
//     loggedIn: loggedInSelector(state),
//     isTransactionsLoading: isTransactionsLoadingSelector(state),
//     activeNotifications: activeNotificationsSelector(state),
//   }),
//   {
//     expireNotificationsAction: expireNotifications,
//   }
// )(_App)