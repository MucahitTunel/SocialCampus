import React, {Component} from 'react';
import {View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  TextInput,
  DatePickerAndroid,
  Picker,
  Alert,
  BackHandler,
  YellowBox,
  ToastAndroid,
} from 'react-native';
import { Container, Button, Header, Body, Title, Right, Left, Footer, FooterTab, Content} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/AntDesign';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {asyncData} from '../components/asyncData';
import ImagePicker from 'react-native-image-picker';

import {get, url} from '../components/fetch';

YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])


class CreateSubject extends Component{





  constructor(props){
    super(props);

    this.getUrl = url();
    this.add = 0;

    this.state={
      mail:'',
      subject:'',
      length:0,
    }

    this.handleSubjectChange = this.handleSubjectChange.bind(this)
    this.back = this.back.bind(this)

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
    this.props.route.params.onGoBack(this.add);
    this.props.navigation.goBack();
    return true;
  }

  /*
  *DidMount içindeki işlemler
  */
  getMail(){
    asyncData()
      .then(response => {
        this.setState({
          mail:response[0],
        })
      })
  }



  handleSubjectChange = (v) => {

    var l = v.length;

    this.setState({
      subject: v,
      length:l,
    })
  }



  /*
  *Fetch işlemi
  */

  async fetchData(){

    if(this.state.subject !== ""){

      var formData = new FormData();

      formData.append("Email", this.state.mail)
      formData.append("Subject", this.state.subject)

      var url = this.getUrl + "Subjects/uploadSubject/"

      await fetch(url, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers:{
          'Content-Type': 'application/json',
        },
      }).then(response => response.json() )
        .then((response) => {
          const value = response.valueOf("message")
          if(value.message === "1"){
            this.add = 1;
            Alert.alert(
              'Kaydet',
              'Konu Başarıyla oluşturuldu',
              [
                {text: 'Tamam', onPress: () => this.props.navigation.goBack()}
              ],
              { cancelable: false }
            )
          }else {
            Alert.alert("Konu eklenirken hata oluştu");
          }
      }).catch(error =>  ToastAndroid.show(error, ToastAndroid.LONG));
    }else {
      Alert.alert("Konu boş bırakılamaz");
    }






  }




  render(){

    var {navigation} = this.props;

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

              <Right style={{marginRight:10}}>
                <Text style={styles.headerBodyText}>Konu Ekle</Text>
              </Right>
            </Header>



            <Content>
              <View style={styles.contentBox}>




                  {/*
                    *
                    *Adres oluşturma işlemi
                    *
                    */}

                  <View style={styles.inputDataBox}>
                    <View style={[styles.editInputBox, {flexDirection:'row'}]}>
                      <View style={{flex:1}}>
                        <Text style={styles.text}>Konu</Text>
                      </View>
                      <View style={{flex:1, alignItems:'flex-end'}}>
                        <Text style={{fontSize:16}}>{this.state.length}/100</Text>
                      </View>

                    </View>
                    <View style={styles.editInputBox}>
                      <TextInput
                        style={{height:50, borderWidth:1, fontSize:20}}
                        value = {this.state.subject}
                        onChangeText = {this.handleSubjectChange}
                        maxLength={100}
                      />
                    </View>
                  </View>




                    {/*
                      *
                      *Etkinlik Kaydetme Butonu
                      *
                      */}

                    <View style={{alignItems:'flex-end'}}>
                      <TouchableOpacity
                        style={{width:120, height:50, backgroundColor:'#c42846', alignItems:'center', justifyContent:'center'}}
                        onPress={this.fetchData.bind(this)}
                      >

                        <Text style={{fontSize:20, fontWeight:'bold', color:'#ffffff'}}>KAYDET</Text>

                      </TouchableOpacity>
                    </View>


              </View>
            </Content>



        </Container>

    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  contentBox:{
    margin:10,
  },
  inputDataBox:{
    flexDirection:'column',
    justifyContent:'center',
    marginTop:10,
  },
  editInputBox:{
    justifyContent:'center',
    margin:3,
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
    alignItems:'flex-start'
  }

})


export default CreateSubject;
