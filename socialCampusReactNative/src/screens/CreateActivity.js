import React, {Component} from 'react';
import {View,ToastAndroid, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList, ScrollView, Image, TextInput, DatePickerAndroid,Picker, Alert, BackHandler, YellowBox} from 'react-native';
import { Container, Button, Header, Body, Title, Right, Left, Footer, FooterTab, Content} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/AntDesign';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {asyncData} from '../components/asyncData';
import ImagePicker from 'react-native-image-picker';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


import Constants from "../../Constants";
import {get, url} from '../components/fetch';
import Loading from '../components/Loading';

YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])



class CreateActivity extends Component{

  constructor(props){
    super(props);

    this.getUrl = url();
    this.isAdd = false;

    this.state={
      activeFoot: 1,
      mail:'',
      filePath: {},
      data : [],
      content:'',
      address:'',
      price:'',
      checkbox:false,
      hoursCheckbox:false,
      mapCheckbox:false,
      days : ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
      tarih:'',
      hour:"",
      minute:"",
      activityType:"Seçiniz",
      types:["Seçiniz","Gezi", "Konser", "Yarışma"],
      imagePath:"",
      coordinates: [],
      load:false,
    }

    this.showDatePicker.bind(this);

    this.handleContentChange = this.handleContentChange.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handlePriceChange = this.handlePriceChange.bind(this)
    this.handleHoursChange = this.handleHoursChange.bind(this)
    this.handleMinuteChange = this.handleMinuteChange.bind(this)

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

    this.props.route.params.onGoBack(this.isAdd);
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

  /*
  *Tarih Seçme
  */

  showDatePicker = async (options) => {
  try {
    const {action, year, month, day} = await DatePickerAndroid.open(options);
    if (action !== DatePickerAndroid.dismissedAction) {


      var intday = new Date(year,month,day).getDay();
      this.gun = new Date(year,month,day)
      let newState = {};
      newState['tarih'] = this.state.days[intday] + ", " + day + "." + (month+1) + "." + year;

      this.setState(newState);
    }
  } catch ({code, message}) {
    console.warn(`error `, code, message);
  }
};


  /*
  *Resim seç
  */
  chooseFile = () => {
  var options = {
    title: 'Fotoğraf Seç',
    customButtons: [
    ],
    takePhotoButtonTitle: "Resim Çek",
    chooseFromLibraryButtonTitle: "Galeriden Seç",
    mediaType: "photo",
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
      let cevap = this.state.data.concat(response)
      this.setState({
        imagePath: source.path,
        filePath: source,
        data: cevap,
      });

    }

  });//ImagePicker
}

  /*
  *Text Olayları
  */
  handlePriceChange = (v) =>{
    this.setState({
      price: v,
    })
  }

  handleAddressChange = (v) => {
    this.setState({
      address: v,
    })
  }

  handleContentChange = (v) => {
    this.setState({
      content: v,
    })
  }

  handleHoursChange = (v) => {
    var hour = v;
    if(v > 24){
      hour = "00";
    }
    this.setState({
      hour: hour,
    })
  }

  handleMinuteChange = (v) => {
    var minute = v;
    if(v > 59){
      minute = "59";
    }
    this.setState({
      minute: minute,
    })
  }

  /*
  *
  *Koordinat belirleme
  *
  */



  onMapPress = (e) => {
    let latitude = e.nativeEvent.coordinate.latitude;
    let longitude = e.nativeEvent.coordinate.longitude


    let newCoordinate = [];

    newCoordinate.push({
      latitude: latitude,
      longitude: longitude
    })

    this.setState({
      coordinates: newCoordinate,
    })
  }


  /*
  *Fetch işlemi
  */

  async fetchData(){
    this.kontrol = 0;

    if(this.state.imagePath === ""){
      this.kontrol = 1;
      Alert.alert("Afiş Ekleyiniz!!!");
    }else {
      if(this.state.activityType === "Seçiniz" || this.state.content === "" || this.state.address === "" || this.state.tarih === ""){
        this.kontrol = 1;
        Alert.alert("Verileri Düzgün Girdiğinizden Emin Olunuz!!!")
      }else {
        if(this.state.checkBox === true && this.state.price === "" || this.state.hoursCheckbox === true && this.state.hour === "" || this.state.mapCheckbox === true && this.state.coordinates.length === 0){
          this.kontrol = 1;
          Alert.alert("Saat, Ücret veya Harita Değerlerini Kontrol Ediniz!!!")
        }
      }
    }


    if(this.kontrol === 0){
      this.setState({
        load:true,
      })
      var formData = new FormData();
      var url = this.getUrl + "Activities/upload/";

      let picturepath = "file://"+this.state.filePath.path;
      let fileName = this.state.filePath.fileName;


      formData.append("Type", this.state.activityType)
      formData.append("Content", this.state.content)
      formData.append("Image", {uri:picturepath,name:fileName,  type:"image/jpeg"})
      formData.append("Address", this.state.address)
      formData.append("Date", this.state.tarih)
      formData.append("Email", this.state.mail)

      if(this.state.checkBox === true){
        formData.append("Price", this.state.price)
      }else {
        formData.append("Price","0")
      }

      if(this.state.hoursCheckbox === true){
        formData.append("Hour", this.state.hour)
      }else {
        formData.append("Hour", "0")
      }

      if (this.state.mapCheckbox === true) {
        formData.append("Longitude",this.state.coordinates[0].longitude)
        formData.append("Latitude",this.state.coordinates[0].latitude)
      }else {
        formData.append("Longitude","yok")
        formData.append("Latitude","yok")
      }


      await fetch(url, {
        method: 'POST',
        body: formData,
        headers:{
          'Accept':"application/json",
          'Content-Type': 'multipart/form-data',
        },
      }).then(response => response.json() )
        .then((response) => {
          const value = response.valueOf("message")
          if(value.message === "1"){
            this.isAdd = true;
            this.setState({
              load:false,
            })
            Alert.alert(
              "Eklendi",
              "Etkinlik Başarıyla oluşturuldu",
              [
                {text:"Tamam", onPress: this.back}
              ],
            );
          }else {
            this.setState({
              load:false,
            })
            Alert.alert("Etkinlik oluşturulurken hata oluştu");
          }
      }).catch(error =>  ToastAndroid.show(error, ToastAndroid.LONG));

    }

  }




  render(){

    var {navigation} = this.props;

    let types = this.state.types.map((value, i) => {
      return <Picker.Item key={i} value={value} label={value}/>
    })

    if(this.state.coordinates.length === 0){
      this.region = {
        latitude: 37.874641,
        longitude: 32.493156,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }
    }else {
      this.region = {
        latitude: this.state.coordinates[0].latitude,
        longitude: this.state.coordinates[0].longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }
    }

    var event = "auto";

    if(this.state.load === true){
      event = "none";
    }



    return(

        <View style={{flex:1}} >

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
                <Text style={styles.headerBodyText}>Sosyal Kampüs</Text>
              </Right>
            </Header>

            {this.state.load === true && <Loading />}

            <KeyboardAwareScrollView
              style={{flex:1, backgroundColor:'#ffffff'}}
              enableOnAndroid={true}
              enableAutomaticScroll
              extraScrollHeight={100}
            >
              <View style={styles.contentBox} pointerEvents={event}>


                  {/*
                    *
                    *Afiş ekleme
                    *
                    */}

                  <View style={styles.inputDataBox}>
                    <View style={[styles.editInputBox,{alignItems:'center'}]}>
                      <Text style={[styles.text, {alignItems:'center'}]}>AFİŞ</Text>
                    </View>
                    <View style={[styles.editInputBox, {alignItems:'center'}]}>
                      <TouchableOpacity
                          onPress={this.chooseFile.bind(this)}
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
                    </View>
                  </View>

                  {/*
                    *
                    *Etkinlik türü Seçme işlemi
                    *
                    */}

                  <View style={styles.inputDataBox}>
                    <View style={styles.editInputBox}>
                      <Text style={styles.text}>Etkinlik Türü</Text>
                    </View>
                    <View style={styles.editInputBox}>
                      <Picker
                        selectedValue={this.state.activityType}
                        style={{height: 50, width: 150}}
                        onValueChange={(itemValue, itemIndex) =>
                          this.setState({activityType: itemValue})
                        }>

                        {types}

                        </Picker>
                    </View>
                  </View>

                  {/*
                    *
                    *Açıklama oluşturma işlemi
                    *
                    */}

                  <View style={styles.inputDataBox}>
                    <View style={styles.editInputBox}>
                      <Text style={styles.text}>Açıklama</Text>
                    </View>
                    <View style={styles.editInputBox}>
                      <TextInput
                        multiline={true}
                        numberOfLines={5}
                        style={{height:50, borderWidth:1}}
                        value = {this.state.content}
                        onChangeText = {this.handleContentChange}

                      />
                    </View>
                  </View>

                  {/*
                    *
                    *Adres oluşturma işlemi
                    *
                    */}

                  <View style={styles.inputDataBox}>
                    <View style={styles.editInputBox}>
                      <Text style={styles.text}>Adres</Text>
                    </View>
                    <View style={styles.editInputBox}>
                      <TextInput
                        style={{height:50, borderWidth:1}}
                        value = {this.state.address}
                        onChangeText = {this.handleAddressChange}

                      />
                    </View>
                  </View>

                  {/*
                    *
                    *Ücret belirleme işlemi
                    *
                    */}

                  <View style={[styles.inputDataBox,{alignItems:'flex-start'}]}>
                    <View style={[styles.editInputBox, {flexDirection:'row'}]}>
                      <View style={{ justifyContent:'center'}}>
                        <Text style={styles.text}>Ücret:</Text>
                      </View>
                      <View style={{marginLeft:3,justifyContent:'center'}}>
                        {this.state.checkbox === true ?
                          <TouchableOpacity
                            onPress={() => {this.setState({checkbox:!this.state.checkbox})}}
                          >
                            <Fontisto name="checkbox-active" backgroundColor="#ffffff" size={25} color="#900"/>
                          </TouchableOpacity>

                          :

                          <TouchableOpacity
                            onPress={() => {this.setState({checkbox:!this.state.checkbox})}}
                          >
                            <Fontisto name="checkbox-passive" backgroundColor="#ffffff" size={25} color="#900" />
                          </TouchableOpacity>

                        }
                      </View>
                    </View>

                    {this.state.checkbox === false ?

                      null

                      :

                      <View style={styles.editInputBox}>
                        <TextInput
                          style={{height:50, borderWidth:1, width:100}}
                          value = {this.state.price}
                          onChangeText = {this.handlePriceChange}
                          keyboardType="numeric"
                        />
                      </View>

                    }
                  </View>

                  {/*
                    *
                    *Tarih oluşturma işlemi
                    *
                    */}

                  <View style={styles.inputDataBox}>
                    <View style={[styles.editInputBox, {flexDirection:'column', alignItems:'flex-start'}]}>
                      <View style={{flex:1, justifyContent:'center'}}>
                        <Text style={styles.text}>Tarih Seç</Text>
                      </View>
                      <View style={{flex:4, justifyContent:'center', flexDirection:'row'}}>
                        <View>
                          <TouchableOpacity
                            style={{height:40, backgroundColor:'gray', width:100,alignItems:'center', justifyContent:'center', backgroundColor:'#c42846'}}
                             onPress={() => this.showDatePicker({tarih: this.state.tarih})}
                          >
                            <Text style={{marginRight:5, marginLeft:5, fontSize:20, color:'#ffffff'}}>SEÇ</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{alignItems:'center', justifyContent:'center'}}>
                          <Text style={{fontSize:20}}>   {this.state.tarih}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/*
                    *
                    *Saat belirleme
                    *
                    */}

                    <View style={[styles.inputDataBox,{alignItems:'flex-start'}]}>
                      <View style={[styles.editInputBox, {flexDirection:'row'}]}>
                        <View style={{ justifyContent:'center'}}>
                          <Text style={styles.text}>Saat:</Text>
                        </View>
                        <View style={{ marginLeft:5,justifyContent:'center'}}>
                          {this.state.hoursCheckbox === true ?
                            <TouchableOpacity
                              onPress={() => {this.setState({hoursCheckbox:!this.state.hoursCheckbox})}}
                            >
                              <Fontisto name="checkbox-active" backgroundColor="#ffffff" size={25} color="#900"/>
                            </TouchableOpacity>

                            :

                            <TouchableOpacity
                              onPress={() => {this.setState({hoursCheckbox:!this.state.hoursCheckbox})}}
                            >
                              <Fontisto name="checkbox-passive" backgroundColor="#ffffff" size={25} color="#900" />
                            </TouchableOpacity>

                          }
                        </View>
                      </View>

                      {this.state.hoursCheckbox === false ?

                        null

                        :

                        <View style={[styles.editInputBox, {flexDirection:'row', alignItems:'center'}]}>
                          <View style={{alignItems:'flex-start'}}>
                              <TextInput
                                style={{height:40, borderWidth:1, width:50,alignItems:'center', justifyContent:'center'}}
                                value = {this.state.hour}
                                onChangeText = {this.handleHoursChange}
                                keyboardType="numeric"
                              />
                          </View>
                          <View style={{justifyContent:'center'}}>
                            <Text style={{fontSize:20, fontWeight:'bold'}}> : </Text>
                          </View>
                          <View>
                              <TextInput
                                style={{height:40, borderWidth:1, width:50, alignItems:'center', justifyContent:'center'}}
                                value = {this.state.minute}
                                onChangeText = {this.handleMinuteChange}
                                keyboardType="numeric"
                              />
                          </View>
                        </View>

                      }
                    </View>

                    {
                      /*
                      *
                      *Harita Oluşturma
                      *
                      */
                    }

                    <View style={[styles.inputDataBox,{alignItems:'flex-start'}]}>
                      <View style={[styles.editInputBox, {flexDirection:'row'}]}>
                        <View style={{ justifyContent:'center'}}>
                          <Text style={styles.text}>Harita:</Text>
                        </View>
                        <View style={{ marginLeft:5,justifyContent:'center'}}>
                          {this.state.mapCheckbox === true ?
                            <TouchableOpacity
                              onPress={() => {this.setState({mapCheckbox:!this.state.mapCheckbox})}}
                            >
                              <Fontisto name="checkbox-active" backgroundColor="#ffffff" size={25} color="#900"/>
                            </TouchableOpacity>

                            :

                            <TouchableOpacity
                              onPress={() => {this.setState({mapCheckbox:!this.state.mapCheckbox})}}
                            >
                              <Fontisto name="checkbox-passive" backgroundColor="#ffffff" size={25} color="#900" />
                            </TouchableOpacity>

                          }
                        </View>
                      </View>

                      {this.state.mapCheckbox === false ?

                        null

                        :
                        <View>
                        <MapView
                           provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                           style={styles.map}
                           region={this.region}
                           onPress = {this.onMapPress}
                         >

                         {this.state.coordinates.length > 0 ?

                           <Marker
                             coordinate = {this.state.coordinates[0]}
                           />

                           :

                           null
                         }

                       </MapView>
                       </View>
                      }
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

              </KeyboardAwareScrollView>



        </View>

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
  },
  map: {
   width:Constants.MAX_WIDTH,
   height:Constants.MAX_HEIGHT/2,
 },

})


export default CreateActivity;
