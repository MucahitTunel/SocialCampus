
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

    this.yazarkontrol = 0;

    this.connectKontrol = 0;
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
      status: 'yazmıyor',
      aaa:false,
      connect: true,
      room:'',
      sayac:0,
      blocked: this.block,
      karsiblocked: this.karsiblock,
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


      this.setState({
        room: room,
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

        });


        this.setState({
          receiveMessages: snapshot.val(),
          childs:child,
        })

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
    this.socket = io("http://192.168.1.104:3000");

    this.socket.on('bagli', data => {
      console.log(data);
      this.setState({
        connect: true,
      })
    });


    this.socket.on('mesagedurum', (data) => {
      console.log("**************************************");
      console.log(data);

      this.setState({
        status: data.message,
      })
    });

    this.getMail();




    this.backHandler = BackHandler.addEventListener(
     "hardwareBackPress",
     this.back
   );



  }

  componentWillUnmount() {
    this.backHandler.remove();
    this.socket.close();
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
        this.yazarkontrol = 1;

        var status = "yazıyor";
        this.socket.emit("send message", {
          room: this.state.room,
          message: status
        })

        this.emitKontrol=true;
      }
    }else {
        var my = this.state.myId.toString();
        var other = this.id.toString();
        this.yazarkontrol = 0;

        var status = "yazmıyor";
        this.socket.emit("send message", {
          room: this.state.room,
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
    var sonuc = false;
    if (this.block === false && this.state.blocked === true) {
      sonuc = true;
      this.props.route.params.onGoBack(sonuc);
    }else {
      this.props.route.params.onGoBack(sonuc);
    }

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
          this.setState({
            blocked: true,
          })
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
    this.yazarkontrol = 0;
    var id = this.state.childs.length;
    console.log(id);





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

      this.setState({
        message:"",
      })

      var status = "yazmıyor";
      this.socket.emit("send message", {
        room: this.state.room,
        message: status
      })
  }





  render(){

    console.log(this.state.status);
    console.log(this.state.sayac);

    if(this.state.connect === true && this.connectKontrol === 0 && this.state.room !== ''){
      this.socket.emit("subscribe", this.state.room);
      this.connectKontrol=1;
    }


    if(this.state.myId !== null && this.kontrol === false){
      this.getMessages();
    }




    /*
    *
    *
    * Return
    *
    */

    if(this.state.blocked === true || this.state.karsiblocked === true){
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

            <Right>
              <Text style={styles.headerBodyText}>Engel</Text>
            </Right>

          </Header>

          <KeyboardAvoidingView
            style={{ flex: 1, flexDirection: 'column',justifyContent: 'center', backgroundColor:'#ebebeb'}} behavior="height" enabled   keyboardVerticalOffset={30}
            >



            <ScrollView
              ref={ref => {this.scrollView = ref}}
              onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
            >


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

            <Body>

              <View style={{flexDirection:'row'}}>
                <Image
                  style={{width:50, height:50, borderRadius:25}}
                  source={{uri:'http://192.168.1.104:8080' + this.image}}
                />

                <View style={{flexDirection:'column'}}>
                  <View>
                    <Text style={{fontSize:16, color:'#fff', marginLeft:10}}>{this.username}</Text>
                  </View>

                  <View>
                    {this.state.status === "yazıyor" && this.yazarkontrol === 0 ?

                      <Text style={{fontSize:12,color:'#fff', marginLeft:10}}>Yazıyor...</Text>

                      :

                      null
                    }
                  </View>
                </View>
              </View>


            </Body>

            <Right style={{marginRight:20, }}>

                <TouchableOpacity style={{marginLeft:10}}
                  onPress={this.blockAlert}
                >
                  <MaterialIcon name="block" size={30} color="#ffffff" />
                </TouchableOpacity>

            </Right>

          </Header>

          <KeyboardAvoidingView
            style={{ flex: 1, flexDirection: 'column',justifyContent: 'center', backgroundColor:'#ebebeb'}} behavior="height" enabled   keyboardVerticalOffset={30}
            >



            <ScrollView
              ref={ref => {this.scrollView = ref}}
              onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
            >


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
