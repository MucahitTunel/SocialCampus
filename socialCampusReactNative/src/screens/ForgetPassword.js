import React, {Component} from 'react';
import {View, Text, StyleSheet, StatusBar, TextInput, TouchableOpacity, Alert, ToastAndroid} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {get, url} from '../components/fetch';

class ForgetPassword extends Component{

  constructor(props){
    super(props);

    this.url = url();
    this.state = {
      email: '',
    }

    this.onChangeEmailText = this.onChangeEmailText.bind(this);
  }

  /*
  *şifremi unuttum fetch işlemi
  */
  Forget = () =>{
    var url = this.url + 'Kullanicilar/sifremi_unuttum/';
    //data.append('Sifre', this.state.Sifre)
    var email = this.state.email
    var uzunluk = email.length


    if(email !== '' && email.substring(uzunluk-10, uzunluk) === '@gmail.com'){
      var value = {Mail: this.state.email};


      fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(value), // data can be `string` or {object}!
        //body: data.toString(),
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .then(response => {

        const answer = response.valueOf('message')

        if (answer.message === "1") {
          Alert.alert("Şifreniz yenilendi. Mail adresinizi kontrol ediniz.")
        }else if(answer.message === "-1"){
          Alert.alert("Mail adresi sistemde bulunmamaktadır.")
        }else {
          Alert.alert("Şifreniz değiştirilemedi");
        }
      })
      .catch(error =>  ToastAndroid.show(error, ToastAndroid.LONG));
    }else {
      Alert.alert("Bilgilerinizi Kontrol Ediniz")
    }
  }


  onChangeEmailText(value){
    this.setState({
      email:value,
    })
  }

  render(){
    return(

      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{alignItems:'flex-start'}}>
            <Text style={styles.buttonText}> Sosyal Kampüs</Text>
          </View>
        </View>

        <View style={styles.body}>

          <View style={{alignItems:'center'}}>
            <Text style={{fontWeight:'bold'}}>Yeni şifreniz mail adresinize gönderilecektir.</Text>
          </View>

          <TextInput
            style={styles.inputText}
            onChangeText = {this.onChangeEmailText}
            placeholder="Email"
            underlineColorAndroid="transparent"
            textContentType="emailAddress"
            value={this.state.email}
          />

          <View style={styles.buttonBox}>
            <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.Forget}
              >
                <Text style={[styles.text,{fontWeight:'bold'}]}>GÖNDER</Text>
              </TouchableOpacity>
            </View>
          </View>


        </View>

        <StatusBar backgroundColor="#c42846"/>
      </View>

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
  checkBox:{
    height:30,
    flexDirection:'row',
    marginTop:10
  },
  container:{
    flex:1,
    backgroundColor:"#ffffff"
  },
  header:{
    width: '100%',
    height: 55,
    backgroundColor:'#c42846',
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
  register:{
    marginTop:30,
    alignItems:'center',
    justifyContent:'center',
  },
  text:{
    fontSize:16,
  }
})


export default ForgetPassword;
