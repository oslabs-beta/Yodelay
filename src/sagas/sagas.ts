import { call, put, takeLatest } from 'redux-saga/effects';
// import moment from 'moment'
import { UPLOAD_PROTO, uploadProtoAction } from '../actions/index';
import { json } from 'body-parser';

// chaining this saga middleware after uploadProto to post the file string to the server
function* sendProto({ payload: type, payload }: uploadProtoAction) {
  // yield call(fetch, '/scores', { method: 'GET', body: { score } })
  try {
    const jsonProtoFile = JSON.stringify(payload);
    yield fetch(`http://localhost:4000/upload`, {
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain'
      },
      body: jsonProtoFile
    });
  } catch ({ error, status }) {
    console.log('error in upload saga', error, status);
  }
}

function* saga() {
  console.log('saga');
  yield takeLatest(UPLOAD_PROTO, sendProto);
}

export default saga;
