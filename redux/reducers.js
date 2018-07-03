import { combineReducers } from 'redux'
import { SET_LOC, ALLOW_PERM, GET_PARKS } from 'actions.js'

const parkList = (state = [], action) => {
  switch(action.type){
    case GET_PARKS:
      return action.payload
    default:
      return state
  }
}

const location = (state = [], actions) => {
  switch(action.type){
    case SET_LOC:
      return action.payload
    case ALLOW_PERM:
      return action.payload
    default:
      return state
  }
}




export default combineReducers({ parkList, location })
