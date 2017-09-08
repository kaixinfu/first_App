/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS
} from 'react-native';
// import o from 'react-native-vector-icons';
// import { createStore } from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';
// const Icon = Ions.Ionicons;

export default class first_App extends Component {
  constructor () {
    super();
    this.state = {
      selectedTab: 'blueTab',
      // notifCount: 0,
      // presses: 0,
    }
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

   render () {
     console.log(0)
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
           {this.List()}
         </Icon.TabBarItem>
         <Icon.TabBarItem
          //  systemIcon="history"
          //  badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
           selected={this.state.selectedTab === 'edit'}
          iconName='ios-recording-outline'
          selectedIconName='ios-recording'
           onPress={() => {
             this.setState({
               selectedTab: 'edit',
              //  notifCount: this.state.notifCount + 1,
             });
           }}>
           {this._renderContent('#783E33', 'Red Tab', this.state.notifCount)}
         </Icon.TabBarItem>
         <Icon.TabBarItem
          //  iconName={require('./src/img/1.jpg')}
          //  selectedIcon={require('./src/img/2.jpg')}
          iconName='ios-more-outline'
          selectedIconName='ios-more'
           renderAsOriginal
           title="More"
           selected={this.state.selectedTab === 'account'}
           onPress={() => {
             this.setState({
               selectedTab: 'account',
              //  presses: this.state.presses + 1
             });
           }}>
           {this._renderContent('#21551C', 'Green Tab', this.state.presses)}
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
