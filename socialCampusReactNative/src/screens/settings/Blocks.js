
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

class Blocks extends Component{

  constructor(props){
    super(props);

    this.url = url();
    this.mail = this.props.route.params["mail"];
    console.log("*******************");
    console.log(this.mail);

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
  *Veritabanından veri alma işlemi
  */
  getData = () => {
    var url = this.url + "Kullanicilar/myBlocks/";
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
        this.setState({
          data:response
        })

    }).catch(error => console.error('Hata:', error));
  }



  /*
  *
  * Engelleme iptali alert mesajı
  *
  */

  ignoreBlockAlert = (id) =>{
    Alert.alert(
      "Engel",
      "Engeli kaldırmak istiyor musunuz?",
      [
        {text: "Evet", onPress: () => this.ignoreBlock(id)},
        {text: "Hayır", onPress: null},
      ]
    )
  }


  ignoreBlock = (id) => {
    var url = this.url + "Kullanicilar/ignoreBlock/";
    var formData = new FormData();
    formData.append("mail", this.mail)
    formData.append("id", id)


    fetch(url, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers:{
        'Content-Type': 'application/json',
      },
    }).then(response => response.json() )
      .then((response) => {

        if(response.message === "1"){
          Alert.alert("Engel kaldırıldı")
        }else {
          Alert.alert("Hata Oluştu")
        }

        console.log(response);
        this.setState({
          data:response.data,
        })
      }).catch(error => console.error('Hata:', error));
}


  /*
  *
  *Render item
  *
  */

  renderItem = ({item}) => {


    return(

        <TouchableOpacity
          style={styles.renderBoxButton}
          onLongPress={() => this.ignoreBlockAlert(item.id)}
        >

        <View>
          <Image
            source={{uri:"http://192.168.1.104:8080" + item.Image}}
            style={{width:50, height:50, borderRadius:25}}
          />
        </View>

        <View style={{marginLeft:10}}>
          <Text style={{fontSize:16, fontWeight:'bold'}}>{item.Ad} {item.Soyad}</Text>
        </View>



        </TouchableOpacity>

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
            <Text style={styles.headerBodyText}>Engellediklerim</Text>
          </Body>

        </Header>

        <View style={styles.container}>

          {this.state.data.length === 0 ?
              <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:20, fontWeight:'bold'}}>Kimse Bulunamadı</Text>
              </View>

              :

              <View>
                <FlatList
                  data={this.state.data}
                  keyExtractor={item=>item.id.toString()}
                  renderItem={this.renderItem}
                />
              </View>
          }


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
    padding:5,
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    borderBottomWidth:1,
    borderColor:'rgba(0,0,0,0.2)'

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

export default Blocks;
