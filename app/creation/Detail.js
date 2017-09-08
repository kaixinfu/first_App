import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ListView,
  ScrollView,
  Image,
  TextInput,
  Modal,
  AlertIOS
} from 'react-native';
import Video from 'react-native-video';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Ionicons';
import request from '../common/request';
import config from '../common/config';
const width = Dimensions.get('window').width;
const cachedResults = {
  items : [],
  total: 0
}

export default class Detail extends Component {
  constructor() {
    super();
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this._back = this._back.bind(this);
    this._onProgress = this._onProgress.bind(this);
    this._onEnd = this._onEnd.bind(this);
    this._replay = this._replay.bind(this);
    this._paused = this._paused.bind(this);
    this._resume = this._resume.bind(this);
    this._onError = this._onError.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
    this._setModalVisible = this._setModalVisible.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._blur = this._blur.bind(this);
    this._closeModal = this._closeModal.bind(this);
    this._setContent = this._setContent.bind(this);
    this._submit = this._submit.bind(this);
    this.state = {
      videoLoaded: false,
      rate: 1,
      muted: false,
      playing: false,
      paused: false,
      videoTotal: 0,
      currentTime: 0,
      resizeMode: 'contain',
      repeat: false,
      videoProgress: 0.01,
      videoOk: true,
      dataSource: ds.cloneWithRows([]),
      modalVisible: false,
      content: '',
      isSending: false
    }
  }
  _back() {
    this.props.navigator.pop()
  }
  _onLoadStart() {
    console.log('start')
  }
  _onLoad() {
    console.log('go')
  }
  _onProgress(data) {
    if (!this.state.videoLoaded) {
      this.setState({
        videoLoaded: true
      })
    }
    let duration = data.playableDuration;
    let currentTime = data.currentTime;
    let percent = Number((currentTime / duration).toFixed(3));
    const newState = {
      videoTotal: duration,
      currentTime: Number((data.currentTime).toFixed(3)),
      videoProgress: percent
    }
    if (data.playableDuration !== 0) {
      if (!this.state.videoLoaded) {
        newState.videoLoaded = true;
      }
      if (!this.state.playing) {
        newState.playing = true;
      }
    }
    this.setState(newState);
  }
  _onEnd() {
    this.setState({
      videoProgress: 1,
      playing: false
    })
  }
  _onError() {
    this.setState({
      videoOk: false
    })
  }
  _replay() {
    this.refs.videoPlayer.seek(0);
  }
  _paused() {
    if (!this.state.paused) {
      this.setState({
        paused: true
      })
    }
  }
  _resume() {
    if (this.state.paused) {
      this.setState({
        paused: false
      })
    }
  }
  componentDidMount() {
    this._fetchData()
  }
  _fetchData() {
    const url = config.api.base + config.api.comment;
    request.get(url, {
      id: 123,
      accessToken: '123',
    })
    .then(data => {
      if (data && data.success) {
        const comments = data.data;
        cachedResults.items = comments
        if (comments && (comments.length > 0)) {
          const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          this.setState({
            comments: comments,
            dataSource: ds.cloneWithRows(comments)
          })
        }
      }
    })
    .catch(error => {
      console.log(error)
    })
  }
  _onFocus() {
    this._setModalVisible(true)
  }
  _setModalVisible(boolean) {
    this.setState({
      modalVisible: boolean
    })
  }
  _blur() {

  }
  _closeModal() {
    this._setModalVisible(false)
  }
  _setContent(content) {
    this.setState({
      content: content
    })
  }
  _submit() {
    if (!this.state.content) {
      return AlertIOS.alert('留言不能为空')
    }
    if (this.state.isSending) {
      return AlertIOS.alert('留言正在提交...')
    }
    this.setState({
      isSending: true
    }, () => {
      const body = {
        accessToken: '123',
        creation: '123',
        content: this.state.content
      }
      const url = config.api.base + config.api.comment;
      request.post(url, body)
      .then(data => {
        if (data && data.success) {
          let items = cachedResults.items.slice();
          const text = this.state.content
          items = [{
            content: text,
            replyBy: {
              nickname: 'topdmc',
              avator: 'http://dummyimage.com/640x640/31e23b)'
            }
          }].concat(items);
          cachedResults.items = items;
          cachedResults.total = cachedResults.total + 1;
          const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          this.setState({
            isSending: false,
            content: '',
            dataSource: ds.cloneWithRows(cachedResults.items)
          });
          this._setModalVisible(false);
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({
          isSending: false,
        });
        this._setModalVisible(false);
        AlertIOS.alert('留言失败')
      })
    })
  }
  _renderRow(row) {
    return (
      <View style={styles.replyBox} key={row._id}>
        <Image style={styles.replyAvator} source={{uri: row.replyBy.avator}} />
        <View style={styles.reply}>
          <Text style={styles.replynickname}>
            {row.replyBy.nickname}
          </Text>
          <Text style={styles.replyContent}>
            {row.content}
          </Text>
        </View>
      </View>
    )
  }
  _renderHeader() {
    const {
      data
    } = this.props
    return (
      <View style={styles.listHeader}>
        <View style={styles.infoBox}>
          <Image style={styles.avator} source={{uri: data.author.avator}} />
          <View style={styles.descBox}>
            <Text style={styles.nickname}>
              {data.author.nickname}
            </Text>
            <Text style={styles.title}>
              {data.title}
            </Text>
          </View>
        </View>
        <View style={styles.commentBox}>
          <View style={styles.comment}>
            <Text>留个印儿</Text>
          </View>
          <TextInput placeholder='评论一下' style={styles.content} multiline={true} onFocus={this._onFocus} />
        </View>
        <View style={styles.commentArea}>
          <Text style={styles.commentText}>精彩评论:</Text>
        </View>
      </View>
    )
  }
  render() {
    const {
      data
    } = this.props
    const {
      paused,
      rate,
      muted,
      resizeMode,
      repeat,
      videoLoaded,
      playing,
      resume,
      videoProgress,
      videoOk
    } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={this._back} style={styles.backBox}>
            <Icon name='ios-arrow-back' style={styles.backIcon} />
            <Text style={styles.backText}>
              返回
            </Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOflines={1}>
            视频详情页
          </Text>
        </View>
        <View style={styles.videoBox}>
          <Video
            ref='videoPlayer'
            source={{uri: data.video}}
            style={styles.video} volume={5}
            paused={paused}
            rate={rate}
            muted={muted}
            resizeMode={resizeMode}
            repeat={repeat}
            onLoadStart={this._onLoadStart}
            onLoad={this._onLoad}
            onProgress={this._onProgress}
            onEnd={this._onEnd}
            onError={this._onError}
          />
          {
            !videoLoaded && <ActivityIndicator color='#ee735c' style={styles.loading} />
          }
          {
            videoLoaded && !playing ?
            <Icon name='ios-play' onPress={this._replay} style={styles.play} size={58} /> : null
          }
          {
            videoLoaded && playing ?
            <TouchableOpacity onPress={this._paused} style={styles.pauseBtn}>
              {
                paused ? <Icon name='ios-play' onPress={this._resume} size={58} style={styles.resumeIcon} /> : <Text></Text>
              }
            </TouchableOpacity> : null
          }
          {
            !videoOk && <Text style={styles.videoOk}>
              视频出错了~
            </Text>
          }
          <View style={styles.progressBox}>
            <View style={[styles.progressBar, {width: width * videoProgress}]}></View>
          </View>
        </View>
        <ScrollView
          enableEmptySections={true}
          showsVerticalScrollIndicator={false}
          automaticallyadjustcontentinsets={false}
          style={styles.scrollView}
        >
          <ListView
           dataSource={this.state.dataSource}
           renderHeader={this._renderHeader}
           enableEmptySections={true}
           showsVerticalScrollIndicator={false}
           automaticallyadjustcontentinsets={false}
           renderRow={this._renderRow} />
        </ScrollView>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this._setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Icon name='ios-close-outline' onPress={this._closeModal} style={styles.closeIcon} />
            <View style={styles.commentBox}>
              <View style={styles.comment}>
                <Text>留个印儿</Text>
              </View>
              <TextInput
                placeholder='评论一下'
                style={styles.content}
                multiline={true}
                // onFocus={this._onFocus}
                // onBlur={this._blur}
                defaultValue={this.state.content}
                onChangeText={(text) => this._setContent(text)} />
            </View>
            <Button style={styles.submitButton} onPress={this._submit}>评论</Button>
          </View>
        </Modal>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  modalContainer: {
    flex: 1,
    paddingTop: 45,
    backgroundColor: '#fff'
  },
  closeIcon: {
    alignSelf: 'center',
    fontSize: 30,
    color: '#ee753c'
  },
  submitButton: {
    width: width - 20,
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ee735c',
    borderRadius: 4,
    color: '#ee735c',
    fontSize: 16
  },
  videoBox: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000'
  },
  video: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000'
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: 90,
    width: width,
    alignSelf: 'center',
    backgroundColor: 'transparent'
  },
  progressBox: {
    width: width,
    height: 2,
    backgroundColor: '#ccc'
  },
  progressBar: {
    width: 1,
    height: 2,
    backgroundColor: '#ff6600'
  },
  play: {
    position: 'absolute',
    top: 80,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 2,
    paddingLeft: 20,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    color: '#eb7b66'
  },
  pauseBtn: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: width * 0.56,
    backgroundColor: 'transparent'
  },
  resumeIcon: {
    position: 'absolute',
    top: 60,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 2,
    paddingLeft: 20,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    color: '#eb7b66',
    alignSelf: 'center'
  },
  videoOk: {
    position: 'absolute',
    left: width / 2 - 30,
    top: 80,
    width: width,
    textAlign: 'center',
    color: '#FFFFFF',
    backgroundColor: 'transparent'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: 64,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#fff'
  },
  backBox: {
    position: 'absolute',
    left: 12,
    top: 32,
    width: 50,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTitle: {
    width: width - 120,
    textAlign: 'center'
  },
  backIcon: {
    color: '#999',
    fontSize: 20,
    marginRight: 5,
  },
  backText: {
    color: '#999'
  },
  infoBox: {
    flexDirection: 'row',
    width: width,
    justifyContent: 'center',
    marginTop: 10,
  },
  avator: {
    width: 60,
    height: 60,
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 30,
  },
  descBox: {
    flex: 1,
  },
  nickname: {
    fontSize: 18,
  },
  title: {
    marginTop: 8,
    fontSize: 16,
    color: 'black',
  },
  replyBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10
  },
  replyAvator: {
    width: 40,
    height: 40,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20
  },
  replynickname: {
    color: '#666'
  },
  replyContent: {
    marginTop: 4,
    color: '#666'
  },
  reply: {
    flex: 1
  },
  commentBox: {
    marginTop: 10,
    marginBottom: 10,
    padding: 8,
    width: width
  },
  listHeader: {
    width: width,
    marginTop: 10
  },
  content: {
    paddingLeft: 2,
    color: '#333',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 80,
    fontSize: 14
  },
  commentArea: {
    width: width,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  }
});
