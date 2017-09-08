import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  AlertIOS
} from 'react-native';
import Button from 'react-native-button';
import request from '../common/request';
import config from '../common/config';
import CountDownText from './CountDownText';

export default class Login extends Component {
  constructor() {
    super();
    this._setValue = this._setValue.bind(this);
    this._showVerifyCode = this._showVerifyCode.bind(this);
    this._sendVerifyCode = this._sendVerifyCode.bind(this);
    this._countingDone = this._countingDone.bind(this);
    this._submit = this._submit.bind(this);
    this.state={
      phoneNumber: '',
      codeSent: false,
      verifyCode: '',
      countingDone: false,
      auto: true
    }
  }
  _showVerifyCode() {
    this.setState({
      codeSent: true
    })
  }
  _sendVerifyCode() {
    if (!this.state.auto) {
      this.setState({
        auto: false
      })
    }
    const phoneNumber = this.state.phoneNumber;
    if (!phoneNumber) {
      return AlertIOS.alert('手机号不能为空')
    }
    const body = {
      phoneNumber: phoneNumber,
    }
    const singupUrl = config.api.base + config.api.singup
    request.post(singupUrl, body)
    .then(data => {
      if (data && data.success) {
        this._showVerifyCode()
      } else {
         AlertIOS.alert('获取验证码失败, 请检查手机号码是否有误')
      }
    })
    .catch(error => {
      AlertIOS.alert('获取验证码失败,请检查网络')
    })
  }
  _setValue(key, text) {
    if (key === 'verifyCode') {
      this.setState({
        verifyCode: text
      })
    }
    if (key === 'phoneNumber') {
      this.setState({
        phoneNumber: text
      })
    }
  }
  _countingDone() {
    this.setState({
      countingDone: true,
      auto: false
    })
  }
  _submit() {
    const _this = this
    const phoneNumber = this.state.phoneNumber;
    const verifyCode = this.state.verifyCode;
    if (!phoneNumber && !verifyCode) {
      return AlertIOS.alert('手机号不能为空')
    }
    const body = {
      phoneNumber: phoneNumber,
      verifyCode: verifyCode
    }
    const verifyUrl = config.api.base + config.api.verify
    request.post(verifyUrl, body)
    .then(data => {
      if (data && data.success) {
        // this._showVerifyCode()
        console.log(typeof this.setState, 'login')
        _this.props.afterLogin(data.data)
      } else {
         AlertIOS.alert('获取验证码失败, 请检查手机号码是否有误')
      }
    })
    .catch(error => {
      console.log(error)
      AlertIOS.alert('获取验证码失败,请检查网络')
    })
  }
  render() {
    // console.log(CountDownText)
    return (
      <View style={styles.container}>
        <View style={styles.singupBox}>
          <Text style={styles.title}>
            快速登录
          </Text>
          <TextInput
           placeholder='请输入手机号'
           autoCaptialize={'none'}
           autoCorrect={false}
           keyboardType={'number-pad'}
           style={styles.inputFeild}
           onChangeText={(text) => {
             this._setValue('phoneNumber', text)
           }} />
           {
             this.state.codeSent ?
             <View style={styles.verifyCodeBox}>
               <TextInput
                placeholder='请输入验证码'
                autoCaptialize={'none'}
                autoCorrect={false}
                keyboradType={'number-pad'}
                style={styles.inputVerifyFeild}
                onChangeText={(text) => {
                  this._setValue('verifyCode', text)
                }} />
                {
                  this.state.countingDone ?
                  <Button style={styles.countBtn} onPress={this._sendVerifyCode}>获取验证码</Button>
                    :
                  <CountDownText style={styles.countBtn}
                    countType='seconds' // 计时类型：seconds / date
                    auto={this.state.auto} // 自动开始
                    afterEnd={this._countingDone} // 结束回调
                    timeLeft={9} // 正向计时 时间起点为0秒
                    step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                    startText='开始' // 开始的文本
                    endText='结束' // 结束的文本
                    intervalText={(sec) => sec + '秒重新获取'} // 定时的文本回调
                  />
                }
             </View> : null
           }
           {
             this.state.codeSent ?
             <Button style={styles.btn} onPress={this._submit}>登录</Button> :
             <Button style={styles.btn} onPress={this._sendVerifyCode}>获取验证码</Button>
           }
        </View>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  singupBox: {
    marginTop: 30
  },
  title: {
    marginBottom: 20,
    color: '#333',
    fontSize: 30,
    textAlign: 'center'
  },
  inputFeild: {
    // flex: 1,
    height: 40,
    padding: 5,
    color: '#666',
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 4
  },
  inputVerifyFeild: {
    flex: 1,
    height: 40,
    padding: 5,
    color: '#666',
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  btn: {
    padding: 10,
    marginTop: 10,
    backgroundColor: 'transparent',
    borderColor: '#ee735c',
    borderWidth: 1,
    borderRadius: 4,
    color: '#ee735c'
  },
  verifyCodeBox: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  countBtn: {
    width: 110,
    height: 40,
    padding: 10,
    marginLeft: 8,
    backgroundColor: '#ee735c',
    color: '#fff',
    borderColor: '#ee735c',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
    borderRadius: 2,
    alignItems: 'center'
  }
});
