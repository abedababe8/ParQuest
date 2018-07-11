import React, { Component } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Button
} from "react-native";
import {Rating} from 'react-native-elements'
import {add_to_m_l} from '../redux/actions.js'
import styles from '../styles.js'

import Screen from './Screen.js'

const SCREEN_WIDTH = Dimensions.get("window").width;

const xOffset = new Animated.Value(0);

class Carousel extends Component {

  handleMomentumScrollEnd = (e) => {
    let carouselIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)
    if(carouselIndex === 0){
      this.props.animateToPoi(this.props.currentPark.og)
    }
    if(carouselIndex === 1){
      this.props.animateToPoi(this.props.nextPark.og)
    }
    if(carouselIndex === 2){
      this.props.animateToPoi(this.props.prevPark.og)
    }

  }

  render() {
    return (
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: xOffset } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd = {this.handleMomentumScrollEnd}
        horizontal
        pagingEnabled
        style={styles.scrollView}
      >
        <Screen authState={this.props.authState} xOffset={xOffset} my_list={this.props.my_list} add_to_m_l={this.props.add_to_m_l} park={this.props.currentPark.info} parkURL={this.props.currentPark.url} index={0} />
        <Screen authState={this.props.authState} xOffset={xOffset} my_list={this.props.my_list} add_to_m_l={this.props.add_to_m_l} park={this.props.nextPark.info} parkURL={this.props.nextPark.url} index={1} />
        <Screen authState={this.props.authState} xOffset={xOffset} my_list={this.props.my_list} add_to_m_l={this.props.add_to_m_l} park={this.props.prevPark.info} parkURL={this.props.prevPark.url} index={2} />
      </Animated.ScrollView>
    );
  }
}

const mapStateToProps = ({
  authState,
  parks,
  selectedPark,
  my_list }) =>
  ({
    authState,
    parks,
    selectedPark,
    currentPark: selectedPark.currentPark,
    nextPark: selectedPark.nextPark,
    prevPark:selectedPark.prevPark,
    my_list })
const mapDispatchToProps = (dispatch) => bindActionCreators({ add_to_m_l }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Carousel)
