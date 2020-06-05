import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
  YellowBox,
  ToastAndroid,
  BackHandler,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { CheckBox } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-community/async-storage';

import Constants from "../../Constants";
import {get, url} from '../components/fetch';


YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

class Login extends Component{

  constructor(props){
    super(props);

    this.url = url();
    this.state = {
      email: "",
      password: "",
      checkbox:false,
      asyncKontrol: true,
    }


    this.onChangeEmailText = this.onChangeEmailText.bind(this);
    this.onChangePasswordText = this.onChangePasswordText.bind(this);
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
    if(this.props.navigation.state.routeName === "Login"){
      BackHandler.exitApp();
    }
    return true;
  }



  componentDidMount(){
    this.getData();
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

  /*
  *Asycstorage'den veriler çekiliyor.
  *Beni hatırla seçeneğinin aktif olup olmadığı kontrol ediliyopr.
  */
  getData = async () => {
    try {
      const mail = await AsyncStorage.getItem('@eMail')
      const password = await AsyncStorage.getItem('@password')
      const beniHatirla = await AsyncStorage.getItem('@beniHatirla')


      if(mail !== null && password !== null && beniHatirla !== null) {

        if(beniHatirla === "0"){
          this.setState({
            asyncKontrol:false,
          })
        }else {
          this.setState({
            email:mail,
            password: password,
            checkbox:true,
          })
          this.Login();
        }

      }else {
        this.setState({
          asyncKontrol:false,
        })
      }
    } catch(e) {
      // error reading value
    }
  }


  /*
  *Beni hatırla seçeneği açıksa tekrar tekrar giriş yapma gereksinimi duyulmayacak
  *Açık değilse veriler burada duracak. Çıkınca silinecek
  */
  storeData = async () => {

    if(this.state.checkbox === true){
      try {
        await AsyncStorage.setItem('@beniHatirla', '1');
        await AsyncStorage.setItem('@eMail', this.state.email);
        await AsyncStorage.setItem('@password', this.state.password )
      } catch (e) {
        // saving error
      }
    }else {
      await AsyncStorage.setItem('@beniHatirla', '0');
      await AsyncStorage.setItem('@eMail', this.state.email);
      await AsyncStorage.setItem('@password', this.state.password )
    }
  }


  /*
  *Kullanıcı adı ve şifre ile veritabanı işlemi
  */
  Login = () =>{

    var url = this.url + 'Kullanicilar/kullanicilar/';
    //data.append('Sifre', this.state.Sifre)
    var email = this.state.email
    var password = this.state.password



    if(email !== '' && password !== '' && password.length > 7){
      var values = new FormData()
      values.append("Email", this.state.email)
      values.append("Password", this.state.password)

      fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(values), // data can be `string` or {object}!
        //body: data.toString(),
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .then(response => {

        const answer = response.valueOf('message')

        if (answer.message === "1") {
          this.storeData();
          this.setState({
            asyncKontrol:false,
          })
          this.props.navigation.navigate('Home');
        }else {
          Alert.alert("Mail veya şifre hatalı")
          this.setState({
            asyncKontrol:false,

          })
          /*this.setState({
            password:'',
          })*/
        }
      })
      .catch(error =>ToastAndroid.show(error, ToastAndroid.LONG));
    }else {
      Alert.alert("Dikkat");
    }
  }


  render(){
    if(this.state.asyncKontrol === false){
      return(
        <View style={styles.container}>

          <View style={styles.header}>
            <View style={{alignItems:'flex-start'}}>
              <Text style={styles.buttonText}> Sosyal Kampüs</Text>
            </View>
          </View>

          <View style={styles.body}>

            <TextInput
              style={styles.inputText}
              onChangeText = {this.onChangeEmailText}
              placeholder="Email"
              underlineColorAndroid="transparent"
              textContentType="emailAddress"
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

            <View style={styles.checkBox}>
              <View style={{flexDirection:'row', alignItems:'center', flex:1}}>

                {this.state.checkbox === true ?

                  <Icon.Button name="checkbox-active" backgroundColor="#ffffff" size={30} color="#900"  onPress={() => {this.setState({checkbox:!this.state.checkbox})}} />

                  :

                  <Icon.Button name="checkbox-passive" backgroundColor="#ffffff" size={30} color="#900"  onPress={() => {this.setState({checkbox:!this.state.checkbox})}} />
                }
                <Text style={styles.text}>Beni Hatırla</Text>

              </View>

              <View style={{ alignItems:'flex-end', flex:1 }}>
                <Text style={[styles.text,{color:'#4998c5',textDecorationLine:'underline'}]} onPress={()=>{this.props.navigation.navigate("ForgetPassword")}}>Şifremi Unuttum</Text>
              </View>
            </View>

            <View style={styles.buttonBox}>
              <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.Login}
                >
                  <Text style={[styles.text,{fontWeight:'bold'}]}>GİRİŞ</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.register}>
              <Text>Kayıt olmak için burayı <Text style={{color:'#4998c5', textDecorationLine:'underline'}} onPress={()=>{this.props.navigation.navigate("Register")}}>tıklayınız</Text></Text>
            </View>

          </View>

          <StatusBar backgroundColor="#c42846"/>
        </View>

      );
    }else {
      return(

          <View>
            <StatusBar backgroundColor="#c42846"/>
          </View>
      );
    }
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

export default Login;
