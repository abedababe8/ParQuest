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
  constructor(props){
    super(props)
    this.state={
      error: null
    }
  }

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
    if(!this.state.error){
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

          <Screen setError={(err) => this.setState({error: err})} authState={this.props.authState} xOffset={xOffset} my_list={this.props.my_list} add_to_m_l={this.props.add_to_m_l} park={this.props.currentPark.info} parkURL={this.props.currentPark.url} index={0} />
          {this.props.nextPark
          ? <Screen setError={(err) => this.setState({error: err})} authState={this.props.authState} xOffset={xOffset} my_list={this.props.my_list} add_to_m_l={this.props.add_to_m_l} park={this.props.nextPark.info} parkURL={this.props.nextPark.url} index={1} />
          : null}
          {this.props.prevPark
          ? <Screen setError={(err) => this.setState({error: err})} authState={this.props.authState} xOffset={xOffset} my_list={this.props.my_list} add_to_m_l={this.props.add_to_m_l} park={this.props.prevPark.info} parkURL={this.props.prevPark.url} index={2} />
          : null}
        </Animated.ScrollView>
      );
    } else if(this.state.error === 'inList') {
      return (
        <View style={styles.scrollView}>
          <View style={styles.scrollPage}>
            <Text style={{textAlign: 'center', fontWeight: 'bold', color: 'black', fontSize: 35}}>Already In List</Text>
          </View>
        </View>
      )
    } else if(this.state.error === 'added') {
      return (
        <View style={styles.scrollView}>
          <View style={styles.scrollPage}>
            <Text style={{textAlign: 'center', fontWeight: 'bold', color: 'black', fontSize: 35}}>Added to My List!</Text>
          </View>
        </View>
      )
    }
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
