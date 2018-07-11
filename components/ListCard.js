import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, Text, Button, FlatList } from 'react-native'
import {Card, Icon, Rating} from 'react-native-elements'


// class ListCard extends React.Component {
//   constructor(props){
//     super(props)
//   }
//
//   render(){
//
//   }
// }

const ListCard = ({ item, activs, toggleList, toggleMap, showCamera, getDistance, location }) => {
  console.log(item)
  return (
    <Card
      style={{flex:1, justifyContent: 'center'}}
      title={item.info.name}
      image={{uri: item.url}}
    >
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Rating
          readonly
          type="star"
          fractions={5}
          startingValue={item.info.rating}
          imageSize={20}
          style={{flex:3, paddingVertical: 10, alignSelf: 'flex-start' }}
        />
        <Text style={{flex:2, paddingVertical: 10, fontSize: 20, color: '#f1c40f' }}>
          {`${item.info.rating}/5`}
        </Text>
        <Icon
          containerStyle={{flex:1}}
          iconStyle={{flex:1, paddingVertical: 10}}
          name='photo-camera'
          onPress={() => {
            // toggleList()
            showCamera()
          }}
        />
        <Icon
          containerStyle={{flex:1}}
          iconStyle={{flex:1, paddingVertical: 10, color: '#33cc33'}}
          type='font-awesome'
          name='map-o'
          onPress={() => {
            toggleList()
            // showCamera()
          }}
        />
      </View>
      <View style={{flex: 1, flexDirection: 'row', marginBottom: 10}}>
        <Text>
          {item.info.formatted_address}
        </Text>
      </View>

      <View style={{flex: 1, flexDirection: 'row'}}>
        {
          activs
          ? <FlatList
            horizontal
            data={activs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <Icon
              name={item.iconName}
              type={item.type}
              containerStyle={{flex:1}}
              raised
              onPress={() => {
                console.log(item.name, item.pts)
              }}
            />}
          />
          : null
        }

      </View>
    </Card>
  )
}
const mapStateToProps = ({activs}) => ({activs})
const mapDispatchToProps = (dispatch) => bindActionCreators({  }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ListCard)
