
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  AsyncStorage,
  Navigator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Account from './account/Login';
import Creation from './creation';
import Edit from './edit';
import Login from './account/Login';

export default class first_App extends Component {
  constructor () {
    super();
    this._afterLogin = this._afterLogin.bind(this);
    this._asyncAppStatus = this._asyncAppStatus.bind(this);
    this.state = {
      selectedTab: 'account',
      login: false,
      user: null
      // notifCount: 0,
      // presses: 0,
    }
  }
  componentDidMount() {
    this._asyncAppStatus()
  }
  _asyncAppStatus() {
    AsyncStorage.getItem('user')
    .then(data => {
      let user;
      let newState = {};
      if (data) {
        uer = JSON.parse(data);
      };
      if (user && user.accessToken) {
        newState.user = user;
        newState.login = true;
      } else {
        newState.login = false
      }
      this.setState = (newState)
    })
  }
 List () {
   return (
     <View style={[styles.tabContent, {backgroundColor: '#cccccc'}]}>
       <Text style={styles.tabText}>列表页面</Text>
     </View>
   );
  }
_renderContent (color: string, pageText: string, num?: number) {
   return (
     <View style={[styles.tabContent, {backgroundColor: color}]}>
       <Text style={styles.tabText}>{pageText}</Text>
       <Text style={styles.tabText}>{num} re-renders of the {pageText}</Text>
     </View>
   );
 }
_afterLogin(user) {
  const _this = this;
  const _user = JSON.stringify(user);
  _this.setState({
    login: true
  })
  // AsyncStorage.setItem('user', _user)
  // .then((data) => {
  //   // this.state.login = true;
  //   // console.log(_this.state.login, '1')
  //   console.log(typeof this.setState, 'root')
  //   this.setState({
  //     login: true
  //   })
  //   // this.setState(state)
  //   // console.log(this.state.login, '2')
  // })
  // .catch(error => {
  //   console.log(error)
  // })
}
   render () {
     console.log(this.state.login, 'render')
     if (!this.state.login) {
       return (
         <Login afterLogin={this._afterLogin.bind(this)} />
       )
     }
     return (
       <TabBarIOS
         unselectedTintColor="yellow"
         tintColor="white"
         barTintColor="darkslateblue">
         <Icon.TabBarItem
           title="Blue Tab"
           iconName='ios-videocam-outline'
           selectedIconName='ios-videocam'
           selected={this.state.selectedTab === 'creation'}
           onPress={() => {
             this.setState({
               selectedTab: 'creation',
             });
           }}>
           {/* {this.List()} */}
           <Navigator
           initialRoute={{
             name: 'list',
             component: Creation,
           }}
           configuerScene={route => {
             return Navigator.SceneConfigs.FloatFromRight
           }}
           renderScene={(route, navigator) =>{
             const Component = route.component;
             return <Component {...route.params} navigator={navigator} />
           }}
            />
         </Icon.TabBarItem>
         <Icon.TabBarItem
          //  systemIcon="history"
          //  badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
          title="ing"
          selected={this.state.selectedTab === 'account'}
          iconName='ios-recording-outline'
          selectedIconName='ios-recording'
           onPress={() => {
             this.setState({
               selectedTab: 'account',
              //  notifCount: this.state.notifCount + 1,
             });
           }}>
           <Account />
           {/* {this._renderContent('#783E33', 'Red Tab', this.state.notifCount)} */}
         </Icon.TabBarItem>
         <Icon.TabBarItem
          //  iconName={require('./src/img/1.jpg')}
          //  selectedIcon={require('./src/img/2.jpg')}
          iconName='ios-more-outline'
          selectedIconName='ios-more'
           renderAsOriginal
           title="More"
           selected={this.state.selectedTab === 'edit'}
           onPress={() => {
             this.setState({
               selectedTab: 'edit',
              //  presses: this.state.presses + 1
             });
           }}>
           <Edit />
           {/* {this._renderContent('#21551C', 'Green Tab', this.state.presses)} */}
         </Icon.TabBarItem>
       </TabBarIOS>
     );
   }
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  tabContent: {
  flex: 1,
  alignItems: 'center',
  },
  tabText: {
    color: 'black',
    margin: 50,
  },
});

AppRegistry.registerComponent('first_App', () => first_App);
