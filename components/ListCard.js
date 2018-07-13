import React from 'react'
import request from '../request.js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, Text, Button, FlatList, AlertIOS } from 'react-native'
import {Card, Icon, Rating, Divider} from 'react-native-elements'

import { toggleMap, toggleList, remove_m_l } from '../redux/actions.js'

class ListCard extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      showActivs: false,
      myActivs: [],
      colors: ['#5fc9f8','#fecb2e','#fd9426','#fc3158','#147efb','#53d769','#fc3d39'],
      parkPoints: 0
    }
  }

  // animateToPoi = (park) => {
  //   setTimeout(() => {
  //     this.props.mapRef.animateToRegion({
  //       latitude: park.geometry.location.lat,
  //       longitude: park.geometry.location.lng,
  //       latitudeDelta: Math.abs(park.geometry.viewport.northeast.lat - park.geometry.viewport.southwest.lat + .013),
  //       longitudeDelta: Math.abs(park.geometry.viewport.northeast.lng - park.geometry.viewport.southwest.lng)
  //     }, 700 )
  //   }, 700)
  //   this.props.mapRef.animateToRegion({
  //     latitude: this.props.location.coords.latitude,
  //     longitude: this.props.location.coords.longitude,
  //     latitudeDelta: 0.0620,
  //     longitudeDelta: 0.0620,
  //   }, 1000)
  // }

  getAcsForFav = (userId, parkId) => {
    request(`/users/${userId}/favs/${parkId}/activ`)
    .then( res => {
      res.data.map(activ => {
        this.setState({parkPoints: this.state.parkPoints + activ.pts})
      })
      this.setState({myActivs: res.data})
    })
    .catch(error => console.log(error))
  }

  postAcForFav = (userId, parkId, activId) => {
    request(`/users/${userId}/favs/${parkId}/activ/${activId}`, 'post')
    .then(res => {
      this.getAcsForFav(userId, parkId)
      this.setState({showActivs: !this.state.showActivs})
    })
    .catch(error => console.log(error))
  }

  componentDidMount(){
    this.getAcsForFav(this.props.authState, this.props.item.parkId)
  }

  render(){
    return (
    <Card
      style={{flex:1, justifyContent: 'center', borderTopLeftRadius: 10}}
      title={`${this.props.item.info.name}  ${this.state.parkPoints} pts.`}
      image={{uri: this.props.item.url}}
    >
      <View style={{flex: 2, flexDirection: 'row'}}>
        <Rating
          readonly
          type="star"
          fractions={5}
          startingValue={this.props.item.info.rating}
          imageSize={20}
          style={{flex:3, paddingVertical: 10, alignSelf: 'flex-start' }}
        />
        <Text style={{flex:2, paddingVertical: 10, fontSize: 20, color: '#f1c40f' }}>
          {`${this.props.item.info.rating}/5`}
        </Text>

        <Icon
          containerStyle={{flex:1}}
          iconStyle={{flex:1, paddingVertical: 10, color: '#5fc9f8'}}

          name='add-circle-outline'
          onPress={() => {
            this.setState({showActivs: !this.state.showActivs})
          }}
        />

        <Icon
        containerStyle={{flex:1}}
        iconStyle={{flex:1, paddingVertical: 10, color: '#fc3d39'}}
        type='material-community'
        name='delete-empty'
        onPress={() => {
          AlertIOS.alert(
            'Delete?',
            'Are you sure you want to remove this park from your List?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
              },
              {
                text: 'DELETE',
                onPress: () => this.props.remove_m_l(this.props.item.parkId, this.props.authState),
              },
            ]
          );
        }}
        />

        <Icon
        containerStyle={{flex:1}}
        iconStyle={{flex:1, paddingVertical: 10}}
        name='photo-camera'
        onPress={() => {
          // toggleList()
          this.props.showCamera()
        }}
        />

        <Icon
        containerStyle={{flex:1}}
        iconStyle={{flex:1, paddingVertical: 10, color: '#53d769'}}
        type='font-awesome'
        name='map-o'
        onPress={() => {
          this.props.toggleList()
          this.props.toggleMap()
          // this.animateToPoi(this.props.item.info)
          // showCamera()
        }}
        />
      </View>
      <View style={{flex: 1, flexDirection: 'row', marginBottom: 10}}>
        <Text>
          {this.props.item.info.formatted_address}
        </Text>
      </View>

      <View style={{flex: 1}}>
        {
          this.state.myActivs.length
          ? <FlatList
            horizontal
            data={this.state.myActivs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) =>
            <View style={{alignItems: 'center', justifyContent:'center'}}>
              <Text >{item.pts}</Text>
              <Icon
                name={item.iconName}
                color={this.state.colors[Math.floor(Math.random()*this.state.colors.length)]}
                type={item.type}
                containerStyle={{flex:1}}
                raised
                onPress={() => {
                  console.log(item.name, item.pts)
                }}
              />
              <Text >{item.name}</Text>
            </View>
          }
          />
          : null
        }
        <Divider style={{ backgroundColor: '#8e8e93', marginTop: 10}} />
        {
          this.state.showActivs
          ? <FlatList
            horizontal
            data={this.props.activs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) =>
            <View style={{alignItems: 'center', justifyContent:'center'}}>
              <Text >{item.pts}</Text>
              <Icon
                name={item.iconName}
                type={item.type}
                containerStyle={{flex:1}}
                raised
                onPress={() => {
                  this.postAcForFav(this.props.authState, this.props.item.parkId, item.id)
                }}
              />
              <Text >{item.name}</Text>
            </View>
          }
          />
          : null
        }
      </View>
    </Card>
  )
  }
}

const mapStateToProps = ({activs, location, authState }) => ({activs, location, authState })
const mapDispatchToProps = (dispatch) => bindActionCreators({ toggleMap, toggleList, remove_m_l }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ListCard)
