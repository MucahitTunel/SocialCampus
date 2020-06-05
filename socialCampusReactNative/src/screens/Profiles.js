import React, {Component} from 'react';
import {View,ToastAndroid, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList, ScrollView, Image, TextInput, DatePickerAndroid,Picker, Alert, BackHandler} from 'react-native';
import { Container, Button, Header, Body, Title, Right, Left, Footer, FooterTab, Content} from 'native-base';


import Constants from '../../Constants';
import {get, url} from '../components/fetch';
import { YellowBox } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import {asyncData} from '../components/asyncData';


import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/AntDesign';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';



class Profiles extends Component{

  constructor(props){
    super(props);

    this.getUrl = url();
    this.id = this.props.route.params["id"]

    console.log(this.id);

    this.ara = false;
    this.fetch=false;

    this.state={
      mail : "",
      data:[],
      engel:"",
    }

  }//Constructor


  componentDidMount(){
    this.backHandler = BackHandler.addEventListener(
     "hardwareBackPress",
     this.back
   );
   this.getMail();

  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  back = () => {
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
  *Fetch işlemi
  */

  async fetchData(){

      var formData = new FormData();
      formData.append("id", this.id)
      formData.append("mail", this.state.mail)

      var url = this.getUrl + "Kullanicilar/get_profile/"

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
            data: response.Profile,
            engel: response.Engel,
          })
      }).catch(error =>  ToastAndroid.show(error, ToastAndroid.LONG));

  }


  /*
  *
  *Render
  *
  */

  render(){

    var {navigation} = this.props;

    if(this.state.mail !== "" && this.fetch === false){
      this.fetch = true;
      this.fetchData();
    }

    return(

        <Container>

            <Header
              style={styles.header}
              androidStatusBarColor="#c42846">

              <Left>
                  <TouchableOpacity
                    onPress={this.back}
                    style={{marginLeft:10, flex:1, justifyContent:'center'}}
                  >
                      <Icon name="md-arrow-back" color="#ffffff" size={30}/>
                  </TouchableOpacity>
              </Left>

              <Body style={{marginLeft:20, }}>
                <Text style={styles.headerBodyText}>Sosyal Kampüs</Text>
              </Body>


            </Header>


            <Content>

              {this.state.data.length !== 0 ?
                <View style={styles.contentBox}>

                  {this.state.data.map((value, k) => {
                    return(
                      <View key={k}>
                        <View style={{flexDirection:'row'}}>
                          <View style={{margin:5}}>
                            <TouchableOpacity>
                              <Image
                                style={{width:150, height:150}}
                                resize="stretch"
                                source = {{uri: "http://192.168.1.104:8080" + value.Image}}
                              />
                            </TouchableOpacity>
                          </View>

                          {this.state.engel === "True" ?

                              <View style={{marginLeft:5, flexDirection:'column'}}>

                                <View style={{marginTop:10}}>
                                  <Text style={styles.text}>{value.Kullanici_Adi}</Text>
                                </View>

                                <View style={{marginTop:10}}>
                                  <Text style={styles.responseText}>{value.Ad} {value.Soyad}</Text>
                                </View>
                              </View>

                            :

                            <View style={{marginLeft:5, flexDirection:'column'}}>

                              <View style={{marginTop:10}}>
                                <Text style={styles.text}>{value.Kullanici_Adi}</Text>
                              </View>

                              <View style={{marginTop:10}}>
                                <Text style={styles.responseText}>{value.Ad} {value.Soyad}</Text>
                              </View>


                              <View style={{marginTop:10}}>
                                <Text style={styles.responseText}>{value.Email}</Text>
                              </View>

                              <View>
                              {this.state.mail === value.Email ?
                                null
                                :
                                <TouchableOpacity style={{marginTop:10, flexDirection:'row', alignItems:'center', backgroundColor:'#f8b7b1'}}
                                  onPress = {() => this.props.navigation.navigate("PrivateMessage", {mail: value.Email, id: value.id, image: value.Image, username: value.Kullanici_Adi})}
                                >
                                  <View style={{justifyContent:'center', margin:5}}><Icons name="message1" size={30} /></View>
                                  <View style={{justifyContent:'center', marginLeft:5}}><Text style={{fontWeight:'bold'}}>Mesaj Yaz</Text></View>
                                </TouchableOpacity>
                              }
                              </View>

                            </View>
                          }

                        </View>

                        {this.state.engel === "True" ?

                        <View style={{marginTop:20, alignItems:'center', backgroundColor:'#4998c5'}}>
                          <Text style={{padding:10, fontSize:20, fontWeight:'bold'}}>Engel!!</Text>
                        </View>


                          :

                          null
                        }

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
  header:{
    backgroundColor:'#c42846',
  },
  headerBodyText:{
    fontSize:25,
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


export default Profiles;
