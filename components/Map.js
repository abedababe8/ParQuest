import React from 'React'
import { Text, View, Button, Image, Platform } from 'react-native';
import { MapView, Permissions, Location } from 'expo';
import dayMap from '../dayMap.json'
import SweetCarousel from './Carousel'
import PoiPress from './PoiPress'


class Map extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      radius: this.props.radius,
      next_page_token: null,
      parks: null,
      currentPark: null,
      currentParkURL: null,
      my_list: this.props.my_list,
      errorMessage: null,
      location: this.props.location
    }
  }

  componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this.getParks()
    }
  }

  getParks = () => {
    fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.state.location.coords.latitude},${this.state.location.coords.longitude}&radius=${this.state.radius}&type=park&key=AIzaSyAoHltFHmXWVi5rX_vKqE7nxqDNFzvjNCs`)
    .then(res => {
      return res.json()
    })
    .then(res => {
      if(res.next_page_token){
        this.setState({ next_page_token: res.next_page_token })
      } else {
        this.setState({ next_page_token: null })
      }
      const parks = res.results.map(park => {
        park.coords = {
          latitude: Number(park.geometry.location.lat),
          longitude: Number(park.geometry.location.lng)
        }
        return park
      })
      this.setState({ parks });
    })
  }

  getMoreParks = () => {
    fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${this.state.next_page_token}&key=AIzaSyAoHltFHmXWVi5rX_vKqE7nxqDNFzvjNCs`)
    .then(res => {
      return res.json()
    })
    .then(res => {
      if(res.next_page_token){
        this.setState({ next_page_token: res.next_page_token })
      } else {
        this.setState({ next_page_token: null })
      }
      const currentParks = this.state.parks
      const newParks = res.results.map(park => {
        const coords = {
          latitude: Number(park.geometry.location.lat),
          longitude: Number(park.geometry.location.lng)
        }
        return {...park, coords}
      })
      const totalParks = currentParks.concat(newParks)
      this.setState({ parks: totalParks });
    })
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

  markerPress(park){
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${park.place_id}&key=AIzaSyAoHltFHmXWVi5rX_vKqE7nxqDNFzvjNCs`)
    .then(response => {
      return response.json()
    })
    .then(res => {
      this.setState({currentPark: res.result})
      fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${park.photos[0].photo_reference}&key=AIzaSyAoHltFHmXWVi5rX_vKqE7nxqDNFzvjNCs`)
    .then(res => {
      this.setState({currentParkURL: res.url})
      this.mapView.animateToRegion({
        latitude: park.coords.latitude,
        longitude: park.coords.longitude,
        latitudeDelta: Math.abs(park.geometry.viewport.northeast.lat - park.geometry.viewport.southwest.lat),
        longitudeDelta: Math.abs(park.geometry.viewport.northeast.lng - park.geometry.viewport.southwest.lng)
        }, 500 )
      })
    })
  }

  render(){
    const self = this
    return (
      <View style={this.props.container}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Button
            onPress={this.props.hideMap}
            style={this.props.mapButton}
            title="Go Back"
            color="#841584"
            accessibilityLabel="Button that takes you back to Home"
          />
          {
            this.state.next_page_token
            ? <Button
                onPress={() => {
                  this.getMoreParks()
                }}
                style={this.props.mapButton}
                title="Show More Parks"
                color="#841584"
                accessibilityLabel="Button that Shows more parks"
              />
            : null
          }

        </View>
        { this.state.location
          ? <MapView
              onUserLocationChange={event => this.setState({location:event.nativeEvent})}
              customMapStyle={dayMap}
              showsCompass
              style={{flex: 8, alignSelf: 'stretch' }}
              provider="google"
              showsUserLocation={true}
              showsMyLocationButton={true}
              initialRegion={{
                latitude: this.props.location.coords.latitude,
                longitude: this.props.location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              ref = {domNode => { this.mapView = domNode }}
            >
            {
              this.state.parks
              ? this.state.parks.map((park, index) => (
                      <MapView.Marker
                        key={index}
                        coordinate={park.coords}
                        pinColor={'green'}
                        title={park.name}
                        description={`${Math.round(this.getDistance(this.props.location.coords, park.coords)).toFixed(0)} meters away`}
                        onPress={() => this.markerPress(park)}
                      />
               ))
              : null
            }
          </MapView>
          : null
      }
        {
          this.state.currentPark
          ? <PoiPress
            currentPark={this.state.currentPark}
            currentParkURL={this.state.currentParkURL}
            my_list={this.state.my_list}
            ratingCont={this.props.ratingCont}
            rating={this.props.rating}
            add_to_m_l={this.props.add_to_m_l}
          />
          : null
        }
      </View>
    )
  }
}

export default Map
