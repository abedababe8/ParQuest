import React from 'react'
import { View, Text, Button } from 'react-native'
import {Card, Icon, Rating} from 'react-native-elements'

const ListCard = ({ item }) => (
  <Card
    style={{flex:1, justifyContent: 'center'}}
    title={item.currentPark.name}
    image={{uri: item.imageUrl}}
  >
    <View style={{flex: 1, flexDirection: 'row'}}>
      <Rating
        readonly
        type="star"
        fractions={5}
        startingValue={item.currentPark.rating}
        imageSize={20}
        style={{flex:1, paddingVertical: 10 }}
      />
      <Text style={{flex:1, color: '#f1c40f' }}>
        {`${item.currentPark.rating}/5`}
      </Text>
    </View>
    <Text style={{marginBottom: 10}}>
      {item.currentPark.formatted_address}
    </Text>
    <Button
      icon={<Icon name='code' color='#ffffff' />}
      backgroundColor='#03A9F4'
      fontFamily='Lato'
      buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
      title='VIEW NOW'
      onPress={() => {
        console.log('pressed on myList button')
      }}
    />
    <Button
      icon={<Icon name='code' color='#ffffff' />}
      backgroundColor='#03A9F4'
      fontFamily='Lato'
      buttonStyle={{borderRadius: 0, marginLeft: 10, marginRight: 0, marginBottom: 0}}
      title='FAVORITE'
      onPress={() => {
        console.log('pressed on Favorite button')
      }}
    />
  </Card>
)

export default ListCard
