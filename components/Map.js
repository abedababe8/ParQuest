import React from 'React'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Text, View, Button, Image, Platform, Dimensions } from 'react-native';
import { MapView, Permissions, Location } from 'expo';
import dayMap from '../dayMap.json'
import SweetCarousel from './Carousel'
import NavigationBar from 'react-native-navbar';

import { getMoreParks, getLocation, markerPress, resetPark, toggleMap, toggleList, mapToFav} from '../redux/actions.js'

import styles from '../styles.js'

const SCREEN_HEIGHT = Dimensions.get("window").height - 50;

class Map extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      errorMessage: null,
    }
  }
  animateToPoi = (park) => {
    setTimeout(() => {
      this.mapView.animateToRegion({
        latitude: park.coords.latitude,
        longitude: park.coords.longitude,
        latitudeDelta: Math.abs(park.geometry.viewport.northeast.lat - park.geometry.viewport.southwest.lat + .013),
        longitudeDelta: Math.abs(park.geometry.viewport.northeast.lng - park.geometry.viewport.southwest.lng)
      }, 700 )
    }, 700)
    this.mapView.animateToRegion({
      latitude: this.props.location.coords.latitude,
      longitude: this.props.location.coords.longitude,
      latitudeDelta: 0.0620,
      longitudeDelta: 0.0620,
    }, 1000)
  }

  getDistance(a,b){
    var R = 6371000; // metres
    var φ1 = a.latitude * (Math.PI / 180);
    var φ2 = b.latitude * (Math.PI / 180);
    var Δφ = φ2 - φ1
    var Δλ = (b.longitude-a.longitude)* (Math.PI / 180);

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    return d
  }

  render(){
    if(this.props.favLoc){
      setTimeout(() => {
        if(this.mapView) this.mapView.animateToRegion(this.props.favLoc, 1000)
      }, 500)
    }
    const self = this
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
          {
            this.props.nextPageToken
            ? <NavigationBar
              title={{ title: 'Map', }}
              leftButton={{ title: 'Search',
                            tintColor: '#33cc33',
                            handler: () => {
                              this.props.toggleMap()
                              this.props.mapToFav()
                              this.props.resetPark()
                            } }}
              rightButton={{ title: 'More Parks',
                             tintColor: '#33cc33',
                             handler: () => {
                              this.props.getMoreParks(this.props.parks, this.props.nextPageToken)
                            }}} />
            : <NavigationBar
              title={{ title: 'Map', }}
              leftButton={{ title: 'Search',
                            tintColor: '#33cc33',
                            handler: () => {
                              this.props.toggleMap()
                              this.props.mapToFav()
                              this.props.resetPark()
                            } }}
              rightButton={{title: 'My List',
                            tintColor: '#33cc33',
                            handler: () => {
                              this.props.toggleMap()
                              this.props.mapToFav()
                              this.props.resetPark()
                              this.props.toggleList()
                            } }} />
          }

        { this.props.location
          ? <MapView
              onUserLocationChange={event => this.setState({location:event.nativeEvent})}
              customMapStyle={dayMap}
              showsCompass
              style={{height: SCREEN_HEIGHT - 20}}
              provider="google"
              showsUserLocation={true}
              initialRegion={{
                latitude: this.props.location.coords.latitude,
                longitude: this.props.location.coords.longitude,
                latitudeDelta: 0.0420,
                longitudeDelta: 0.0420,
              }}
              ref= {domNode => { this.mapView = domNode; }}
            >
            {
              this.props.favLoc
              ? <MapView.Marker
                  key={1}
                  coordinate={{latitude: this.props.favLoc.latitude, longitude: this.props.favLoc.longitude}}
                  pinColor={'blue'}
                  title={this.props.favLoc.name}
                  description={`${Math.round(this.getDistance(this.props.location.coords, {latitude: this.props.favLoc.latitude, longitude: this.props.favLoc.longitude})).toFixed(0)} meters away`}
                />
              : null
            }
            {
              this.props.parks
              ? this.props.parks.map((park, index, parks) => {
                let found = this.props.my_list.find(myPark => {
                  return myPark.parkId === park.place_id
                })
                if(found){
                  return (
                    <MapView.Marker
                      key={index}
                      coordinate={park.coords}
                      pinColor={'blue'}
                      title={park.name}
                      description={`${Math.round(this.getDistance(this.props.location.coords, park.coords)).toFixed(0)} meters away`}
                      onPress={() => {
                        this.props.getLocation()
                        this.props.resetPark()
                        this.props.markerPress(park, parks)
                        this.animateToPoi(park)
                      }}
                    />
                  )
                } else {
                  return (
                    <MapView.Marker
                      key={index}
                      coordinate={park.coords}
                      pinColor={'green'}
                      title={park.name}
                      description={`${Math.round(this.getDistance(this.props.location.coords, park.coords)).toFixed(0)} meters away`}
                      onPress={() => {
                        this.props.getLocation()
                        this.props.resetPark()
                        this.props.markerPress(park, parks)
                        this.animateToPoi(park)
                      }}
                    />
                  )
                }
               })
              : null
            }
          </MapView>
          : null
      }
        {
          this.props.selectedPark.currentPark
          ?
          <View style={{flex: 5}}>
            <SweetCarousel
            animateToPoi={this.animateToPoi}
            />
          </View>
          : null
        }
      </View>
    )
  }
}
const mapStateToProps = ({parks, location, nextPageToken, selectedPark, favLoc, my_list}) => ({parks, location, nextPageToken, selectedPark, favLoc, my_list})
const mapDispatchToProps = (dispatch) => bindActionCreators({ getMoreParks, getLocation, markerPress, resetPark, toggleMap, mapToFav, toggleList}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Map)
