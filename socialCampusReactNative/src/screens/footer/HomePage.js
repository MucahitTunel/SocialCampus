
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

class HomePage extends Component{

  constructor(props){
    super(props);

    this.url = url();
    this.state = {
      data:[],
      dataNew:[],
      refreshing: false,
      fetchKontrol:false,
      responseAsync:[],
    }
    this.data = 0;
  }

  /*
  *
  *Component Did Mount
  *
  */

  componentDidMount(){
    if(this.props.page===0){
      this.getData();
    }else {
      this.getAsyncData();
    }
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
    var url = "http://192.168.1.104:8080/Activities/get_data/";
    this.data = 0;
    let data = get(url);
    data.then(response => {
      console.log(response);
      this.setState({
        data:response,
        refreshing:false,
        fetchKontrol:true,
      })
    }).catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
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
  *Refresh kontrolü
  */
  flatlistRefresh = () => {
    this.setState({
      refreshing:true,
    })
    this.data=0;
    this.getData();
  }


  /*
  *State yönetimi. Veriler dopaya atılıyor.
  */
  storeData = async () => {

    if(this.state.fetchKontrol === true){
      try {
        await AsyncStorage.setItem('@homepage', JSON.stringify(this.state.data));

      } catch (e) {
        // saving error
        console.log("hata");
      }
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

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
          <View style={{flexDirection:'column', marginLeft:10}}>

              <View style={{marginTop:3}}><Text style={{fontSize:16, fontWeight:'bold', textDecorationLine:'underline'}}>Tür</Text></View>
              <View style={{marginTop:3}}><Text style={{fontSize:16}}>{item.Type}</Text></View>
              <View style={{marginTop:3}}><Text style={{fontSize:16, fontWeight:'bold', textDecorationLine:'underline'}}>Tarih</Text></View>
              <View style={{marginTop:3}}><Text style={{fontSize:16}}>{item.Date}</Text></View>
              <View style={{marginTop:3}}><Text style={{fontSize:16, fontWeight:'bold', textDecorationLine:'underline'}}>Açıklama</Text></View>
              <View style={{marginTop:3}}><Text style={{fontSize:16}}>{item.Content}</Text></View>

          </View>
          </ScrollView>
        </TouchableOpacity>
      </View>
    );
  }


  render(){
    if(this.state.fetchKontrol === true && this.data === 0){
      this.storeData();
      this.data = 1;
    }

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
              onPress={() => this.props.navigation.navigate("MessageList")}
            >
              <Icons name="message1" size={30} style={styles.icons}></Icons>
            </TouchableOpacity>

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
    fontSize:20,
    fontWeight:"bold",
    fontFamily:'FFF_Tusj',
    color:'#ffffff',
  },

});

export default HomePage;
