import React, {Component} from 'react';
import {View,ToastAndroid, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList, ScrollView, Image, TextInput, DatePickerAndroid,Picker, Alert, BackHandler} from 'react-native';
import { Container, Button, Header, Body, Title, Right, Left, Footer, FooterTab, Content} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/AntDesign';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {asyncData} from '../components/asyncData';
import ImagePicker from 'react-native-image-picker';

import {get, url} from '../components/fetch';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Constants from "../../Constants";



class Detail extends Component{

  constructor(props){
    super(props);

    this.id = this.props.route.params["id"]
    this.getUrl = url();

    this.isDelete=false;

    this.state={
      mail:'',
      data:[],
      user:[],
    }


  }//Constructor

  componentDidMount(){
    this.backHandler = BackHandler.addEventListener(
     "hardwareBackPress",
     this.back
   );
    this.getMail();
    this.fetchData();
  }


  componentWillUnmount() {
    this.backHandler.remove();
  }

  back = () => {
    this.props.route.params.onGoBack(this.isDelete);
    this.props.navigation.goBack();
    return true;
  }

  getMail(){
    asyncData()
      .then(response => {
        this.setState({
          mail:response[0],
        })
      })
  }


  /*
  *Etkinmlik silme işlemi
  */
  deleteActivity = () => {
    Alert.alert(
      "Etkinliği silmek istediğinizden emin misiniz?",
      "",
      [
        {text:"Evet", onPress: this.fetchDelete},
        {text:"İptal", onPress:() => null},
      ]
    )
  }

  /*
  *
  *Etkinlik silme olayı
  *
  */

  fetchDelete = async () => {
    console.log("fetchdelete");
    var url = this.getUrl + "Activities/deleteActivity/";
    var value = {id:this.id};

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(value),
      headers:{
        'Content-Type': 'application/json',
      },
    }).then(response => response.json() )
      .then((response) => {
        console.log(response);

        var deger = response.valueOf("message");

        if(deger.message === "0"){
          this.isDelete=true;
          Alert.alert(
            "Ürün Silindi",
            "",
            [
              {text:"Tamam", onPress: () => {
                this.back();
              }},
            ]
          );
        }

    }).catch(error =>  ToastAndroid.show(error, ToastAndroid.LONG));
  }


  /*
  *Fetch işlemi
  */

  async fetchData(){

      var url = this.getUrl + "Activities/detail/";
      var value = {id:this.id};

      await fetch(url, {
        method: 'POST',
        body: JSON.stringify(value),
        headers:{
          'Content-Type': 'application/json',
        },
      }).then(response => response.json() )
        .then((response) => {

          console.log(response);

          this.setState({
            data:response.Data,
            user:response.User,
          })

      }).catch(error => ToastAndroid.show(error, ToastAndroid.LONG) );

    }



  render(){

    var {navigation} = this.props;
    console.log("renderrrrrrrrrrr");

    var email;
    if(this.state.user.length !== 0){
      this.state.user.map((value) => {
        email = value.Email;
      })
    }


    if(this.state.mail === ''){
      return(
          <View></View>
      );
    }else {


      return(

          <Container>

              <Header
                style={styles.header}
                androidStatusBarColor="#c42846">

                <Left>
                  <TouchableOpacity
                    onPress={() => this.back()}
                    style={{marginLeft:10, flex:1, justifyContent:'center'}}
                  >
                    <Icon name="md-arrow-back" color="#ffffff" size={30}/>
                </TouchableOpacity>
                </Left>

                <Right style={{marginRight:10}}>
                  <Text style={styles.headerBodyText}>Sosyal Kampüs</Text>
                  {this.state.mail === email ?
                    <TouchableOpacity style={{marginLeft:15}}
                      onPress={this.deleteActivity}
                    >
                      <Material name="delete" size={25} color="#ffffff" />
                    </TouchableOpacity>

                    :

                    null
                  }
                </Right>
              </Header>

              <Content>

                <View style={styles.contentBox}>

                {this.state.data.map((value,key) => {

                    return(
                      <View key={key} style={styles.viewBox}>
                        <View style={{alignItems:'center'}}>
                          <Image
                            style={{height:250, width:250}}
                            resize="stretch"
                            source={{uri: "http://192.168.1.104:8080" + value.Image}}
                          />
                        </View>

                        <View style={{marginTop:10}}>
                          <Text style={styles.text}>Etkinlik Türü</Text>
                          <Text style={styles.responseText}>{value.Type}</Text>
                        </View>

                        <View style={{marginTop:10}}>
                          <Text style={styles.text}>Etkinlik Tarihi</Text>
                          <Text style={styles.responseText}>{value.Date}</Text>
                        </View>

                        {value.Price === "0" ?

                        <View style={{marginTop:10}}>
                          <Text style={styles.text}>Etkinlik Ücreti</Text>
                          <Text style={styles.responseText}>Ücretsiz</Text>
                        </View>



                        :

                        <View style={{marginTop:10}}>
                          <Text style={styles.text}>Etkinlik Açıklaması</Text>
                          <Text style={styles.responseText}>{value.Price}</Text>
                        </View>
                        }

                        <View style={{marginTop:10}}>
                          <Text style={styles.text}>Etkinlik Açıklaması</Text>
                          <Text style={styles.responseText}>{value.Content}</Text>
                        </View>

                        <View style={{marginTop:10}}>
                          <Text style={styles.text}>Etkinlik Adresi</Text>
                          <Text style={styles.responseText}>{value.Address}</Text>
                        </View>

                        {value.Longitude === null ?

                          null

                          :

                          <MapView
                             provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                             style={styles.map}
                             region={{longitude:value.Longitude, latitude:value.Latitude,latitudeDelta: 0.015, longitudeDelta: 0.0121}}
                           >

                             <Marker
                               coordinate = {{longitude:value.Longitude, latitude:value.Latitude}}
                             />
                          </MapView>

                        }

                      </View>
                    )

                })}

                </View>

              </Content>



          </Container>

      );
    }


  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  contentBox:{
    margin:10,
  },
  header:{
    backgroundColor:'#c42846',
  },
  headerBodyText:{
    fontSize:25,
    fontWeight:"bold",
    fontFamily:'FFF_Tusj',
    color:'#ffffff',
  },
  text:{
    fontSize:20,
    fontWeight:'bold',
    alignItems:'flex-start',
    textDecorationLine:'underline',
    color:'#c42846'
  },
  responseText:{
    fontSize:18,
  },
  viewBox:{
    flex:1,
  },
  map: {
   width:Constants.MAX_WIDTH,
   height:Constants.MAX_HEIGHT/2,
 },

})


export default Detail;
