import React, {Component} from 'React'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styles from '../styles.js'
import { View, KeyboardAvoidingView } from 'react-native';
import  request  from '../request.js'
import {login, newUser} from '../redux/actions.js'
import { FormLabel, FormInput, Divider, Icon, Button } from 'react-native-elements';

class Signin extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: null,
      password: null,
      new_username: null,
      new_password: null,
    }
  }

  render(){

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <FormLabel >Username</FormLabel>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Icon name='leaf' color='#33cc33' type='font-awesome'/>
            <FormInput
              ref= {(el) => { this.username = el; }}
              onChangeText={(username) => this.setState({username})}
              value={this.state.username}
            />
          </View>
        <FormLabel >Password</FormLabel>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Icon name='key' type='foundation'/>
          <FormInput
            secureTextEntry={true}
            ref= {(el) => { this.password = el; }}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
          />
        </View>
        <Button
          containerViewStyle={{margin: 20}}
          backgroundColor={'#33cc33'}
          rightIcon={{name: 'code'}}
          title='Signin'
          onPress={()=>{
            this.props.login(this.state.username, this.state.password)
          }}/>


        <Divider style={{ backgroundColor: 'blue' }} />


        <FormLabel >Username</FormLabel>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Icon name='handshake-o' type='font-awesome' />
          <FormInput
            ref= {(el) => { this.new_username = el; }}
            onChangeText={(new_username) => this.setState({new_username})}
            value={this.state.new_username}
          />
        </View>

        <FormLabel >Password</FormLabel>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Icon name='key' type='foundation'/>
          <FormInput
            secureTextEntry={true}
            ref= {(el) => { this.new_password = el; }}
            onChangeText={(new_password) => this.setState({new_password})}
            value={this.state.new_password}
          />
        </View>

        <Button
          containerViewStyle={{margin: 20}}
          backgroundColor={'#33cc33'}
          rightIcon={{name: 'code'}}
          title='Signup'
          onPress={()=>{
            this.props.newUser(this.state.new_username, this.state.new_password)
          }}/>
    </KeyboardAvoidingView>
    )
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ login, newUser }, dispatch)
export default connect(null, mapDispatchToProps)(Signin)
