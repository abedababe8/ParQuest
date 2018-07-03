import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View, FlatList, Button, Picker } from 'react-native';
import getParks from '../redux/actions.js'
import NavigationBar from 'react-native-navbar';


const ParkSearch = ({container, leftButtonHandler, showPark, showPicker, showPickerState, radius, radiusChange}) => (
  <View style={container}>
    <View style={{ backgroundColor: '#ff9900', }}>
      <NavigationBar
        title={{ title: 'Outside', }}
        leftButton={{ title: 'My List',
                      handler: leftButtonHandler}}
        rightButton={{ title: 'Forward', }} />
    </View>

      <Button
        style={{flex:1}}
        onPress={showPark}
        title="Find parks near Me"
        color="#841584"
        accessibilityLabel="Button that takes you to Where you are on Map"
      />

      <Button
      style={{flex:1}}
      onPress={showPicker}
      title="Change Radius of Search"
      color="#841584"
      accessibilityLabel="Button that displays picker"
      />

      {
        !showPickerState
        ? null
        :  <Picker
        style={{flex:1}}
        selectedValue={radius}
        style={{ height: 50, width: 100 }}
        onValueChange={radiusChange}>
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
const mapStateToProps = ({parkList}) => ({parkList})
const mapDispatchToProps = (dispatch) => bindActionCreators({ getParks }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ParkSearch)
