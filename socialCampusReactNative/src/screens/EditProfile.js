import React, {Component} from 'react';
import {View,ToastAndroid, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList, ScrollView, Image, TextInput, DatePickerAndroid,Picker, Alert, BackHandler} from 'react-native';
import { Container, Button, Header, Body, Title, Right, Left, Footer, FooterTab, Content} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/AntDesign';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {asyncData} from '../components/asyncData';
import ImagePicker from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {get, url} from '../components/fetch';



class EditProfile extends Component{

  constructor(props){
    super(props);

    this.getUrl = url();

    this.isEdit=false;
    this.isImageChange=false;

    this.state={
      mail:'',
      data:[],
      Username:'',
      Ad:'',
      Soyad:'',
      Image:'',
      imagePath:"",
      filePath:{},
      ImageChange:false,
      UsernameChange:false,
      kullaniciAdi:'',
    }

    this.handleChangeUsername = this.handleChangeUsername.bind(this);



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
    this.props.route.params.onGoBack(this.isEdit);
    this.props.navigation.goBack();
    return true;
  }


  /*
  *Kullanıcı adı güncelleme
  */
  handleChangeUsername = (v) => {

    console.log("************************");
    console.log(v);
    console.log(this.state.kullaniciAdi);
    console.log("************************");

    if(v === this.state.kullaniciAdi){

      this.setState({
        Username: v,
        UsernameChange: false,
      })
    }else {

      this.setState({
        Username: v,
        UsernameChange: true,
      })
    }


  }





  getMail(){
    asyncData()
      .then(response => {
        this.setState({
          mail:response[0],
        })
        this.fetchData();
      })
  }

  /*
  *Resim değiştirme
  */
  chooseFile = () => {
  var options = {
    title: 'Select Image',
    customButtons: [
      { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
    ],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  ImagePicker.showImagePicker(options, response => {

    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
      alert(response.customButton);
    } else {
      let source = response;
      // You can also display the image using data:
      // let source = { uri: 'data:image/jpeg;base64,' + response.data };


      this.setState({
        imagePath: source.path,
        filePath: source,
        ImageChange: true,
      });

    }

  });//ImagePicker
}


/*
*Verileri güncelleme
*/
  updateFetch = async () => {

    var url = this.getUrl + 'Kullanicilar/updateProfile/';

    let picturepath = "file://"+this.state.filePath.path;
    let fileName = this.state.filePath.fileName;

    var values = new FormData()
    values.append("Email", this.state.mail)

    /*
    *Kullanıcı adının değişip değişmediği bilgisi
    */
    if(this.state.UsernameChange === true){
      values.append("UsernameControl",1);
      values.append("Username", this.state.Username)
    }else {
      values.append("UsernameControl",0);
    }

    /*
    *Resmin değişip değişmediği bilgisi
    */
    if(this.state.ImageChange === true){
      values.append("ImageControl",1);
      values.append("Image", {uri:picturepath,name:fileName,  type:"image/jpeg"});
    }else {
      values.append("ImageControl",0);
    }

    console.log(values);

    await fetch(url, {
      method: 'POST', // or 'PUT'
      body: values,
      headers:{
        'Accept':"application/json",
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.json())
    .then(response => {

      const answer = response.valueOf('message')

      if (answer.message === "0") {
        this.isEdit=true;
        Alert.alert(
        "Güncelleme",
        "Güncellemeniz başarıyla gerçekleştirildi",
        [
          {text:"Tamam", onPress: ()=>this.back()}
        ],
      )
    }else if (answer.message === "Kullanıcı Adı Kullanılmakta") {
      Alert.alert("Kullanıcı adı kullanılıyor")
    }else {
        Alert.alert("Hata oluştu");
      }
    })
    .catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
  }





  /*
  *Fetch işlemi
  */

  async fetchData(){

      var url = this.getUrl + "Kullanicilar/profile/";
      var formData = new FormData();
      formData.append("Mail", this.state.mail)

      await fetch(url, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers:{
          'Content-Type': 'application/json',
        },
      }).then(response => response.json() )
        .then((response) => {

          console.log(response);
          response.map((value) => {
            this.setState({
              Username: value.Kullanici_Adi,
              Ad: value.Ad,
              Soyad:value.Soyad,
              Image:value.Image,
              kullaniciAdi: value.Kullanici_Adi,
            })
          })


      }).catch(error => ToastAndroid.show(error, ToastAndroid.LONG) );
    }




  deleteProfile = () => {
    Alert.alert(
      "Profil Sil",
      "Profilinizi silmek istediğinizden emin misiniz?",
      [
        {text: "Evet", onPress: this.onay},
        {text: "İptal", onPress: null},
      ]
    )
  }

  onay = () => {
    Alert.alert(
      "Silme işlemini onaylıyor musunuz?",
      "Tüm verileriniz silinecektir!!!",
      [
        {text: "Evet", onPress: this.delete},
        {text: "İptal", onPress: null},
      ]
    )
  }

  delete = async () => {
    console.log("delete");
    var url = this.getUrl + "Kullanicilar/deleteUser/";
    var formData = new FormData();
    formData.append("Mail", this.state.mail)

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers:{
        'Content-Type': 'application/json',
      },
    }).then(response => response.json() )
      .then((response) => {
        console.log(response);
        var deger = response.valueOf('message')
        if(deger.message === "1"){
          Alert.alert("Profiliniz silindi")
          this.props.navigation.navigate("Login")
        }else {
          Alert.alert("Hata oluştu");
        }


    }).catch(error => ToastAndroid.show(error, ToastAndroid.LONG) );
  }



