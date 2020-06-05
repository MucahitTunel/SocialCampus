
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

import { KeyboardAwareScrollView, KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

class MessageList extends Component{

  constructor(props){
    super(props);

    this.kontrol = false;
    this.fetch = false;

    this.getUrl = url();
    this.state = {
      mail:'',
      users:[],
      myId:null,
      key:[],
      lastMessage:[],
      myblocks:[],
      otherBlocks:[],
    }


  }

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
        console.log(response);
        this.setState({
          mail:response[0],
        })
        this.fetchGetId();
      })
  }

  /*
  *Kendi Id değerim
  */
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
        console.log("******************************************************");
        console.log(response);
        console.log(response.Block);
        this.setState({
          myId:response.Id[0].id,
          myblocks: response.Block,
        })

    }).catch(error => ToastAndroid.show(error, ToastAndroid.LONG) );
  }

  /*
  *Firebase veritabanından veriler alınıyor.
  *Son mesaj bu kısmda listeleniyor
  *Sender ve receiver değerlerine göre diziye ekleme yapılıyor
  */
  MessagesList = () => {
    console.log("11111111111111111111111111111111111111111111111111111");
    console.log(this.state.myId);
    console.log("11111111111111111111111111111111111111111111111111111");
    let mypersonId = this.state.myId;
    database()
    .ref('MessageRoom/'+this.state.myId+'/')
    .once('value')
    .then(snapshot => {

      let i = 0;
      var key = [];
      let userlength = 0;
      var persons=[];
      var lastMessage = [];

      console.log(snapshot.val());
      var data = snapshot.forEach(function(childSnaphot){
          //Data uzunluğu tutuluyor
          var uzunluk = childSnaphot.numChildren();
          let i = 0;
          var deger = childSnaphot.forEach(function(child){
            i+=1;
            //Mesaj gönderenin yada gönderilenin kim olduğu bilgisi alınıyor
            if(child.val().senderId === mypersonId){
              persons[userlength] = child.val().receiverId;
            }else {
              persons[userlength] = child.val().senderId;
            }
            //Son mesaja gelinmişse
            if(i === uzunluk){
              console.log("son mesaj")
              console.log(child.val().message);
              userlength+=1;
              lastMessage[userlength-1]=child.val().message;
              console.log(lastMessage);
            }

          })

      });

      this.setState({
        key:persons,
        lastMessage:lastMessage,
      })
    });

  }

  /*
  *Kullanıcıların verileri alınıyor
  */
  fetchUser = async () => {

    console.log("fetchuserrrrrrr");
    console.log(this.state.key);

    if(this.state.key.length > 0){
      this.fetch = true;
      var formData = new FormData()
      formData.append("Users", this.state.key)
      formData.append("Mail", this.state.mail)

      var url = this.getUrl + "Kullanicilar/getUsers/";

      await fetch(url, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers:{
          'Content-Type': 'application/json',
        },
      }).then(response => response.json() )
        .then((response) => {
          console.log(response);
          console.log(JSON.parse(response.Block));

          this.setState({
            users: response.Users,
            otherBlocks: JSON.parse(response.Block),
          })
      }).catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
    }else {
      console.log("Boşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşşş");
    }
  }

  /*
  *Mesajlaşılan kullanıcıyı silme işlemi
  */
  deleteAlert = (id) => {
    Alert.alert(
      "Sil",
      "Tüm mesajlar silinecek!?",
      [
        {text:"İPTAL", onPress: null},
        {text:"TAMAM", onPress: () => this.delete(id)},
      ],
      {cancelable:true}
    )
  }

  delete = async (id) => {
    var uid = this.state.myId;
    await database()
      .ref('/MessageRoom/'+uid+'/'+id+'/')
      .remove();

      await database()
        .ref('/MessageRoom/'+uid+'/'+id+'/')
        .remove();
  }





  render(){

    if(this.state.myId !== null && this.kontrol === false){
      this.MessagesList();
      this.kontrol = true;
    }

    if(this.state.key.length > 0 && this.fetch === false){
      this.fetchUser();
    }

    var sayac = 0;
    var dizi = [];
    this.state.myblocks.map((v, i) => {
      dizi[sayac] = v.Block_Id;
      sayac ++;
    })


    /*
    *
    *
    * Return
    *
    */

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
            <Text style={styles.headerBodyText}>Mesaj Kutusu</Text>
          </Right>

        </Header>

        <View style={{margin:10, flex:1}}>
          {this.state.users.map((v,i) => {

            var engel = false;
            for(let k = 0; k < dizi.length; k++){
              if(dizi[k] === v.id){
                engel=true;
              }
            }

            var karsiengel = false;
            this.state.otherBlocks.map((d,k) => {
              if(d.id === v.id && d.state === true){
                karsiengel = true;
              }
            })



            console.log(this.state.lastMessage[i]);
            return(

              <TouchableOpacity style={{flexDirection:'row', marginTop:10}}
                key={i}
                onPress={() => this.props.navigation.navigate("PrivateMessage", {id:v.id, username:v.Kullanici_Adi,mail:v.Email, image:v.Image, block:engel, karsiblock: karsiengel})}
                onLongPress={() => this.deleteAlert(v.id)}
              >
                <View style={{width:50, height:50, alignItems:'center', justifyContent:'center'}}>
                  <Image
                    style={{width:50,height:50,borderRadius:25}}
                    resize='stretch'
                    source={{uri:'http://192.168.1.104:8080' + v.Image}}
                  />
                </View>
                <View style={{flex:1, borderBottomWidth:1, justifyContent:'center', borderColor:'rgba(0,0,0,0.1)', paddingBottom:10}}>
                  <Text style={{fontWeight:'bold',marginLeft:20 ,fontSize:20}}>{v.Ad} {v.Soyad}</Text>
                  <Text style={{fontSize:16,marginLeft:20}}
                    numberOfLines={1}
                  >
                  {this.state.lastMessage[i]}
                  </Text>
                </View>

                {engel === true || karsiengel === true ?

                  <View>
                    <MaterialIcon name="block" size={30}/>
                  </View>

                  :

                  null
                }
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
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
  headerBodyText:{
    fontSize:16,
    fontWeight:"bold",
    fontFamily:'FFF_Tusj',
    color:'#ffffff',
  },


});

export default MessageList;
