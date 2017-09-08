import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  AlertIOS
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import request from '../common/request';
import config from '../common/config';
import Item from './Item';
import Detail from './Detail';

const width = Dimensions.get('window').width;
const cachedResults = {
  nextPage : 1,
  items : [],
  total: 0
}

export default class Creation extends Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
    this._fetchMoreData = this._fetchMoreData.bind(this);
    this._hasMore = this._hasMore.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this._loadPage = this._loadPage.bind(this);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      isLoadingTail: false,
      isRefreshing: false,
      // up: row.voted
    };
  }
  componentDidMount() {
    // fetch('http://rap.taobao.org/mockjs/16005/api/creations?accessToken=123',)
    this._fetchData(1)
  }
  _loadPage(row) {
    this.props.navigator.push({
      name: 'Detail',
      component: Detail,
      params: {
        data: row,
        cachedResults: cachedResults
      }
    })
  }
  _fetchData(page) {
    if (page !== 0 ){
      this.setState({
        isLoadingTail: true
      })
    } else {
      this.setState({
        isRefreshing: true
      })
    }

    request.get(config.api.base + config.api.creations, {
      accessToken: '123',
      page: page
    })
      .then((data) => {
        if(data.success) {
          let items = cachedResults.items.slice();
          if (page !== 0) {
            items = items.concat(data.data);
            cachedResults.nextPage += 1;
          } else {
            items = data.data.concat(items);
          }
          cachedResults.items = items;
          cachedResults.total = data.total;
          let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          setTimeout((() => {if (page !== 0) {
            this.setState({
              isLoadingTail: false,
              dataSource: ds.cloneWithRows(cachedResults.items)
            })
          } else {
            this.setState({
              isRefreshing: false,
              dataSource: ds.cloneWithRows(cachedResults.items)
            })
          }}), 2000)
        }
      })
      .catch((error) => {
        if (page !== 0) {
          this.setState({
            isLoadingTail: false
          })
        } else {
          this.setState({
            isRefreshing: false
          })
        }
      });
  }
  _hasMore() {
    let result = cachedResults.items.length !== cachedResults.total
    return result
  }
  _fetchMoreData(){
    if (!this._hasMore() || this.state.isLoadingTail) {
      return
    }
    let page = cachedResults.nextPage;
    this._fetchData(page)
  }
  _renderFooter() {
    if (!this._hasMore() && cachedResults.total !== 0) {
      return (
        <View style={styles.loadingMore}>
          <Text style={styles.loadingText}>
            没有更多了
          </Text>
        </View>
      )
    }
    if (!this.state.isLoadingTail) {
      return <View style={styles.loadingMore} />
    }
     return (
       <ActivityIndicator
        // animating={this.state.animating}
        style={[styles.loadingMore, {height: 80}]}
        size="large"
      />
     )
  }
  _onRefresh() {
    if (!this._hasMore() || this.state.isRefreshing) {
      return
    }
    this._fetchData(0)
  }
  renderRow(row) {
    return (
      <Item onSelect={() => this._loadPage(row)} row={row} key={row._id} />
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>列表页面</Text>
        </View>
        <ListView
         dataSource={this.state.dataSource}
         onEndReached={this._fetchMoreData}
         onEndReachedThreshold={20}
         renderFooter={this._renderFooter}
         renderRow={this.renderRow}
         enableEmptySections={true}
         showsVerticalScrollIndicator={false}
         automaticallyadjustcontentinsets={false}
         refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh}
            tintColor="#ff6600"
            title="加载中..."
          />
        }
       />
      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735c'
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600'
  },
  commentIcon: {
    fontSize: 22,
    color: '#333'
  },
  loadingMore: {
    marginVertical: 20
  },
  loadingText: {
    color: '#777',
    textAlign: 'center'
  }
});
