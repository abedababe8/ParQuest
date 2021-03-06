import { Location, Permissions } from 'expo';
import request from '../request.js'
import { AsyncStorage } from "react-native"
import {API_KEY} from '../env.json'
export const SET_LOC = 'SET_LOC'
export const DISALLOW_PERM = 'DISALLOW_PERM'
export const GET_PARKS = 'GET_PARKS'
export const SET_SELECTED_PARK = 'SET_SELECTED_PARK'
export const ADD_ML = 'ADD_ML'
export const RESET_PARK = 'RESET_PARK'
export const GET_ACS = 'GET_ACS'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const AUTH_STATE = 'AUTH_STATE'
export const TOG_ML = 'TOG_ML'
export const TOG_MAP = 'TOG_MAP'
export const TOG_MAP_AT = 'TOG_MAP_AT'
export const GET_ML = 'GET_ML'
export const REM_ML = 'REM_ML'
export const FAV_TO_MAP = 'FAV_TO_MAP'
export const MAP_TO_FAV = 'MAP_TO_FAV'

export const newUser = (new_username, new_password) => {
  return async (dispatch) => {
    request('/users/', 'post', {new_username, new_password})
    .then(response => {
      dispatch(login(new_username, new_password))
    })
    .catch(error => console.log(error))
  }
}

export const getLocation = () => {
  return async (dispatch) => {
      let location = await Location.getCurrentPositionAsync({});
      dispatch({
        type: SET_LOC,
        payload: location
      })
    }
  }

/////////////  PARK ACTIONS /////////////

export const getParks = (location, radius) => {
  return async (dispatch) => {
    fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=${radius}&type=park&key=${API_KEY}`)
    .then(res => {
      return res.json()
    })
    .then(res => {
      const filteredParks = res.results.filter(park => {
        return park.photos !== undefined && park.rating !== undefined
      })
      const parks = filteredParks.map(park => {
        park.coords = {
          latitude: Number(park.geometry.location.lat),
          longitude: Number(park.geometry.location.lng)
        }
        return park
      })
      if(res.next_page_token){
        dispatch({
          type: GET_PARKS,
          payload: parks,
          next: res.next_page_token
        })
      } else {
        dispatch({
          type: GET_PARKS,
          payload: parks,
          next: null
        })
      }
    })
  }
}

export const getMoreParks = (parks, nextPageToken) => {
  return async (dispatch) => {
    fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${nextPageToken}&key=${API_KEY}`)
    .then(res => {
      return res.json()
    })
    .then(res => {
      const newParks = res.results.map(park => {
        const coords = {
          latitude: Number(park.geometry.location.lat),
          longitude: Number(park.geometry.location.lng)
        }
        return {...park, coords}
      })
      const totalParks = parks.concat(newParks)
      if(res.next_page_token){
        dispatch({
          type: GET_PARKS,
          payload: totalParks,
          next: res.next_page_token
        })
      } else {
        dispatch({
          type: GET_PARKS,
          payload: totalParks,
          next: null
        })
      }
    })
  }
}

export const resetPark = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_PARK
    })
  }
}

const checkPrev = (parks, prevPark) => {
  if(prevPark.photos && prevPark.geometry){
    return prevPark
  } else {
    let pPI = parks.indexOf(prevPark)
    if (pPI = 0){
      return checkPrev(parks, parks[parks.length - 1])
    } else {
      return checkPrev(parks, parks[parks.indexOf(prevPark) - 1])
    }
  }
}

const checkNext = (parks, nextPark, prevPark) => {
  if(nextPark.photos){
    return nextPark
  } else {
    let nPI = parks.indexOf(nextPark)
    if (nPI === parks.length - 1){
      return checkNext(parks, parks[parks.indexOf(prevPark) - 1], prevPark)
    } else {
      return checkNext(parks, parks[parks.indexOf(nextPark) + 1], prevPark)
    }
  }
}



