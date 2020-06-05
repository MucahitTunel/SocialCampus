import React, {Component} from 'react';
import {View, Text, StyleSheet, StatusBar, TextInput, ScrollView, TouchableOpacity, Alert, Image, ToastAndroid} from 'react-native';
import Constants from '../../Constants';
import LinearGradient from 'react-native-linear-gradient';
import {get, url} from '../components/fetch';
import ImagePicker from 'react-native-image-picker';


class Register extends Component{

  constructor(props){
    super(props);

    this.url = url();
    this.state = {
      email:"",
      password:"",
      passwordRetry:"",
      name:"",
      surname:"",
      username:"",
      imagePath:"",
      filePath:{},
    }

    this.onChangeEmailText = this.onChangeEmailText.bind(this);
    this.onChangePasswordText = this.onChangePasswordText.bind(this);
    this.onChangePasswordRetryText = this.onChangePasswordRetryText.bind(this);
    this.onChangeAdText = this.onChangeAdText.bind(this);
    this.onChangeSoyadText = this.onChangeSoyadText.bind(this);
    this.onChangeUsernameText = this.onChangeUsernameText.bind(this);
  }

  onChangeEmailText(value){
    this.setState({
      email:value,
    })
  }

  onChangePasswordText(value){
    this.setState({
      password:value,
    })
  }

  onChangePasswordRetryText(value){
    this.setState({
      passwordRetry:value,
    })
  }

  onChangeAdText(value){
    this.setState({
      name:value,
    })
  }

  onChangeSoyadText(value){
    this.setState({
      surname:value,
    })
  }

  onChangeUsernameText(value){
    this.setState({
      username:value,
    })
  }


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
      });

    }

  });//ImagePicker
}



  register = () =>{
    var url = this.url + 'Kullanicilar/kullanici_kayit/';
    //data.append('Sifre', this.state.Sifre)
    var email = this.state.email
    var password = this.state.password
    var passwordRetry = this.state.passwordRetry
    var name = this.state.name
    var surname = this.state.surname
    var username = this.state.username

    var uzunluk = email.length


    if(email !== '' && password !== '' && password.length > 7 && password.length<17 && password === passwordRetry && name !== '' && surname !== '' && email.substring(uzunluk-10, uzunluk) === '@gmail.com'){

      let picturepath = "file://"+this.state.filePath.path;
      let fileName = this.state.filePath.fileName;

      var values = new FormData()
      values.append("Email", this.state.email)
      values.append("Password", this.state.password)
      values.append("Username", this.state.username)
      values.append("Name", this.state.name)
      values.append("Surname", this.state.surname)
      values.append("Image", {uri:picturepath,name:fileName,  type:"image/jpeg"})

      fetch(url, {
        method: 'POST', // or 'PUT'
        body: values,
        headers:{
          'Accept':"application/json",
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => res.json())
      .then(response => {

        const answer = response.valueOf('message')

        if (answer.message === "1") {
          Alert.alert(
          "Kayıt",
          "Kaydınız başarıyla gerçekleştirildi"
          [
            {text:"Tamam", onPress: this.props.navigation.goBack()}
          ],
        )
        }else {
          Alert.alert("Bu Mail Adresi Zaten Kayıtlı");
        }
      })
      .catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
    }else {
      Alert.alert("Bilgilerinizi Kontrol Ediniz")

    }
  }

  render(){
    return(

      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={{alignItems:'flex-start'}}>
            <Text style={styles.buttonText}> Sosyal Kampüs</Text>
          </View>
        </View>

        <TouchableOpacity
            onPress={this.chooseFile.bind(this)}
            style={{alignItems:'center', marginTop:10}}
          >

          {this.state.imagePath === "" ?

              <Image
                style = {{width:150,height:150}}
                resize="stretch"
                source = {require("../img/empty.png")}
              />

            :

              <Image
                style = {{width:150,height:150}}
                resize="stretch"
                source = {{uri:this.state.filePath.uri}}
              />

          }



        </TouchableOpacity>


        <View style={styles.body}>

          <TextInput
            style={styles.inputText}
            onChangeText = {this.onChangeUsernameText}
            placeholder="Username"
            underlineColorAndroid="transparent"
            value={this.state.username}
          />

          <TextInput
            style={styles.inputText}
            onChangeText = {this.onChangeEmailText}
            placeholder="Email"
            underlineColorAndroid="transparent"
            textContentType="emailAddress"
            value={this.state.email}
          />

          <TextInput
            style={styles.inputText}
            onChangeText = {this.onChangePasswordText}
            placeholder="Password"
            secureTextEntry={true}
            underlineColorAndroid="transparent"
            textContentType="password"
            value={this.state.password}
          />

          <Text style={{fontSize:12, marginBottom:10}}><Text style={{color:'red', fontSize:12}}>Not:</Text> Şifreniz en az 8 en fazla 16 karakter içermelidir.</Text>

          <TextInput
            style={styles.inputText}
            onChangeText = {this.onChangePasswordRetryText}
            placeholder="Retry Password"
            secureTextEntry={true}
            underlineColorAndroid="transparent"
            textContentType="password"
            value={this.state.passwordRetry}
          />

          <TextInput
            style={styles.inputText}
            onChangeText = {this.onChangeAdText}
            underlineColorAndroid="transparent"
            placeholder= "Name"
            value={this.state.ad}
          />

          <TextInput
            style={styles.inputText}
            onChangeText = {this.onChangeSoyadText}
            placeholder="Surname"
            underlineColorAndroid="transparent"
            value={this.state.soyad}
          />



          <View style={styles.buttonBox}>
            <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.register}
              >
                <Text style={[styles.text,{fontWeight:'bold'}]}>KAYIT OL</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>


        <StatusBar backgroundColor="#c42846"/>
      </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  body:{
    margin:10,
    flex:1,
  },
  button:{
    width:150,
    height:50,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#60c0f6'
  },
  buttonBox:{
    alignItems:'flex-end',
    justifyContent:'center',
    height:50,
    width:Constants.MAX_WIDTH-20,
    marginTop:20,
  },
  buttonText: {
    fontSize: 30,
    fontFamily: "FFF_Tusj",
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  container:{
    flex:1,
    backgroundColor:'#ffffff'
  },
  header:{
    width: '100%',
    height: 55,
    backgroundColor:'#c42846'
  },
  inputText:{
    height:50,
    borderColor:'gray',
    borderWidth:1,
    marginTop: 5
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent:'center',
    alignItems:'center',
  },
})

export default Register;
