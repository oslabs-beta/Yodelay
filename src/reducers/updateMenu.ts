import { setIn } from 'timm'
import { RootState } from '.'
import { loadMenuAction, LOAD_SERVICE_OPTIONS, LOAD_REQUEST_OPTIONS } from '../actions'

export interface initialMenuStateType {
    serviceOptions: object;
    requestOptions: object
}

const initialState: initialMenuStateType = {
    serviceOptions: {},
    requestOptions: {}
}

export const updateMenu: (state: initialMenuStateType, action: loadMenuAction) => initialMenuStateType = (state = initialState, action) =>{
    switch(action.type){
        case LOAD_SERVICE_OPTIONS:{
            return setIn(state, ["serviceOptions"], action.payload)
        }
        case LOAD_REQUEST_OPTIONS:{
            return setIn(state, ["requestOptions"], action.payload)
        }
    }
    return state
}

export const serviceMenuSelector: (state: RootState) => object = (state) => state.updateMenu.serviceOptions


export const requestMenuSelector: (state: RootState) => object = (state) => state.updateMenu.requestOptions