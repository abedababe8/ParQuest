import React from 'react'
import ExampleCamera from './CameraExample'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View, FlatList, ImageBackground, Text } from 'react-native';
import NavigationBar from 'react-native-navbar';
import ListCard from './ListCard'
import { getActivs, toggleMap, toggleList} from '../redux/actions.js'

import styles from '../styles.js'

class MyList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      showCamera: false
    }
  }

  getDistance(a,b){
    var R = 6371000; // metres
    var φ1 = a.latitude * (Math.PI / 180);
    var φ2 = b.lat * (Math.PI / 180);
    var Δφ = φ2 - φ1
    var Δλ = (b.lng-a.longitude)* (Math.PI / 180);

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    return d
  }

  componentWillMount(){
    this.props.getActivs(this.props.authState)
  }

  render(){
    return(
      <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ImageBackground style={{
        flex: 1,
        alignSelf: 'stretch',
      }}
      source={require('../top-view-forrest.jpg')}
      >
        <View style={{ backgroundColor: '#ff9900', }}>
          <NavigationBar
            containerStyle={{backgroundColor:'#33cc33'}}
            title={{ title: 'My List', }}
            leftButton={{ title: 'Search',
                          tintColor: '#fff',
                          handler: () => {
                            this.props.toggleList()
                          } }}
            rightButton={{title: 'Map',
                          tintColor: '#fff',
                          handler: () => {
                            this.props.toggleMap()
                            this.props.toggleList()
                          }  }} />
        </View>
        {
          this.state.showCamera
          ? < ExampleCamera showCamera={() => {this.setState({showCamera: !this.state.showCamera})}}/>
          : this.props.my_list.length
          ? <FlatList
              data={this.props.my_list}
              renderItem={({item}) => { return <ListCard item={item} showCamera={() => {this.setState({showCamera: !this.state.showCamera})}} getDistance={this.getDistance}/>}}
              keyExtractor={(item, index) => index.toString()}
            />
          : <Text style={{textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: 35}}>No parks in your List yet, add them from the Map!</Text>
        }
        </ImageBackground>

      </View>
    )
  }
}
const mapStateToProps = ({location, activs, authState, my_list}) => ({location, activs, authState, my_list})
const mapDispatchToProps = (dispatch) => bindActionCreators({ getActivs, toggleMap, toggleList }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(MyList)
