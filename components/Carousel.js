import React, { Component } from "react";
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
import PoiPress from './PoiPress'

const SCREEN_WIDTH = Dimensions.get("window").width;

const xOffset = new Animated.Value(0);

const Screen = props => {
  return (
    <View style={styles.scrollPage}>
      <Animated.View style={[styles.screen, transitionAnimation(props.index)]}>
        <View style={{flex: 1, backgroundColor: 'powderblue'}}>
          <Image
            style={{flex: 1}}
            source={{uri: `${props.parkURL}`}}
          />
        </View>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <View style={props.ratingCont}>
            <Text style={props.rating}>{`${props.park.rating}/5`}</Text>
          </View>
          <View style={props.ratingCont}>
            <Button
              onPress={() => {
                if(my_list.some((ele) =>  {
                  return ele.currentPark.id === park.id
                }
              )){
                  console.log('Already in List!!')
                } else {
                  const finalPark = {
                  currentPark: park,
                  imageUrl: parkURL,
                  }
                  props.add_to_m_l(finalPark)
                }
              }}
              title="Add to MyList"
              color="#841584"
              accessibilityLabel="Button that adds park to MyList"
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const transitionAnimation = index => {
  return {
    transform: [
      { perspective: 800 },
      {
        scale: xOffset.interpolate({
          inputRange: [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH
          ],
          outputRange: [0.25, 1, 0.25]
        })
      },
      {
        rotateX: xOffset.interpolate({
          inputRange: [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH
          ],
          outputRange: ["45deg", "0deg", "45deg"]
        })
      },
      {
        rotateY: xOffset.interpolate({
          inputRange: [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH
          ],
          outputRange: ["-45deg", "0deg", "45deg"]
        })
      }
    ]
  };
};

export default class Carousel extends Component {
  render() {
    return (
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: xOffset } } }],
          { useNativeDriver: true }
        )}
        horizontal
        pagingEnabled
        style={styles.scrollView}
      >
        <Screen ratingCont={this.props.ratingCont} rating={this.props.rating} add_to_m_l={this.props.add_to_m_l} park={this.props.currentPark} parkURL={this.props.currentParkURL} index={0} />
        <Screen ratingCont={this.props.ratingCont} rating={this.props.rating} add_to_m_l={this.props.add_to_m_l} park={this.props.nextPark} parkURL={this.props.nextParkURL} index={1} />
        <Screen ratingCont={this.props.ratingCont} rating={this.props.rating} add_to_m_l={this.props.add_to_m_l} park={this.props.prevPark} parkURL={this.props.prevParkURL} index={2} />
      </Animated.ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: "row",
    marginTop: -250
  },
  scrollPage: {
    width: SCREEN_WIDTH,
    padding: 20
  },
  screen: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "white"
  },
  text: {
    fontSize: 45,
    fontWeight: "bold"
  }
});
