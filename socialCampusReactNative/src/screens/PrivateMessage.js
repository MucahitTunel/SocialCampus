
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  BackHandler,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ToastAndroid,
} from 'react-native';
import { Container, Button, Header, Body, Title, Right, Left, Footer, FooterTab, Content} from 'native-base';
import {get, url, post} from '../components/fetch';
import { YellowBox } from 'react-native'
import {asyncData} from '../components/asyncData';
import { randId } from '../components/utils';

import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/AntDesign';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';

import io from "socket.io-client";

import { KeyboardAwareScrollView, KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
])

class PrivateMessage extends Component{

  constructor(props){
    super(props);

    this.emitKontrol = false;

    this.id = this.props.route.params["id"];
    this.Email = this.props.route.params["mail"];
    this.username = this.props.route.params["username"];
    this.image = this.props.route.params["image"];
    this.block = this.props.route.params["block"];
    this.karsiblock = this.props.route.params["karsiblock"];


    if(this.karsiblock === true){
      Alert.alert("Kullanıcı tarafından engellendiniz")
    }


    this.kontrol = false;

    this.getUrl = url();
    this.state = {
      mail:'',
      message:"",
      commentData:[],
      subjectData:[],
      userData:[],
      dataNew:[],
      popularCommentList:[],
      fetch:0,
      msg:'',
      receiveMessages:[],
      myId:null,
      childs:[],
      conversation_id:"",
      status: "yazmıyor",
    }



    this.handleMessage = this.handleMessage.bind(this);
  }


