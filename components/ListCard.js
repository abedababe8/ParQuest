import React from 'react'
import request from '../request.js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, Text, Button, FlatList, AlertIOS, Image, TouchableOpacity, CameraRoll } from 'react-native'
import {Card, Icon, Rating, Divider} from 'react-native-elements'
import Expo, {Permissions} from 'expo'

import { favToMap, toggleMap, toggleList, remove_m_l } from '../redux/actions.js'
class ListCard extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      showActivs: false,
      myActivs: [],
      colors: ['#5fc9f8','#fecb2e','#fd9426','#fc3158','#147efb','#53d769','#fc3d39'],
      parkPoints: 0,
      showPhotos: false,
      myPhotoUris: [],
      disToPark: Number(Math.round(this.props.getDistance(this.props.location.coords, this.props.item.info.geometry.location)).toFixed(0))
    }
  }

  _takePic = async (parkId, userId) => {
    let result = await Expo.ImagePicker.launchCameraAsync()
    if (!result.cancelled) {
      this.postPhoto(parkId, userId, result.uri)
    }
  }


  getPhotos = (parkId, userId) => {
    request(`/users/${userId}/favs/${parkId}`)
    .then(response => {
      this.setState({myPhotoUris: response.data})
    })
    .catch(error => console.log(error))
  }

  postPhoto = (parkId, userId, uri) => {
    request(`/users/${userId}/favs/${parkId}`, 'post', {uri})
    .then(response => {
      this.getPhotos(parkId, userId)
    })
    .catch(error => console.log(error))
  }


  getAcsForFav = (userId, parkId) => {
    request(`/users/${userId}/favs/${parkId}/activ`)
    .then( res => {

      const myActivs = res.data.reduce((acc, ele) =>{
        const a = acc.find(activity => activity.activId === ele.activId)
        if(a){
          a.pts += ele.pts
        }
        else {
          acc.push(ele)
        }
        return acc
      },[])

      const parkPoints = myActivs.reduce((acc, ele) => acc + ele.pts,0)

      this.setState({myActivs, parkPoints})
    })
    .catch(error => console.log(error))
  }

  postAcForFav = (userId, parkId, activId) => {
    request(`/users/${userId}/favs/${parkId}/activ/${activId}`, 'post')
    .then(res => {
      this.getAcsForFav(userId, parkId)
    })
    .catch(error => console.log(error))
  }

  updatePtsForAc = (userId, parkId, activId, pts) => {
    request(`/users/${userId}/favs/${parkId}/activ/${activId}`, 'put', {pts})
    .then(res =>{
      this.getAcsForFav(userId, parkId)
    })
    .catch(error => console.log(error))
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    const { status2 } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  }

  componentDidMount(){
    this.getAcsForFav(this.props.authState, this.props.item.parkId)
    this.getPhotos(this.props.item.parkId, this.props.authState)
  }

  render(){
    return (
    <Card
      containerStyle={{borderRadius: 25}}
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
        <Text style={{flex:2, textAlign: 'center', paddingVertical: 10, fontSize: 20, color: '#f1c40f' }}>
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
                onPress: () => {
                  this.state.myPhotoUris.map(uri => {
                    Expo.FileSystem.deleteAsync(uri.uri)
                  })
                  this.props.remove_m_l(this.props.item.parkId, this.props.authState)

                },
              },
            ]
          );
        }}
        />

        {
          this.state.disToPark < 200
        ? <Icon
            containerStyle={{flex:1}}
            iconStyle={{flex:1, paddingVertical: 10}}
            name='photo-camera'
            onPress={() => {this._takePic(this.props.item.parkId, this.props.authState)}}
          />
        : null
        }

        <Icon
        containerStyle={{flex:1}}
        iconStyle={{flex:1, paddingVertical: 10}}
        type='ionicon'
        name='md-photos'
        onPress={() => {this.setState({showPhotos: !this.state.showPhotos})}}
        />

        <Icon
        containerStyle={{flex:1}}
        iconStyle={{flex:1, paddingVertical: 10, color: '#53d769'}}
        type='font-awesome'
        name='map-o'
        onPress={() => {
          this.props.toggleList()
          this.props.favToMap(this.props.item.info.geometry.location, this.props.item.info.name)
          this.props.toggleMap()
        }}
        />
      </View>
      <View style={{flex: 0.5, flexDirection: 'row'}}>
        <Text >
          {this.props.item.info.formatted_address}
        </Text>
      </View>

      <View style={{flex: 0.5, flexDirection: 'row'}}>
        <Text >
          { this.state.disToPark > 1000
            ? `${this.state.disToPark/1000}km away`
            : `${this.state.disToPark}m away`
          }
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
                  this.postAcForFav(this.props.authState, this.props.item.parkId, item.id)
                }}
              />
              <Text >{item.name}</Text>
            </View>
          }
          />
          : null
        }
        {
          this.state.showActivs
          ? <FlatList
            style={{backgroundColor: '#f2f2f2', marginTop: 5}}
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
                    this.setState({showActivs: !this.state.showActivs})

                }}
              />
              <Text >{item.name}</Text>
            </View>
          }
          />
          : null
        }
        {
         this.state.showPhotos
         ? this.state.myPhotoUris.length
          ? <FlatList
             style={{marginTop: 5}}
             horizontal
             data={this.state.myPhotoUris}
             keyExtractor={(item, index) => index.toString()}
             renderItem={({item}) => (
               <View style={{alignItems: 'center', justifyContent:'center', marginHorizontal: 5}}>
               <TouchableOpacity
                 style={{height:100, width:100}}
                 onPress={() => {
                   AlertIOS.alert(
                     'Save?',
                     'Do you want to Save this photo to your Camera Roll?',
                     [
                       {
                         text: 'Cancel',
                         onPress: () => console.log('Cancel Pressed'),
                       },
                       {
                         text: 'ADD',
                         onPress: () => CameraRoll.saveToCameraRoll(item.uri),
                       },
                     ]
                   );
                 }}>
                  <Image source={{uri: item.uri}} style={{height:100, width:100, borderRadius: 5}} />
                </TouchableOpacity>
               </View>
             )}
           />
         : <Text>No photos for this park yet.</Text>
        : null
      }
      </View>
    </Card>
  )
  }
}

const mapStateToProps = ({activs, location, authState }) => ({activs, location, authState })
const mapDispatchToProps = (dispatch) => bindActionCreators({ favToMap, toggleMap, toggleList, remove_m_l }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ListCard)
