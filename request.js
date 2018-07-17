import axios from 'axios'
import { AsyncStorage } from "react-native"

async function request(path, method = 'get', body = null) {
  let bearerToken = ''
  const token = await AsyncStorage.getItem('token')

  if(token){
    bearerToken = `Bearer ${token}`
  }

  return axios(`https://blooming-cliffs-23606.herokuapp.com${path}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': bearerToken
    },
    data: body
  })
  .catch(function(error){
    return Promise.reject(error)
  })
}

export default request
