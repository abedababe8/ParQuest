import { Location, Permissions } from 'expo';

export const SET_LOC = 'SET_LOC'
export const ALLOW_PERM = 'ALLOW_PERM'
export const GET_PARKS = 'GET_PARKS'

export const getLocation = async () => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
      return (dispatch) => {
        dispatch({
          type: ALLOW_PERM,
          payload: 'Permission to access location was denied'
        })
    };
  } else {
  let location = await Location.getCurrentPositionAsync({});
    return (dispatch) => {
      dispatch({
        type: SET_LOC,
        payload: location
      })
    }
  }
}

export const getParks = () => {
  return (dispatch) => {
    dispatch({
      type: GET_PARKS,
      payload: [1,2,3,4,5,6,7,8,9]
    })
  }
}
