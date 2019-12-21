import { call, put, takeLatest} from 'redux-saga/effects'
import moment from 'moment'
import {SEND_PROTO, sendProtoAction} from '../actions/index'

function* sendProto({payload: string | ArrayBuffer}: sendProtoAction){
  try {
    const protoDescription = yield call(, '/upload')
    fetch('https://localhost:3000', {
      method: 'POST',
      body: JSON.stringify()
      
    })

  } catch ({error, status}) {
    console.log(error, status)
  }
}

function* saga() {

}

export default saga