  render(){

    var {navigation} = this.props;

    console.log(this.state.Username);

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
                    onPress={() => {this.props.navigation.goBack()}}
                    style={{marginLeft:10, flex:1, justifyContent:'center'}}
                  >
                    <Icon name="md-arrow-back" color="#ffffff" size={30}/>
                </TouchableOpacity>
                </Left>

                <Right style={{marginRight:10}}>
                  <Text style={styles.headerBodyText}>Sosyal Kampüs</Text>

                  <TouchableOpacity style={{marginLeft:15}}
                    onPress={this.deleteProfile}
                  >
                    <Material name="delete" size={25} color="#ffffff" />
                  </TouchableOpacity>
                </Right>
              </Header>

              <View style={{flex:1}}>

              <KeyboardAwareScrollView
                style={{margin:10, backgroundColor:'#ffffff'}}
                enableOnAndroid={true}
                enableAutomaticScroll
                extraScrollHeight={50}
              >
                  {this.state.username !== "" ?

                      <View>

                          <View style={{alignItems:'center'}}>
                            {this.state.ImageChange === false ?
                              <Image
                                style={{height:120, width:120, borderRadius:60}}
                                resize='stretch'
                                source={{uri: 'http://192.168.1.104:8080' + this.state.Image}}
                              />

                              :

                              <Image
                                style={{height:120, width:120, borderRadius:60}}
                                resize='stretch'
                                source={{uri: this.state.filePath.uri}}
                              />
                            }

                            <TouchableOpacity
                              onPress={this.chooseFile}
                            >
                              <Text style={{marginTop:10, color:'#4998c5', textDecorationLine:'underline', fontSize:16}}>Profil resmini değiştir</Text>
                            </TouchableOpacity>

                          </View>

                          <View style={{marginTop:10}}>
                            <Text style={{fontSize:12, color:'rgba(0,0,0,0.3)'}}>Kullanıcı Adı</Text>
                            <TextInput
                              style={{borderBottomWidth:1}}
                              value={this.state.Username}
                              onChangeText={this.handleChangeUsername}
                              />
                          </View>


                          {this.state.ImageChange === true || this.state.UsernameChange === true ?
                            <View style={{alignItems:'flex-end', marginTop:10}}>
                              <TouchableOpacity
                                style={{width:100, height:50, backgroundColor:'#c42846', alignItems:'center', justifyContent:'center'}}
                                onPress={this.updateFetch}
                              >
                                <Text style={{fontSize:22, color:'#ffffff', fontWeight:'bold'}}>Güncelle</Text>
                              </TouchableOpacity>
                            </View>

                            :

                            <View style={{alignItems:'flex-end', marginTop:10}} >
                              <TouchableOpacity
                              disabled={true}
                                style={{width:100, height:50, backgroundColor:'rgba(206,8,39,0.5)', alignItems:'center', justifyContent:'center'}}
                                onPress={this.updateFetch}
                              >
                                <Text style={{fontSize:22, color:'#ffffff', fontWeight:'bold'}}>Güncelle</Text>
                              </TouchableOpacity>
                            </View>
                          }


                      </View>

                      :

                      null
                  }
                </KeyboardAwareScrollView>

              </View>



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


export default EditProfile;
