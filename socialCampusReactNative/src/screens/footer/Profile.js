import React, {Component} from 'react';
import {View,ToastAndroid, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList, ScrollView, Image, TextInput, DatePickerAndroid,Picker, Alert} from 'react-native';
import { Container, Button, Header, Body, Title, Right, Left, Footer, FooterTab, Content} from 'native-base';


import Constants from '../../../Constants';
import {get, url} from '../../components/fetch';
import { YellowBox } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import {asyncData, getProfilPageData} from '../../components/asyncData';


import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/AntDesign';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';



class Profile extends Component{

  constructor(props){
    super(props);

    this.getUrl = url();

    this.ara = false;
    this.addProfileAsync=0;


    this.state={
      mail : "",
      data:[],
      fetchKontrol:false,
    }

    this.removeItemValue = this.removeItemValue.bind(this);
  }//Constructor

  componentDidMount(){
    var deger = this.props.page;
    console.log(deger);
    this.getMail(deger);
  }


  storeData = async () => {

    if(this.state.fetchKontrol === true){
      try {
        await AsyncStorage.setItem('@profilpagedata', JSON.stringify(this.state.data));


      } catch (e) {
        // saving error
        console.log("hata");
      }
    }
  }

  getAsyncData = () => {
    getProfilPageData()
      .then(response => {

        this.setState({
          data:JSON.parse(response),

        })
      })
  }

  /*
  *DidMount içindeki işlemler
  */
  getMail(deger){
    asyncData()
      .then(response => {
        this.setState({
          mail:response[0],
        })

        if(deger === 2){
          this.getAsyncData()
        }else {
          this.fetchData()
        }

      })
  }

  /*
  *Uygulamadan çıkış
  */
  exit = () => {

    console.log("exit");
    Alert.alert(
      'Oturumu Kapat',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [

        {text: 'İptal', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Evet', onPress: this.removeItemValue},
      ],
      { cancelable: false }
    )
    return true;
  }


  refresh = (v) =>{
    console.log(v);
    if(v === true){
      this.addProfileAsync=0;
      this.fetchData();
    }
  }

  /*
  *
  * Remove async Storage
  *
  */

  removeItemValue = async () => {
    console.log("remove");
    try {
        await AsyncStorage.clear();
        this.props.navigation.navigate("Login")
        return true;
    }
    catch(exception) {
      console.log(exception);
        return false;
    }
}



  /*
  *Fetch işlemi
  */

  async fetchData(){

      var formData = new FormData();
      formData.append("Mail", this.state.mail)

      var url = this.getUrl + "Kullanicilar/profile/"

      await fetch(url, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers:{
          'Content-Type': 'application/json',
        },
      }).then(response => response.json() )
        .then((response) => {
          console.log(response);
          this.setState({
            data: response,
            fetchKontrol:true,
          })
      }).catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
  }



  /*
  *
  *Render
  *
  */

