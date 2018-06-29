import React from 'react';
import { StyleSheet, Text, View, Button, Platform, Image, Picker, FlatList } from 'react-native';
import { Constants, Location, Permissions, MapView } from 'expo';
import { Card, Icon, Rating } from 'react-native-elements'
import NavigationBar from 'react-native-navbar';
import Map from './components/Map'
import MyList from './components/MyList'
import ParkSearch from './components/ParkSearch'

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      showMap: false,
      location: null,
      errorMessage: null,
      parks: null,
      currentPark: null,
      radius: 500,
      next_page_token: null,
      my_list: [],
      showMyList: false
    }
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync()
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location })
  };

// renderItem = ({ item }) => (
//   <ListCard item={item} />
// )


  render() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }
    if(this.state.showMap === false){
      if(this.state.showMyList === true){
        return (
          <MyList
            my_list={this.state.my_list}
            container={styles.container}
            leftButtonHandler={() => {
              this.setState({showMyList: !this.state.showMyList})
            }}
          />
        )
      } else {
        return (
          <ParkSearch
            container={styles.container}
            leftButtonHandler={() => {
              this.setState({showMyList: !this.state.showMyList})
            }}
            showPark={() => {
              this.setState({showMap:true});
            }}
            showPicker={() => {
              this.setState({showPicker:!this.state.showPicker});
            }}
            showPickerState={this.state.showPicker}
            radius={this.state.radius}
            radiusChange={(itemValue, itemIndex) => this.setState({radius: itemValue})}
            />
        )
      }
    } else {
      return (
        <Map
          container={styles.container}
          mapButton={styles.mapButton}
          ratingCont={styles.ratingCont}
          rating={styles.rating}
          location={this.state.location}
          radius={this.state.radius}
          my_list={this.state.my_list}
          add_to_m_l={(toAdd) => {
            if(!this.state.my_list.find(ele => ele === toAdd)){
              this.setState({my_list: [...this.state.my_list, toAdd]})
            }
          }}
          hideMap={() => {
            this.setState({showMap:false})
          }}
        />
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  mapButton: {
    marginTop: '10px',
  },
  ratingCont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
  },
  rating: {
    fontFamily: 'Cochin',
    fontSize: 50,
    fontWeight: 'bold'
  }
});
