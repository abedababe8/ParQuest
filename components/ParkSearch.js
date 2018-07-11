import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View, Button, Picker } from 'react-native';
import NavigationBar from 'react-native-navbar';

import styles from '../styles.js'

import {getParks, getLocation, logout, toggleList, toggleMap} from '../redux/actions.js'

class ParkSearch extends Component {
  constructor(props){
    super(props)
    this.state = {
      radius: 1000,
      showPicker: false
    }
  }

  showPicker = () => {
    this.setState({showPicker:!this.state.showPicker});
  }
  radiusChange = (itemValue, itemIndex) => this.setState({radius: itemValue})

  render(){
    return(
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{ backgroundColor: '#ff9900', }}>
          <NavigationBar
            title={{ title: 'Search', }}
            leftButton={{ title: 'My List',
                          tintColor: '#33cc33',
                          handler: () => {
                            this.props.toggleList()
                          }}}
            rightButton={{ title: 'Signout',
                           tintColor: '#841584',
                           handler: () => {
                             this.props.logout()
                           }}} />
        </View>

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
            ? null
            :  <Picker
            style={{flex:1}}
            selectedValue={this.state.radius}
            style={{ height: 50, width: 100 }}
            onValueChange={this.radiusChange}>
              <Picker.Item label="500 m" value="500" />
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
