import React from 'react'
import { View, Image, Button } from 'react-native';

const PoiPress = ({currentPark, currentParkURL, my_list, ratingCont, rating, add_to_m_l}) => {

<View style={{flex: 3, flexDirection: 'row'}}>
    <View style={{flex: 1, backgroundColor: 'powderblue'}}>
      <Image
        style={{flex: 1}}
        source={{uri: `${currentParkURL}`}}
      />
    </View>
    <View style={{flex: 1, flexDirection: 'column'}}>
      <View style={ratingCont}>
        <Text style={rating}>{`${currentPark.rating}/5`}</Text>
      </View>
      <View style={ratingCont}>
        <Button
          onPress={() => {
            if(my_list.some((ele) =>  {
              return ele.currentPark.id === currentPark.id
            }
          )){
              console.log('Already in List!!')
            } else {
              const finalPark = {
              currentPark: currentPark,
              imageUrl: currentParkURL,
              }
              add_to_m_l(finalPark)
            }
          }}
          title="Add to MyList"
          color="#841584"
          accessibilityLabel="Button that adds park to MyList"
        />
      </View>
    </View>
  </View>
}

export default PoiPress