  render(){

    var {navigation} = this.props;

    if(this.state.fetchKontrol === true && this.addProfileAsync===0){
      this.addProfileAsync=1;
      this.storeData();
    }


    return(

        <Container>

            <Header
              style={styles.header}
              androidStatusBarColor="#c42846">

              <Body style={{marginLeft:20, }}>
                <Text style={styles.headerBodyText}>Sosyal Kampüs</Text>
              </Body>

              <Right>
                <TouchableOpacity
                  onPress={this.exit}
                >
                  <FontAwesome name="sign-out" size={30} color="#ffffff"/>
                </TouchableOpacity>


              </Right>

            </Header>


            <Content>

              {this.state.data.length !== 0 ?
                <View style={styles.contentBox}>

                  {this.state.data.map((value, k) => {
                    return(
                      <View key={k}>
                        <View style={{flexDirection:'row'}}>
                          <View style={{marginBottom:5}}>
                            <TouchableOpacity>
                              <Image
                                style={{width:Constants.MAX_WIDTH/3, height:150}}
                                resize="stretch"
                                source = {{uri: "http://192.168.1.104:8080" + value.Image}}
                              />
                            </TouchableOpacity>
                          </View>

                          <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}>
                          <View style={{marginLeft:5, flexDirection:'column'}}>

                            <View style={styles.dataView}>
                              <Text style={styles.text}>{value.Kullanici_Adi}</Text>
                            </View>

                            <View style={styles.dataView}>
                              <Text style={styles.responseText}>{value.Ad} {value.Soyad}</Text>
                            </View>


                            <View style={styles.dataView}>
                              <Text style={styles.responseText}>{value.Email}</Text>
                            </View>
                          </View>
                          </ScrollView>

                        </View>

                        <TouchableOpacity
                          style={styles.buttonView}
                          onPress={() => this.props.navigation.navigate("EditProfile", {onGoBack:this.refresh})}
                        >
                          <Text>Profili Düzenle</Text>
                        </TouchableOpacity>


                        <View style={{marginTop:10}}>
                          <View style={{flexDirection:'row', height:50, alignItems:'center', backgroundColor:'rgba(243,127,149, 0.5)'}}>
                            <View style={{justifyContent:'center'}}><Material name="settings" color="red" size={40} /></View>
                            <View style={{justifyContent:'center', marginLeft:10}}><Text style={{fontSize:16, fontWeight:'bold', textDecorationLine:'underline'}}>AYARLAR</Text></View>
                          </View>



                          <TouchableOpacity style={{flexDirection:'row', marginTop:10, height:40, alignItems:'center', backgroundColor:'rgba(243,127,149, 0.1)'}}
                            onPress = {() => this.props.navigation.navigate("MySubjects", {mail:this.state.mail})}
                          >
                            <View><Text style={{fontSize:16, fontWeight:'bold'}}>--------></Text></View>
                            <View style={{marginLeft:10}}><Text style={{fontSize:14, fontWeight:'bold'}}>KONULARIM</Text></View>
                          </TouchableOpacity>

                          <TouchableOpacity style={{flexDirection:'row', marginTop:10, height:40, alignItems:'center', backgroundColor:'rgba(243,127,149, 0.1)'}}
                            onPress = {() => this.props.navigation.navigate("Blocks", {mail:this.state.mail})}
                          >
                            <View><Text style={{fontSize:16, fontWeight:'bold'}}>--------></Text></View>
                            <View style={{marginLeft:10}}><Text style={{fontSize:14, fontWeight:'bold'}}>ENGELLEDİKLERİM</Text></View>
                          </TouchableOpacity>

                          <TouchableOpacity style={{flexDirection:'row', marginTop:10,marginBottom:60,height:40, alignItems:'center', backgroundColor:'rgba(243,127,149, 0.1)'}}
                            onPress = {() => this.props.navigation.navigate("Activities", {mail:this.state.mail})}
                          >
                            <View><Text style={{fontSize:16, fontWeight:'bold'}}>--------></Text></View>
                            <View style={{marginLeft:10}}><Text style={{fontSize:14, fontWeight:'bold'}}>OLUŞTURDUĞUM ETKİNLİKLER</Text></View>
                          </TouchableOpacity>

                        </View>

                      </View>
                      )
                    })
                  }



                </View>

                :

                null
              }



            </Content>




        </Container>

    );
  }
}

const styles = StyleSheet.create({
  buttonView:{
    alignItems:'center',
    justifyContent:'center',
    height:30, width:'100%',
    backgroundColor:'rgba(0,0,0,0.2)',
  },
  borderAccount:{
    flexDirection:'row',
    alignItems:'flex-start',
    marginTop:10,
  },
  container:{
    flex:1,
  },
  contentBox:{
    margin:10,
  },
  dataView:{
    marginTop:10,
  },
  header:{
    backgroundColor:'#c42846',
  },
  headerBodyText:{
    fontSize:20,
    fontWeight:"bold",
    fontFamily:'FFF_Tusj',
    color:'#ffffff',
  },
  textStyle:{
    fontSize:20,
    marginTop:5,
    marginBottom:5,
    marginLeft:5,
    fontWeight:'bold'
  },
  text:{
    fontSize:20,
    fontWeight:'bold',
    alignItems:'flex-start',
    color:'#c42846'
  },
  responseText:{
    fontSize:16,
    color:'rgba(0,0,0,0.5)',
  },

})


export default Profile;
