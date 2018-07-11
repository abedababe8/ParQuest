import React from "react";
import {Animated, Dimensions, Text, View, Image, Button} from "react-native";
import {Rating, Icon} from 'react-native-elements'
import styles from '../styles.js'

const SCREEN_WIDTH = Dimensions.get("window").width;

const Screen = ({parkURL, authState, park, my_list, index, add_to_m_l, xOffset}) => {
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

  return (
    <View style={styles.scrollPage}>
      <Animated.View style={[styles.screen, transitionAnimation(index)]}>
        <View style={{flex: 2, alignSelf: 'stretch', backgroundColor: '#fff', borderTopRightRadius: 25, borderTopLeftRadius: 25, overflow: 'hidden'}}>
          <Image
            style={{flex: 1}}
            source={{uri: `${parkURL}`}}
          />
          <Text style={{color: '#33cc33'}}>{`${park.name}`}</Text>
        </View>
        <View style={{flex: 1, alignSelf: 'stretch', flexDirection: 'column'}}>
          <View style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
            <View style={{flex: 1, justifyContent: 'center'}} >
              <Rating
                readonly
                type="star"
                fractions={5}
                startingValue={park.rating}
                imageSize={20}
                style={{flex:1}}
              />
            </View>
            <View style={{flex: 2, justifyContent: 'flex-start'}} >
              <Text style={{color: '#f1c40f', fontSize: 20}}>{`${park.rating}/5`}</Text>
            </View>
          </View>
          <View style={styles.ratingCont}>
            <Icon
              name='playlist-add'
              onPress={() => {
                  const finalPark = {
                  info: park,
                  url: parkURL,
                  }
                  add_to_m_l(finalPark, my_list, authState)
                }
              }
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default Screen
