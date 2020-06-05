import React, {Component} from 'react';
import {View,ToastAndroid, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList, ScrollView, Image, TextInput, DatePickerAndroid,Picker, Alert} from 'react-native';
import { Container, Button, Header, Body, Title, Right, Left, Footer, FooterTab, Content} from 'native-base';


import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/AntDesign';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';




class Search extends Component{

  constructor(props){
    super(props);

    this.active = null;

    this.state={
      categoriey:["Elektronik","Ev-Bahçe","Spor","Eğlence","Araç","Moda-Aksesuar","Bebek-Çocuk","Film-Kitap-Müzik","Diğer"],
    }

  }//Constructor


  activated = (v) => {
    this.props.activation(v);
  }


  /*
  *
  *Render
  *
  */


  render(){

    var {navigation} = this.props;
    var size = 40;

    return(
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.box, {backgroundColor:'#bc78f7'}]}
          onPress={() => this.activated(0)}
        >
          <Material name="cellphone" size={size}></Material>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.box, {backgroundColor:'#ccf56a'}]}
          onPress={() => this.activated(1)}
        >
          <Icons name="home" size={size}></Icons>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.box, {backgroundColor:'#f7af63'}]}
          onPress={() => this.activated(2)}
        >
          <Material name="soccer" size={size}></Material>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.box, {backgroundColor:'#63eff7'}]}
          onPress={() => this.activated(3)}
        >
          <Icon name="logo-game-controller-b" size={size}></Icon>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.box, {backgroundColor:'#f29fcb'}]}
          onPress={() => this.activated(4)}
        >
          <Material name="car" size={size}></Material>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.box, {backgroundColor:'#f1112f'}]}
          onPress={() => this.activated(5)}
        >
          <Material name="shoe-heel" size={size}></Material>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.box, {backgroundColor:'#29bc28'}]}
          onPress={() => this.activated(6)}
        >
          <Material name="baby-buggy" size={size}></Material>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.box, {backgroundColor:'#e4e825'}]}
          onPress={() => this.activated(7)}
        >
          <Material name="headphones" size={size}></Material>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.box, {backgroundColor:'#6283ca'}]}
          onPress={() => this.activated(8)}
        >
          <Material name="silverware-fork-knife" size={size}></Material>
        </TouchableOpacity>
      </View>


    );
  }
}



const styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    marginTop:5,
  },
  box:{
    marginLeft:5,
    height:60,
    width:60,
    alignItems:'center',
    justifyContent:'center',
    borderWidth:1,
    borderRadius:30,
  }
})






export default Search;
