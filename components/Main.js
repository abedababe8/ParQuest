import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Platform } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { AsyncStorage } from "react-native"

import Map from './Map'
import MyList from './MyList'
import ParkSearch from './ParkSearch'
import Signin from './Signin'

import {getParks, getLocation, getActivs, loginIfTokenPresent, logout, get_m_l} from '../redux/actions.js'

import styles from '../styles.js'

class Main extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      mapRef: null
    }
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this.props.loginIfTokenPresent()
    }
  }

  async componentDidMount(){
    const { status }  =  await Permissions.askAsync(Permissions.LOCATION);
    if(status !== 'granted'){
      console.log('not permissed')
    }
    else {
    setInterval(()=> {
      this.props.getLocation()
    }, 1000)
    }
  }
  componentDidUpdate(prevProps){
    if(this.props.authState !== prevProps.authState && this.props.authState){
      this.props.get_m_l(this.props.authState)
    }
  }

  render() {
    if(!this.props.token){
      return <Signin />
    } else {
      if(this.props.showMap){
        return <Map />
      }
      if(this.props.showMyList){
        return <MyList />
      } else {
        return <ParkSearch />
      }
    }
  }
}
const mapStateToProps = ({ authState, showMap, showMyList, token}) => ({ authState, showMap, showMyList, token})
const mapDispatchToProps = (dispatch) => bindActionCreators({ getParks, logout, getLocation, getActivs, loginIfTokenPresent, get_m_l }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Main)
