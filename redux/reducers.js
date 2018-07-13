import { combineReducers } from 'redux'
import { SET_LOC, DISALLOW_PERM, GET_PARKS, SET_SELECTED_PARK, ADD_ML, RESET_PARK, GET_ACS, LOGIN, LOGOUT, AUTH_STATE, CLEAR_AUTH, TOG_ML, TOG_SER, TOG_MAP, TOG_MAP_AT, GET_ML, REM_ML} from './actions.js'

const location = (state = [], action) => {
  switch(action.type){
    case SET_LOC:
      return action.payload
    case DISALLOW_PERM:
      return action.payload
    default:
      return state
  }
}

const parks = (state = [], action) => {
  switch (action.type){
    case GET_PARKS:
      return action.payload
    default:
      return state
  }
}

const nextPageToken = (state = null, action) => {
  switch (action.type){
    case GET_PARKS:
      return action.next
    default:
      return state
  }
}

const INITIAL_SELECTED_PARKS = {
  currentPark: null,
  nextPark: null,
  prevPark: null
}

const selectedPark = ( state = INITIAL_SELECTED_PARKS, action) => {
  switch (action.type){
    case SET_SELECTED_PARK:
      return action.payload
    case RESET_PARK:
      return INITIAL_SELECTED_PARKS
    default:
      return state
  }
}

const my_list = (state = [], action) => {
  switch (action.type){
    case ADD_ML:
      return [...state, action.payload]
    case GET_ML:
      return action.payload
    case REM_ML:
      let id = state.findIndex( ele => ele.parkId === action.payload)
      return state.slice(0,id).concat(state.slice(id+1))
    default:
      return state
  }
}

const activs = (state = [], action) => {
  switch(action.type){
    case GET_ACS:
      return action.payload
    default:
      return state
  }
}

const token = (state = '', action) => {
  switch(action.type){
    case LOGIN: return action.payload.token
    case LOGOUT: return null
    default: return state
  }
}

const authState = (state = null, action) => {
  switch(action.type){
    case AUTH_STATE: return action.payload
    case LOGOUT: return null
    default: return state
  }
}

const showMap = (state = false, action) => {
  switch(action.type){
    case TOG_MAP: return !state
    // case TOG_MAP_AT: return {show:!state, at: action.payload}
    default: return state
  }
}
const showSearch = (state = true, action) => {
  switch(action.type){
    case TOG_SER: return !state
    default: return state
  }
}
const showMyList = (state = false, action) => {
  switch(action.type){
    case TOG_ML: return !state
    default: return state
  }
}

export default combineReducers(
  { parks,
    location,
    nextPageToken,
    selectedPark,
    my_list,
    activs,
    token,
    authState,
    showMap,
    showSearch,
    showMyList}
  )
