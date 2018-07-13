import React from 'react';
// import { RNCamera } from 'react-native-camera';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Platform } from 'react-native';
import { Constants } from 'expo';
import { AsyncStorage } from "react-native"

import Map from './Map'
import MyList from './MyList'
import ParkSearch from './ParkSearch'
import Signin from './Signin'
import ExampleCamera from './CameraExample'

import {getParks, getLocation, getActivs, loginIfTokenPresent, logout, get_m_l} from '../redux/actions.js'

import styles from '../styles.js'

class Main extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      mapRef: null
    }
  }

  setMapRef = (mapRef) => {
    this.setState({mapRef})
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

  componentDidMount(){
                      //this.props.authState
    this.props.getLocation()
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
        return <Map setMapRef={this.setMapRef} mapRef={this.state.mapRef}/>
      }
      if(this.props.showMyList){
        return <MyList mapRef={this.state.mapRef}/>
      }
      if(this.props.showSearch){
        return <ParkSearch />
      }
    }
  }
}
const mapStateToProps = ({ authState, showMap, showMyList, showSearch, token}) => ({ authState, showMap, showMyList, showSearch, token})
const mapDispatchToProps = (dispatch) => bindActionCreators({ getParks, logout, getLocation, getActivs, loginIfTokenPresent, get_m_l }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Main)
