import React from 'react'
import { View, FlatList } from 'react-native';
import NavigationBar from 'react-native-navbar';
import ListCard from './ListCard'


const MyList = ({ container, leftButtonHandler, my_list, renderItem }) => (
  <View style={container}>
    <View style={{ backgroundColor: '#ff9900', }}>
      <NavigationBar
        title={{ title: 'Outside', }}
        leftButton={{ title: 'My List',
                      handler: leftButtonHandler }}
        rightButton={{ title: 'Forward', }} />
    </View>

    <FlatList
      keyExtractor={(item, index) => index}
      data={my_list}
      renderItem={({item}) => { return <ListCard item={item} />}}
    />
  </View>
)

export default MyList