  fetchGetId = () => {
    var url = this.getUrl + "Kullanicilar/getId/";
    var value = {mail:this.state.mail};

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(value),
      headers:{
        'Content-Type': 'application/json',
      },
    }).then(response => response.json() )
    .then((response) => {
      console.log(response);


      var my = response.Id[0].id.toString();
      var other = this.id.toString();
      var room = "";

      if(response.Id[0].id > this.id){
        room = "room"+other+my;
      }else {
        room = "room"+my+other;
      }

      this.socket.emit("subscribe", room);

      this.setState({
        myId:response.Id[0].id,
      })







    }).catch(error => ToastAndroid.show(error, ToastAndroid.LONG) );
  }


  /*
  *Mesajlaşılan kişiyle olan mesajlar
  */
  getMessages = () => {

    var id = this.state.myId;
    var otherId = this.id;
    this.kontrol = true;

    database()
      .ref('MessageRoom/'+id+'/'+otherId+'/')
      .orderByChild("id")
      .on('value', snapshot => {
        var child=[];
        let i = 0;
        var data = snapshot.forEach(function(childSnaphot){
          //var key = childSnaphot.key;
          var deger = childSnaphot.val();
          child[i] = deger;
          i++;

          console.log(deger);
          //console.log(key);
        });
        console.log(data);
        console.log(child);

        this.setState({
          receiveMessages: snapshot.val(),
          childs:child,
        })
        console.log('User data: ', snapshot.val());
      });
  }




  getMail(){
    asyncData()
      .then(response => {
        console.log(response);
        this.setState({
          mail:response[0],
        })
        this.fetchGetId();
      })
  }

  /*
  *
  *Component Did Mount
  *
  */

  componentDidMount(){
    this.backHandler = BackHandler.addEventListener(
     "hardwareBackPress",
     this.back
   );


   this.socket = io("http://192.168.1.104:3000",{transports: ['websocket'], upgrade: false});

   this.socket.on('conversation private post', data => {
     console.log(data);
     if(data.message === "yazıyor"){
       console.log("if");
       this.setState({
         status:data.message,
       })
     }
   });
    /*var url = "http://192.168.1.107:8080/Activities/get_data/";
    let data = get(url);
    data.then(response => {
      console.log(response);
      this.setState({
        data:response
      })
    })*/

      this.getMail();


    //this.fetchData();
  }



  componentWillUnmount() {
    this.backHandler.remove();

  }



  /*
  *
  * Comment Text Change
  *
  */

  handleMessage = (v) => {

    if(v.length > 0){
      if(this.emitKontrol === false){
        var my = this.state.myId.toString();
        var other = this.id.toString();
        var room = "";

        if(this.state.myId > this.id){
          room = "room"+other+my;
        }else {
          room = "room"+my+other;
        }

        var status = "yazıyor";
        this.socket.emit("send message", {
          room: room,
          message: status
        })

        this.emitKontrol=true;
      }
    }else {
        var my = this.state.myId.toString();
        var other = this.id.toString();
        var room = "";

        if(this.state.myId > this.id){
          room = "room"+other+my;
        }else {
          room = "room"+my+other;
        }

        var status = "yazmıyor";
        this.socket.emit("send message", {
          room: room,
          message: status
        })


        this.emitKontrol = false;
    }



    this.setState({
      message: v,
    })
  }


  /*
  *
  *Back Press
  *
  */
  back = () => {
    this.props.navigation.goBack();
    return true;
  }



  /*
  *
  *Block alert
  *
  */

  blockAlert = () => {
    Alert.alert(
      "Engelle",
      "Kullanıcıyı engellemek istediğinizden emin misiniz?",
      [
        {text:'Evet', onPress: this.Block},
        {text:'Hayır', onPress: null},
      ]
    )
  }

  /*
  *
  *Engelleme Fetch işlemi
  *
  */

  Block = async () => {
    var url = this.getUrl + "Kullanicilar/addBlocks/";
    var formData = new FormData();
    formData.append("Mail", this.state.mail);
    formData.append("Block_id", this.id)

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers:{
        'Content-Type': 'application/json',
      },
    }).then(response => response.json() )
      .then((response) => {

        if(response.message === "1"){
          Alert.alert("Engellendi");
        }else {
          Alert.alert("Engellenemedi");
        }

    }).catch(error =>  ToastAndroid.show(error, ToastAndroid.LONG));
  }

  /*
  *Yeni mesaj gönderme
  */
  send = () => {
    var message = this.state.message;
    var childId = randId();
    var textId = randId();
    var senderId = this.state.myId;
    var receiverId = this.id;

    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes


    var tarih = date + '/' + month + '/' + year + ' ' + hours + ':' + min;

    var id = this.state.childs.length;
    console.log(id);



    this.setState({
      message:"",
    })

    database().ref('MessageRoom/'+this.state.myId+'/'+this.id+'/'+childId+'/').set({
      id,
        senderId,
        receiverId,
        textId,
        message: message,
        date:tarih,
      }).then((data)=>{
          //success callback
          console.log('data ' , data)
      }).catch((error)=>{
          //error callback
          console.log('error ' , error)
      })


    database().ref('MessageRoom/'+this.id+'/'+this.state.myId+'/'+childId+'/').set({
      id,
        senderId,
        receiverId,
        textId,
        message: message,
        date:tarih,
      }).then((data)=>{
          //success callback
          console.log("burası");
          console.log('data ' , data)
      }).catch((error)=>{
          //error callback
          console.log('error ' , error)
      })
  }





  render(){

    console.log(this.state.status);

    if(this.state.myId !== null && this.kontrol === false){
      this.getMessages();
    }




    /*
    *
    *
    * Return
    *
    */

    if(this.block === true || this.karsiblock === true){
      return(

        <View style={{flex:1}}>

          <StatusBar hidden={false} backgroundColor="#c42846"/>
          <Header
            style={styles.header}
            androidStatusBarColor="#c42846"
            >

            <Left>
                <TouchableOpacity
                  onPress={this.back}
                  style={{marginLeft:10, flex:1, justifyContent:'center'}}
                >
                  <Icon name="md-arrow-back" color="#ffffff" size={30}/>
              </TouchableOpacity>
            </Left>


            <Body>
              {this.state.status === true ?
                <Text>Yazıyor...</Text>

                :

                null
              }
            </Body>

            <Right style={{marginRight:20, }}>
              <View style={{flexDirection:'row'}}>
                <View>
                  <Text style={styles.headerBodyText}>Yorumlar</Text>
                </View>
              </View>

            </Right>

          </Header>

          <KeyboardAvoidingView
            style={{ flex: 1, flexDirection: 'column',justifyContent: 'center', backgroundColor:'#ebebeb'}} behavior="height" enabled   keyboardVerticalOffset={30}
            >



            <ScrollView>


              {this.state.receiveMessages !== "" ?

                <View>
                  {this.state.childs.map((v,i) => {

                    return(
                      <View key={i}>
                        {v.senderId === this.state.myId ?
                          <View style={{alignItems:'flex-end'}}>
                            <View
                              style={{alignItems:'flex-start', margin:3,backgroundColor:'#94ed8b', borderRadius:10}}
                            >
                              <Text style={{fontSize:18, borderRadius:10, marginLeft:5, marginRight:20, marginTop:5, marginBottom:5}}>{v.message}</Text>
                              <Text style={{fontSize:8, borderRadius:10, marginLeft:5, marginRight:20, marginTop:5, marginBottom:5, alignItems:'flex-end'}}>{v.date}</Text>
                            </View>
                          </View>
                          :
                          <View style={{alignItems:'flex-start'}}>
                            <View
                              style={{alignItems:'flex-start', margin:3, backgroundColor:'#ffffff', borderRadius:10}}
                            >
                              <Text style={{fontSize:18, borderRadius:10, marginLeft:5, marginRight:20, marginTop:5, marginBottom:5}}>{v.message}</Text>
                                <Text style={{fontSize:8, borderRadius:10, marginLeft:5, marginRight:20, marginTop:5, marginBottom:5, alignItems:'flex-end'}}>{v.date}</Text>
                            </View>
                          </View>

                        }

                      </View>
                    );
                  })}
                </View>
                :
                null
              }



            </ScrollView>


          </KeyboardAvoidingView>

        </View>
      );
    }else {
      return(

        <View style={{flex:1}}>

          <StatusBar hidden={false} backgroundColor="#c42846"/>
          <Header
            style={styles.header}
            androidStatusBarColor="#c42846"
            >

            <Left>
                <TouchableOpacity
                  onPress={this.back}
                  style={{marginLeft:10, flex:1, justifyContent:'center'}}
                >
                  <Icon name="md-arrow-back" color="#ffffff" size={30}/>
              </TouchableOpacity>
            </Left>

            <Right style={{marginRight:20, }}>
              <View style={{flexDirection:'row'}}>
                <View>
                  <Text style={styles.headerBodyText}>Yorumlar</Text>
                </View>
                <TouchableOpacity style={{marginLeft:10}}
                  onPress={this.blockAlert}
                >
                  <MaterialIcon name="block" size={30} color="#ffffff" />
                </TouchableOpacity>
              </View>

            </Right>

          </Header>

          <KeyboardAvoidingView
            style={{ flex: 1, flexDirection: 'column',justifyContent: 'center', backgroundColor:'#ebebeb'}} behavior="height" enabled   keyboardVerticalOffset={30}
            >



            <ScrollView>


              {this.state.receiveMessages !== "" ?

                <View>
                  {this.state.childs.map((v,i) => {

                    return(
                      <View key={i}>
                        {v.senderId === this.state.myId ?
                          <View style={{alignItems:'flex-end'}}>
                            <View
                              style={{alignItems:'flex-start', margin:3,backgroundColor:'#94ed8b', borderRadius:10}}
                            >
                              <Text style={{fontSize:18, borderRadius:10, marginLeft:5, marginRight:20, marginTop:5, marginBottom:5}}>{v.message}</Text>
                              <Text style={{fontSize:8, borderRadius:10, marginLeft:5, marginRight:20, marginTop:5, marginBottom:5, alignItems:'flex-end'}}>{v.date}</Text>
                            </View>
                          </View>
                          :
                          <View style={{alignItems:'flex-start'}}>
                            <View
                              style={{alignItems:'flex-start', margin:3, backgroundColor:'#ffffff', borderRadius:10}}
                            >
                              <Text style={{fontSize:18, borderRadius:10, marginLeft:5, marginRight:20, marginTop:5, marginBottom:5}}>{v.message}</Text>
                                <Text style={{fontSize:8, borderRadius:10, marginLeft:5, marginRight:20, marginTop:5, marginBottom:5, alignItems:'flex-end'}}>{v.date}</Text>
                            </View>
                          </View>

                        }

                      </View>
                    );
                  })}
                </View>
                :
                null
              }



            </ScrollView>

            <View style={{flexDirection:'row', height:50, marginLeft:5, justifyContent:'center', marginTop:10}}>
              <View style={{flex:3, justifyContent:'center'}}>
                <TextInput
                  style={{borderRadius:30, borderWidth:1, marginLeft:5, marginBottom:5}}
                  value={this.state.message}
                  onChangeText={this.handleMessage}
                />
              </View>
              <TouchableOpacity
                style={{justifyContent:'center', marginLeft:5, marginRight:5, borderWidth:1, borderRadius:30, width:45, height:45, alignItems:'center', backgroundColor:'#c42846'}}
                onPress={this.send}
                >
                <MaterialIcon name="send" size={35} color="#ffffff"/>
              </TouchableOpacity>
            </View>

          </KeyboardAvoidingView>

        </View>
      );
    }


  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,

  },
  commentText:{
    fontSize:20,
    fontWeight:'bold',
  },
  commentViewBox:{
    flexDirection:'column',
    borderBottomWidth:2,
    borderColor:'#c42846',
  },
  likeColumn:{
    flexDirection:'row',
  },
  renderBoxButton:{
    marginTop:5,
    marginBottom:5,
    flexDirection:'row',
    borderWidth:1,
    borderColor:'#c42846',
  },
  header:{
    backgroundColor:'#c42846',
  },
  icons:{
    marginLeft:15,
    color:'#ffffff'
  },
  footerIcons:{
    color:'#ffffff',
  },
  footerText:{
    color:'#ffffff',
  },
  headerBodyText:{
    fontSize:20,
    fontWeight:"bold",
    fontFamily:'FFF_Tusj',
    color:'#ffffff',
  },
  input: {
  flexDirection: 'row',
  alignSelf: 'flex-end',
  padding: 10,
  height: 40,
  width: 300,
  backgroundColor: '#fff',
  margin: 10,
  shadowColor: '#3d3d3d',
  shadowRadius: 2,
  shadowOpacity: 0.5,
}

});

export default PrivateMessage;
