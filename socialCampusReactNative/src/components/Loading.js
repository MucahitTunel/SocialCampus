import React, {Component} from 'react';
import {View,ToastAndroid,Animated, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList, ScrollView, Image, TextInput, DatePickerAndroid,Picker, Alert, BackHandler} from 'react-native';
import { Container, Button, Header, Body, Title, Right, Left, Footer, FooterTab, Content} from 'native-base';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


import Constants from "../../Constants";
import {get, url} from '../components/fetch';



class Loading extends Component{

  constructor(props){
    super(props);


  }



  render(){

    return(

      <View
        style={styles.container}
        >
          <Text style={{fontSize:20}}>Yükleniyor</Text>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container:{
    backgroundColor:'rgba(0,0,0,0.5)',
    alignItems:'center',
    justifyContent:'center',
  },
  box:{
    width:Constants.MAX_WIDTH,
    height:50,
    position:'absolute',
    top: 0,
    left: 0,
  }


})


export default Loading;
