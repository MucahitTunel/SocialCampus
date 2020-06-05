
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
  BackHandler,
  Alert,
  ToastAndroid
} from 'react-native';
import { Container, Button, Header, Body, Title, Right, Left, Footer, FooterTab, Content} from 'native-base';
import Constants from '../../../Constants';
import {get, url} from '../../components/fetch';
import { YellowBox } from 'react-native'

import {getHomePageData} from '../../components/asyncData';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/AntDesign';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import AsyncStorage from '@react-native-community/async-storage';

class Activities extends Component{

  constructor(props){
    super(props);

    this.url = url();
    this.mail = this.props.route.params["mail"];
    this.state = {
      data:[],
    }
    this.data = 0;
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
    this.getData();
  }


  componentWillUnmount() {
    this.backHandler.remove();
  }


  back = () => {
    this.props.navigation.goBack();
    return true;
  }

  /*
  *State yönetimi bu kısmda yapıldı
  */
  getAsyncData = () => {
    getHomePageData()
      .then(response => {
        console.log(response);
        this.setState({
          data:JSON.parse(response)
        })
      })
  }

  /*
  *Veritabanından veri alma işlemi
  */
  getData(){
    var url = this.url + "Activities/myActivities/";
    var formData = new FormData();
    formData.append("mail", this.mail)

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers:{
        'Content-Type': 'application/json',
      },
    }).then(response => response.json() )
      .then((response) => {
        console.log(response);
        if(response.message){
          Alert.alert("hata")
          this.setState({
            data:[],
          })
        }else {

          this.setState({
            data:response,
          })
        }


      }).catch(error => console.error('Hata:', error));
  }


  /*
  *onGoback kontrolü
  */
  refresh = (v) =>{
    console.log("refresh");
    console.log(v);
    if(v === true){
        this.data=0;
        this.getData();
    }else {

    }
  }


  /*
  *
  *Render item
  *
  */

  renderItem = ({item}) => {


    return(
      <View>
        <TouchableOpacity
          style={styles.renderBoxButton}
          onPress ={() => this.props.navigation.navigate("Detail", {id: item.id, onGoBack: this.refresh})}
        >

          <View>
            <Image
              style={{width:120, height:150}}
              resize='stretch'
              source = {{uri: "http://192.168.1.104:8080" + item.Image}}
            />
          </View>

          <View style={{flexDirection:'column', marginLeft:10}}>

            <View style={{marginTop:5}}><Text style={{fontSize:16, fontWeight:'bold'}}>Tür               : {item.Type}</Text></View>
            <View style={{marginTop:5}}><Text style={{fontSize:16, fontWeight:'bold'}}>Tarih            : {item.Date}</Text></View>
            <View style={{marginTop:5}}><Text style={{fontSize:16, fontWeight:'bold'}}>Açıklama    : {item.Content}</Text></View>

          </View>

        </TouchableOpacity>
      </View>
    );
  }


  render(){

    return(


      <Container
        style={{marginBottom:5}}
      >
        <Header
          style={styles.header}
          androidStatusBarColor="#c42846"
          >

          <Body style={{marginLeft:20, }}>
            <Text style={styles.headerBodyText}>Sosyal Kampüs</Text>
          </Body>

          <Right>


            <TouchableOpacity
              onPress = {() => this.props.navigation.navigate("CreateActivity", {onGoBack: this.refresh})}
            >
              <Icon name="md-add-circle-outline" size={30} style={styles.icons}></Icon>
            </TouchableOpacity>

          {/*  <TouchableOpacity>
              <Icon name="md-options" size={30} style={styles.icons}></Icon>
            </TouchableOpacity>
          */}
          </Right>

        </Header>

        <View style={styles.container}>

            <FlatList
                data={this.state.data}
                renderItem={this.renderItem}
                keyExtractor={item=>item.id.toString()}
                onRefresh={this.flatlistRefresh}
                refreshing={this.state.refreshing}
            />

        </View>


      </Container>


    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginLeft:10,
    marginRight:10,
    marginTop:5,
    marginBottom:60,
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
    fontSize:25,
    fontWeight:"bold",
    fontFamily:'FFF_Tusj',
    color:'#ffffff',
  },

});

export default Activities;