export const markerPress = (park, parks) => {
  return async (dispatch) => {
    if(parks.length === 1){
      park.coords = {
        latitude: Number(park.geometry.location.lat),
        longitude: Number(park.geometry.location.lng)
      }
      const getParkInfo = Promise.all([
        fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${park.place_id}&key=${API_KEY}`)
      ])
      .then(response => {
        return Promise.all(response.map(res =>res.json()))
      })

      const getParkUrl = Promise.all([
        fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${park.photos[0].photo_reference}&key=${API_KEY}`)
      ])

      Promise.all([getParkInfo, getParkUrl])
      .then(([parkInfo, parkUrl]) => {
        const parks = {
          currentPark: {info: parkInfo[0].result, url: parkUrl[0].url, og: park}
        }
        dispatch({
          type: 'SET_SELECTED_PARK',
          payload: parks
        })
      })
    } else if(parks.length === 2){
      let nextPark;
      if(parks.indexOf(park) === 0){
        nextPark = parks[1]
      } else {
        nextPark = parks[0]
      }
      park.coords = {
        latitude: Number(park.geometry.location.lat),
        longitude: Number(park.geometry.location.lng)
      }
      nextPark.coords = {
        latitude: Number(nextPark.geometry.location.lat),
        longitude: Number(nextPark.geometry.location.lng)
      }
      const getParkInfo = Promise.all([
        fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${park.place_id}&key=${API_KEY}`),
        fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${nextPark.place_id}&key=${API_KEY}`)
      ])
      .then(response => {
        return Promise.all(response.map(res =>res.json()))
      })

      const getParkUrl = Promise.all([
        fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${park.photos[0].photo_reference}&key=${API_KEY}`),
        fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${nextPark.photos[0].photo_reference}&key=${API_KEY}`)
      ])

      Promise.all([getParkInfo, getParkUrl])
      .then(([parkInfo, parkUrl]) => {
        const parks = {
          currentPark: {info: parkInfo[0].result, url: parkUrl[0].url, og: park},
          nextPark: {info: parkInfo[1].result, url: parkUrl[1].url, og: nextPark}
        }
        dispatch({
          type: 'SET_SELECTED_PARK',
          payload: parks
        })
      })
    } else {
      let nextPark;
      let prevPark;
      if(parks.indexOf(park) === parks.length - 1){
        nextPark = parks[0]
        prevPark = parks[parks.indexOf(park) - 1]
      } else if (parks.indexOf(park) === 0){
        nextPark = parks[parks.indexOf(park) + 1]
        prevPark = parks[parks.length - 1]
      } else {
        nextPark = parks[parks.indexOf(park) + 1]
        prevPark = parks[parks.indexOf(park) - 1]
      }

      prevPark = checkPrev(parks, prevPark)
      nextPark = checkNext(parks, nextPark, prevPark)

      park.coords = {
        latitude: Number(park.geometry.location.lat),
        longitude: Number(park.geometry.location.lng)
      }
      nextPark.coords = {
        latitude: Number(nextPark.geometry.location.lat),
        longitude: Number(nextPark.geometry.location.lng)
      }
      prevPark.coords = {
        latitude: Number(prevPark.geometry.location.lat),
        longitude: Number(prevPark.geometry.location.lng)
      }


      const getParkInfo = Promise.all([
        fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${park.place_id}&key=${API_KEY}`),
        fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${nextPark.place_id}&key=${API_KEY}`),
        fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${prevPark.place_id}&key=${API_KEY}`)
      ])
      .then(response => {
        return Promise.all(response.map(res =>res.json()))
      })

      const getParkUrl = Promise.all([
        fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${park.photos[0].photo_reference}&key=${API_KEY}`),
        fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${nextPark.photos[0].photo_reference}&key=${API_KEY}`),
        fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${prevPark.photos[0].photo_reference}&key=${API_KEY}`)
      ])

      Promise.all([getParkInfo, getParkUrl])
      .then(([parkInfo, parkUrl]) => {
        const parks = {
          currentPark: {info: parkInfo[0].result, url: parkUrl[0].url, og: park},
          nextPark: {info: parkInfo[1].result, url: parkUrl[1].url, og: nextPark},
          prevPark: {info: parkInfo[2].result, url: parkUrl[2].url, og: prevPark},
        }

        dispatch({
          type: 'SET_SELECTED_PARK',
          payload: parks
        })
      })
    }
  }
}

/////////////  MY LIST ACTIONS /////////////


export const get_m_l = (userId) => {
  return async (dispatch) => {
    request(`/users/${userId}/favs`)
    .then(favs => {
      return Promise.all(favs.data.data.map(park => getOneParkInfo(park)))
    })
    .then(res => {
      dispatch({
        type: GET_ML,
        payload: res
      })
    })
  }
}

const getOneParkInfo = (park) => {
  return fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${park.parkId}&key=${API_KEY}`)
  .then(response => {
    return response.json()
  })
  .then(res => {
    const fav = {
      info: res.result,
      url: park.parkUrl,
      parkId: park.parkId
    }
    return fav
  })
}

export const add_to_m_l = (toAdd, userId) => {
  return async (dispatch) => {
    request(`/users/${userId}/favs`, 'post', {parkId: toAdd.info.place_id, parkUrl: toAdd.url})
    .then( response => {
      dispatch({
        type: ADD_ML,
        payload: {
          info: toAdd.info,
          url: toAdd.url,
          parkId: toAdd.info.place_id
        }
      })
    })
    .catch(error => console.log(error))
  }
}

export const remove_m_l = (parkId, userId) => {
  return async (dispatch) => {
    request(`/users/${userId}/favs/${parkId}`, 'delete')
    .then(response => {
      dispatch({
        type: REM_ML,
        payload: parkId
      })
    })
    .catch(error => console.log(error))
  }
}

/////////////  ACTIV ACTIONS /////////////


export const getActivs = (id) => {
  return async (dispatch) => {
    request(`/users/${id}/activ`)
    .then(res => {
      dispatch({
        type: GET_ACS,
        payload: res.data
      })
    })
    .catch(error => console.log(error))
  }
}


/////////////  LOGIN ACTIONS /////////////


export const login = (username,password) => (
  dispatch => {
    request('/auth/token', 'post', {username, password})
    .then(response => {
      const {token} = response.data
      AsyncStorage.setItem('token', token)
      return token
    })
    .then((token) => {
      dispatch(loginIfTokenPresent())
    })
    .catch(error => console.log('meeee',error))
  }
)

export const loginIfTokenPresent = () => (
  dispatch => {
    request('/auth/token')
    .then(response => {
      dispatch({
        type: AUTH_STATE,
        payload: response.data.id
      })
      AsyncStorage.getItem('token')
      .then((token) => {
        dispatch({
          type: LOGIN,
          payload: {token}
        })
      })
    })
    .catch(error => console.log(error))
  }
)

export const logout = () => (
  dispatch => {
    AsyncStorage.setItem('token', '')
    dispatch({
      type: LOGOUT
    })
  }
)


/////////////  TOGGLE/NAV ACTIONS /////////////
export const favToMap = (location, name) => (
  dispatch => {
    dispatch({
      type: FAV_TO_MAP,
      payload: {
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.0130,
        longitudeDelta: 0.0130,
        name
      }
    })
  }
)
export const mapToFav = () => (
  dispatch => {
    dispatch({
      type: MAP_TO_FAV
    })
  }
)

export const toggleMap = () => (
  dispatch => {
    dispatch({
      type: TOG_MAP
    })
  }
)

export const toggleList = () => (
  dispatch => {
    dispatch({
      type: TOG_ML
    })
  }
)
