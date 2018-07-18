import React from "react";
import {Animated, Dimensions, Text, View, Image, Button} from "react-native";
import {Rating, Icon, Button as RNButton} from 'react-native-elements'
import styles from '../styles.js'

const SCREEN_WIDTH = Dimensions.get("window").width;

const Screen = ({ setError, parkURL, authState, park, my_list, index, add_to_m_l, xOffset}) => {
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
        <View style={{flex: 4, alignSelf: 'stretch', backgroundColor: '#fff', borderTopRightRadius: 25, borderTopLeftRadius: 25, overflow: 'hidden'}}>
          <Image
            style={{flex: 1}}
            source={{uri: `${parkURL}`}}
          />
          <Text style={{color: '#33cc33'}}>{`${park.name}`}</Text>
        </View>
        <View style={{flex: 1, alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'center'}}>
          <View style={{flex: 1, justifyContent: 'space-around', flexDirection: 'row'}}>
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
            <View style={{flex: 1, alignItems: 'flex-end'}} >
              <Text style={{color: '#f1c40f', fontSize: 20}}>{`${park.rating}/5`}</Text>
            </View>
            <RNButton
              containerViewStyle={{flex:2, marginTop: -8}}
              title='Add to My List'
              icon={{name:'playlist-add'}}
              onPress={() => {
                const finalPark = {
                  info: park,
                  url: parkURL,
                }
                if(!my_list.find(ele => ele.parkId === finalPark.info.place_id)){
                    setError('added')
                    add_to_m_l(finalPark, authState)
                    setTimeout(() => {
                      setError(null)
                    },1500)
                } else {
                  setError('inList')
                  setTimeout(() => {
                    setError(null)
                  },1500)
                }
              }}
              backgroundColor="#5fc9f8"
              rounded
              raised
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default Screen
