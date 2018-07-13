import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View, Button, Picker, Image, Text, ImageBackground} from 'react-native';
// import { Button } from 'react-native-elements'
import Carousel from 'react-native-carousel'
// import Carousel from 'react-native-snap-carousel';
import NavigationBar from 'react-native-navbar';

import styles from '../styles.js'

import {getParks, getLocation, logout, toggleList, toggleMap} from '../redux/actions.js'

class ParkSearch extends Component {
  constructor(props){
    super(props)
    this.state = {
      radius: 1000,
      showPicker: false,
      carouselItemStyle: {
        width: 375,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
      },
    }
  }
  _renderItem ({item, index}) {
          return (
              <View style={styles.slide}>
                  <Text style={styles.text}>{ item.title }</Text>
              </View>
          );
      }

  showPicker = () => {
    this.setState({showPicker:!this.state.showPicker});
  }
  radiusChange = (itemValue, itemIndex) => this.setState({radius: itemValue})

  render(){
    return(
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View>
          <NavigationBar
            containerStyle={{backgroundColor:'#33cc33'}}
            title={{ title: 'Search', }}
            leftButton={{ title: 'My List',
                          tintColor: '#fff',
                          handler: () => {
                            this.props.toggleList()
                          }}}
            rightButton={{ title: 'Signout',
                           tintColor: '#841584',
                           handler: () => {
                             this.props.logout()
                           }
                        }}
          />
        </View>

        <View style={{height:50}} />

          <Carousel
            indicatorAtBottom={false}
            indicatorColor="#33cc33"
            width={375}
            height={375}
            delay={8000}
          >
            <View style={this.state.carouselItemStyle}>
              <Image
                style={{width: 350, height: 350}}
                source={require('../we-are-parks.jpg')}
              />
            </View>
            <View style={this.state.carouselItemStyle}>
              <Image
                style={{width: 350, height: 350}}
                source={require('../nat-park.jpg')}
              />
            </View>
            <View style={this.state.carouselItemStyle}>
              <ImageBackground
                style={{width: 350, height: 350, alignItems: 'center', justifyContent:'center',}}
                source={require('../state-park.jpg')}
              >
                <Text style={{textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: 35}}>STATE PARKS</Text>
              </ImageBackground>
            </View>
            <View style={this.state.carouselItemStyle}>
              <ImageBackground
                style={{width: 350, height: 350, alignItems: 'center', justifyContent:'center',}}
                source={require('../city-park.jpg')}
              >
                <Text style={{textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: 35}}>CITY PARKS</Text>
              </ImageBackground>
            </View>
          </Carousel>


          <Button
            style={{flex:1}}
            onPress={() => {
              this.props.getParks(this.props.location, this.state.radius)
              this.props.toggleMap()
            }}
            title="Find parks near Me"
            color="#33cc33"
            accessibilityLabel="Button that takes you to Where you are on Map"
          />

          <Button
            style={{flex:1}}
            onPress={this.showPicker}
            title="Change Radius of Search"
            color="#33cc33"
            accessibilityLabel="Button that displays picker"
          />

            {
              !this.state.showPicker
              ? <View style={{flex:1}} />
              :  <Picker
              style={{flex:1}}
              selectedValue={this.state.radius}
              onValueChange={this.radiusChange}>
                <Picker.Item label= "500 m" value= "500" />
                <Picker.Item label="1000 m" value="1000" />
                <Picker.Item label="1500 m" value="1500" />
                <Picker.Item label="2000 m" value="2000" />
                <Picker.Item label="2500 m" value="2500" />
                <Picker.Item label="3000 m" value="3000" />
                <Picker.Item label="3500 m" value="3500" />
                <Picker.Item label="4000 m" value="4000" />
                <Picker.Item label="4500 m" value="4500" />
                <Picker.Item label="5000 m" value="5000" />
              </Picker>
            }

      </View>
    )
  }
}

const mapStateToProps = ({location}) => ({location})
const mapDispatchToProps = (dispatch) => bindActionCreators({ logout, toggleList, toggleMap, getParks }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ParkSearch)
