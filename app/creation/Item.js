import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import request from '../common/request';
import config from '../common/config';
const width = Dimensions.get('window').width;

export default class Item extends Component {
  constructor(props) {
    super(props);
    this._up = this._up.bind(this);
    this.state = {
      up: props.row.voted,
      row: props.row
    }
  }
  _up() {
    let up = !this.state.up;
    let row = this.state.row;
    const url = config.api.base + config.api.up;
    const body = {
      id: row._id,
      up: up ? 'yes' : 'no',
      accessToken: '123',
    };
    request.post(url, body)
    .then(data => {
      if(data && data.success) {
        this.setState({
          up: up
        })
      } else {
        AlertIOS.alert('点赞失败,请稍后重试')
      }
    })
    .catch( error => {
      AlertIOS.alert(error);
    })
  }
  render() {
    const {
      row,
      onSelect
      // onSubmit
    } = this.props;
    return (
      <TouchableHighlight onPress={onSelect}>
        <View style={styles.item}>
          <Text style={styles.title}>
            {row.title}
          </Text>
          <Image source={{uri: row.thumb}} style={styles.thumb}>
            <Icon name='ios-play' size={28} style={styles.play} />
          </Image>
          <View style={styles.itemFooter}>
            <View style={styles.handleBox}>
              <Icon name={!this.state.up ? 'ios-heart-outline' : 'ios-heart'} size={28} style={[styles.up, this.state.up ? null : styles.down]} />
              <Text style={styles.handleText} onPress={this._up}>
                喜欢
              </Text>
            </View>
            <View style={styles.handleBox}>
              <Icon name='ios-chatboxes-outline' size={28} style={styles.commentIcon} />
              <Text style={styles.handleText}>
                评论
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
};

var styles = StyleSheet.create({
  item: {
    width: width,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  thumb: {
    width: width,
    height: width * 0.5,
    resizeMode: 'cover'
  },
  titie:{
    padding: 10,
    fontSize: 18,
    color: '#333'
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee'
  },
  handleBox: {
    padding: 10,
    flexDirection: 'row',
    width: width / 2 - 0.5,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  play: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 46,
    height: 46,
    paddingTop: 9,
    paddingLeft: 18,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 23,
    color: '#eb7b66'
  },
  handleText: {
    paddingLeft: 12,
    fontSize: 18,
    color: '#333'
  },
  up: {
    fontSize: 22,
    color: 'red'
  },
  down: {
    fontSize: 22,
    color: '#333'
  },
});
