import React, {Component} from 'react';
import {View,ToastAndroid, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList, ScrollView, Image, TextInput, DatePickerAndroid,Picker, Alert, BackHandler, YellowBox} from 'react-native';
import { Container, Button, Header, Body, Title, Right, Left, Footer, FooterTab, Content} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/AntDesign';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {asyncData} from '../components/asyncData';
import ImagePicker from 'react-native-image-picker';

import {get, url} from '../components/fetch';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Constants from "../../Constants";

import Carousel, {Pagination} from 'react-native-snap-carousel';


YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

class Detail extends Component{

  constructor(props){
    super(props);

    this.isLike=false;
    this.ilkdurum=false;
    this.id = this.props.route.params["id"]
    this.getUrl = url();
    this.isAdd = false;


    this.state={
      mail:'',
      market:[],
      image:[],
      user:[],
      activeSlide:0,
      fetchkontrol:0,
      like:false,
      fav:"",
      fpgrowth: [],
    }


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

  onGoBack = (a,b) =>{
    console.log(a);
  }

  back = () => {
    console.log("back");

    if(this.state.fav !== this.ilkdurum){
      this.isLike = true;
    }

    this.props.route.params.onGoBack(this.isAdd, this.isLike);
    this.props.navigation.goBack();
    return true;
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
  *onGoVBack sayfa yenileme
  */
  refresh = (isAdd) => {
    this.isAdd = isAdd;
    if(isAdd === true){
      this.setState({
        fetchkontrol:0,
      })
      this.fetchData();
    }
  }



  /*
  *Fetch işlemi
  */

  async fetchData(){

      var url = this.getUrl + "Market/detail/";
      var formData = new FormData();
      formData.append("id", this.id)
      formData.append("mail", this.state.mail)


      await fetch(url, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers:{
          'Content-Type': 'application/json',
        },
      }).then(response => response.json() )
        .then((response) => {

          this.ilkdurum = response.Fav;
          console.log(response);
          this.setState({
            market:response.Market,
            image:response.Image,
            user:response.User,
            fav:response.Fav,
            fetchkontrol:1,
            fpgrowth: response.Fpgrowth,
          })

      }).catch(error => console.error('Hata:', error));
  }

  /*
  *Ürün silme
  */
  deleteMarket = () => {
    console.log("delete market");
      Alert.alert(
        "Ürününüzü Silmek istediğinizden emin misiniz?",
        "",
        [
          {text:"Evet", onPress: this.fetchDelete},
          {text:"İptal", onPress:null},
        ]
      )
    }

    /*
    *ürün silme sorgusu
    */
  fetchDelete = async () => {
    console.log("fetchdelete");
    var url = this.getUrl + "Market/deleteMarket/";
    var value = {id:this.id};

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(value),
      headers:{
        'Content-Type': 'application/json',
      },
    }).then(response => response.json() )
      .then((response) => {
        console.log(response);

        var deger = response.valueOf("message");
        if(deger.message === "0"){
          Alert.alert(
            "Ürün Silindi",
            "",
            [
              {text:"Tamam", onPress: () => {
                this.isAdd=true;
                this.back();
              }},
            ]
          );
        }

    }).catch(error =>  ToastAndroid.show(error, ToastAndroid.LONG));
  }

  /*
  *Ürün favorilere ekleme
  */
  like = async () => {
    var url = this.getUrl + "Market/favorites/";
    var formData = new FormData();
    formData.append("Mail", this.state.mail);
    formData.append("MarketId", this.id)

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers:{
        'Content-Type': 'application/json',
      },
    }).then(response => response.json() )
      .then((response) => {


        console.log(response);
        this.setState({
          fav:response.Fav,
        })

    }).catch(error =>  ToastAndroid.show(error, ToastAndroid.LONG));
  }





  /*
  *Birden fazla resim var sayfalama işlemi yapılıyor
  */

    get pagination () {
        const { image, activeSlide } = this.state;
        return (
            <Pagination
              dotsLength={image.length}
              activeDotIndex={activeSlide}
              containerStyle={{ backgroundColor: 'rgba(220, 216, 216, 0.75)', alignItems:'center', justifyContent:'center'}}
              dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 8,
                  backgroundColor: 'rgba(255, 255, 255, 1)'
              }}
              inactiveDotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
        );
    }

    /*
    *resimler listeleniyor
    */
    _renderItem = ({item, index}) => {
          return (
              <View style={{alignItems:'center'}}>
                  <Image
                    style={{width:'100%',height:300}}
                    resize='stretch'
                    source = {{uri: "http://192.168.1.104:8080" + item.Image}}
                  />
              </View>
          );
      }



  render(){

    console.log("**************");
    console.log(this.state.fpgrowth.length);
    console.log("**************");

    var {navigation} = this.props;
    if(this.state.mail === "" && this.state.fetchkontrol === 0){
      return(
        <View></View>
      );
    }else {
      var email;
      var id;
      this.state.user.map((value) => {
        email = value.Email;
      })
      this.state.market.map((value) =>{
        id=value.id;
        console.log(id);
      })

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

                  {email === this.state.mail ?
                    <TouchableOpacity style={{marginLeft:15}}
                      onPress={() => this.props.navigation.navigate("EditMarket", {id:id, onGoBack:this.refresh})}
                    >
                      <Icons name="edit" size={25} color="#ffffff"/>
                    </TouchableOpacity>

                    :

                    null
                  }


                  {email === this.state.mail ?
                    <TouchableOpacity style={{marginLeft:15}}
                      onPress={()=>this.deleteMarket()}
                    >
                      <Material name="delete" size={25} color="#ffffff" />
                    </TouchableOpacity>

                    :

                    null
                  }
                </Right>
              </Header>

              <Content>

                <View style={styles.contentBox}>

                  <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.image}
                    renderItem={this._renderItem}
                    sliderWidth={Constants.MAX_WIDTH-20}
                    itemWidth={Constants.MAX_WIDTH}
                    onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                  />
                  { this.pagination }

                  {this.state.market.map((value, key)=> {
                    return(
                      <View key={key} style={{marginTop:10}}>
                        <View style={{flexDirection:'row'}}>
                          <View style={{alignItems:'flex-start', justifyContent:'center', flex:1}}>
                            <Text style={{color:'red', fontWeight:'bold', fontSize:30}}>{value.Price} TL</Text>
                          </View>

                          <TouchableOpacity style={{alignItems:'flex-end', justifyContent:'center'}}
                            onPress={this.like}
                          >
                            {this.state.fav === "1" ?
                              <Icons name="heart" size={40} color="rgba(196,40,70,0.8)" ></Icons>
                              :
                              <Icons name="heart" size={40} color="rgba(0,0,0,0.2)"></Icons>
                            }
                          </TouchableOpacity>
                        </View>

                        <View style={{marginTop:20}}>
                          <Text style={{fontWeight:'bold', fontSize:18}}>{value.Title}</Text>
                        </View>
                        <View style={{marginTop:10}}>
                          <Text style={{fontSize:16}}>{value.Description}</Text>
                        </View>

                        <View style={{marginTop:10, flexDirection:'row'}}>
                        <View><Text style={{fontSize:16, fontWeight:'bold'}}>Ürün Durumu: </Text></View>
                        <View><Text style={{fontSize:16}}>{value.Status}</Text></View>

                        </View>
                      </View>

                    );
                  })}

                  {this.state.user.map((value, key) => {
                    return(
                      <View key={key}>
                        <View style={{marginTop:20, borderWidth:1, flexDirection:'row', justifyContent:'center', borderColor:'rgba(0,0,0,0.2)'}} key={key}>
                          <View style={{alignItems:'flex-start',}}>
                            <Image
                              style={{width:50, height:50, borderRadius:30, margin:3}}
                              resize='stretch'
                              source = {{uri: "http://192.168.1.104:8080" + value.Image}}
                            />
                          </View>
                          <View style={{alignItems:'flex-start', justifyContent:'center', flex:1, marginLeft:10}}>
                            <Text style={{fontWeight:'bold'}}>{value.Ad} {value.Soyad}</Text>
                          </View>
                        </View>


                      </View>
                    );
                  })}


                  {this.state.market.map((value,key) => {
                    return(
                      <View style={{marginTop:20}} key={key}>
                        <MapView
                           provider={PROVIDER_GOOGLE}
                           style={styles.map}
                           region={{longitude:value.Longitude, latitude:value.Latitude,latitudeDelta: 0.015, longitudeDelta: 0.0121}}
                         >

                           <Marker
                             coordinate = {{longitude:value.Longitude, latitude:value.Latitude}}
                           />
                        </MapView>
                      </View>
                    );
                  })}

                  {/* FP GROWTH */}



                  {this.state.fpgrowth.length > 0 ?
                    <View>
                      <View
                        style={{backgroundColor:'#f37f95', height:40, alignItems:'flex-start', justifyContent:'center', marginTop:10}}
                      >
                        <Text style={{fontSize:18, marginLeft:10, fontWeight:'bold'}}>Bunlarada göz atabilirsiniz</Text>
                      </View>

                      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{backgroundColor:'#fdd9d9'}}>
                        {this.state.fpgrowth.map((value, key) => {
                          return(
                            <View key={key}>
                              <TouchableOpacity
                                style={styles.renderBoxButton}
                                onPress={() => this.props.navigation.push("DetailMarket", {id:value.Market_Id, onGoBack:this.onGoBack})}
                              >
                                  <Image
                                    style={styles.image}
                                    resize='stretch'
                                    source = {{uri: "http://192.168.1.104:8080" + value.Image}}
                                  />
                              </TouchableOpacity>
                            </View>
                          );
                      })}

                    </ScrollView>
                  </View>
                  :

                  null
                }






                </View>
              </Content>
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
   width:Constants.MAX_WIDTH-20,
   height:Constants.MAX_HEIGHT/2,
 },
 renderBoxButton:{
   margin:5,
   borderWidth:1,
 },
 image:{
   width:Constants.MAX_WIDTH/2-20,
   height: Constants.MAX_WIDTH/2-20,
 },

})


export default Detail;
