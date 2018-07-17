import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View, Button, Picker, Image, Text, ImageBackground} from 'react-native';
import { Button as RNButton } from 'react-native-elements'
import Carousel from 'react-native-carousel'
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
      <ImageBackground style={{flex: 1}} source={require('../photos/new_year_background.png')} resizeMode="repeat">
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

        <Text style={{marginVertical: 10, textAlign: 'center', fontWeight: 'bold', color: '#33cc33', fontSize: 35}}>PARQUEST</Text>
        {
          !this.state.showPicker
          ? <View style={{height: 380, width:375}}>
              <Carousel
                indicatorSize={25}
                indicatorOffset={-20}
                indicatorAtBottom={true}
                indicatorColor="#33cc33"
                width={375}
                height={375}
                delay={8000}
              >
                <View style={this.state.carouselItemStyle}>
                  <Image
                    style={{width: 375, height: 375}}
                    source={require('../photos/we-are-parks.jpg')}
                  />
                </View>
                <View style={this.state.carouselItemStyle}>
                  <Image
                    style={{width: 375, height: 375}}
                    source={require('../photos/nat-park.jpg')}
                  />
                </View>
                <View style={this.state.carouselItemStyle}>
                  <ImageBackground
                    style={{width: 375, height: 375, alignItems: 'center', justifyContent:'center',}}
                    source={require('../photos/state-park.jpg')}
                  >
                    <Text style={{textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: 35}}>STATE PARKS</Text>
                  </ImageBackground>
                </View>
                <View style={this.state.carouselItemStyle}>
                  <ImageBackground
                    style={{width: 375, height: 375, alignItems: 'center', justifyContent:'center',}}
                    source={require('../photos/city-park.jpg')}
                  >
                    <Text style={{textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: 35}}>CITY PARKS</Text>
                  </ImageBackground>
                </View>
              </Carousel>
            </View>
          : <Picker
              style={{height: 380, width:375}}
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


        <RNButton
          buttonStyle={{marginTop: 20}}
          onPress={() => {
            this.props.getParks(this.props.location, this.state.radius)
            this.props.toggleMap()
          }}
          title="Find parks near Me"
          backgroundColor="#33cc33"
          rounded
          raised
        />

        <RNButton
          buttonStyle={{marginTop: 20, width: 250, alignSelf: 'center'}}
          onPress={this.showPicker}
          title="Change Radius of Search"
          backgroundColor="#33cc33"
          rounded
          raised
        />

      </ImageBackground>
    )
  }
}

const mapStateToProps = ({location}) => ({location})
const mapDispatchToProps = (dispatch) => bindActionCreators({ logout, toggleList, toggleMap, getParks }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ParkSearch)
