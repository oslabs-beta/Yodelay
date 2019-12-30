import { setIn } from 'timm'
import { RootState } from '.'
import { loadMenuAction, LOAD_SERVICE_OPTIONS } from '../actions'

export interface initialMenuStateType {
    serviceOptions: string[];
    requestOptions: string[]
}

const initialState: initialMenuStateType = {
    serviceOptions: [],
    requestOptions:[]
}

export const updateMenu: (state: initialMenuStateType, action: loadMenuAction) => initialMenuStateType = (state = initialState, action) =>{
    switch(action.type){
        case LOAD_SERVICE_OPTIONS:{
            return setIn(state, ["serviceOptions"], action.payload)
        }
    }
    return state
}

export const serviceMenuSelector: (state: RootState) => object = (state) => state.updateMenu.serviceOptions
