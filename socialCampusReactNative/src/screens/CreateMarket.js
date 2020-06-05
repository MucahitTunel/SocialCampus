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
   KeyboardAvoidingView,
   ToastAndroid,
   YellowBox,
 } from 'react-native';
import { Container, Button, Header, Body, Title, Right, Left, Footer, FooterTab, Content} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/AntDesign';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {asyncData} from '../components/asyncData';
import ImagePicker from 'react-native-image-crop-picker';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';


import Constants from "../../Constants";
import {get, url} from '../components/fetch';
import Loading from '../components/Loading';

import RNGooglePlaces from 'react-native-google-places';

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);

class CreateMarket extends Component{

  constructor(props){
    super(props);

    this.getUrl = url();
    this.isAdd = false;
    this.arr=[];

    this.state={
      mail:'',
      images:[],
      title:'',
      price:'',
      status:'',
      description:'',
      category:'',
      place:'',
      statusValue:"İyi",
      status:["Çok İyi","İyi","Normal","Kötü","Çok Kötü"],
      selectedValue:"Elektronik",
      categories:["Elektronik","Ev-Bahçe","Spor","Eğlence","Araç","Moda-Aksesuar","Bebek-Çocuk","Film-Kitap-Müzik","Diğer"],
      load:false,
    }

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);

    this.back = this.back.bind(this);

  }

  componentDidMount(){
    this.backHandler = BackHandler.addEventListener(
     "hardwareBackPress",
     this.back
   );
    this.getMail();
    this.openSearchModal();
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  /*
  *Telefonun bulunduğu anlık konum
  */
  openSearchModal() {
    RNGooglePlaces.getCurrentPlace()
    .then((results) => console.log(results))
    .catch((error) => console.log(error.message));
  }




  getMail(){
    asyncData()
      .then(response => {
        this.setState({
          mail:response[0],
        })
      })
  }

  back = () => {
    Alert.alert(
      "Çıkmak istediğinizden emin misiniz?",
      "",
      [
        {text:"Evet", onPress: () => {
          this.props.navigation.goBack();
        }},
        {text:"İptal", onPress:null}
      ]
    )
    return true;
  }

  /*
  *Ürün eklenmesi sonucu bildirim
  */
  success = () => {
    Alert.alert(
      "Ürün başarıyla eklendi",
      "",
      [
        {text:"Tamam", onPress: () => {
          this.props.route.params.onGoBack(this.isAdd);
          this.props.navigation.goBack();
        }},
      ]
    )
    return true;
  }


  handleTitleChange = (v) =>{
    this.setState({
      title:v,
    })
  }

  handlePriceChange = (v) =>{
    this.setState({
      price:v,
    })
  }

  handleDescriptionChange = (v) =>{
    this.setState({
      description:v,
    })
  }


  /*
  *Seçilen bir resmi silme
  */

  options = (k) => {
    Alert.alert(
      "Seçenekler",
      "Silmek istediğinizden emin misiniz?",
      [
        {text:"İPTAL", onPress: null},
        {text:"EVET", onPress: () => this.delete(k)},
      ],
      {cancelable:true}
    )
  }

  delete = (k) => {
    var ar=[];
    for(let i = 0; i < this.state.images.length;i++){
      if(i === k){

      }else {
        ar[i] = this.arr[i];
      }
    }

    this.arr = ar;
    this.setState({
      images:this.arr,
    })
  }


  /*
  *Resim seçme işlemi
  */

  chooseImage = () => {
    console.log("chooseImage");
    ImagePicker.openPicker({
      multiple: true,
      maxFiles:10
    }).then(images => {

      var count = 0;

      //10'dan fazla resim seçilmesi durumu

      if(images.length > 10-this.state.images.length){
        if(this.state.images.length === 0){//ilk başta resim yokken 10dan fazla resim seçilirse burası çalışır
          for(let i = this.state.images.length; i < 10-this.state.images.length;i++){
            console.log(i);
            this.arr[i] = images[count];
            count++;
          }

          this.setState({
            images:this.arr,
          })
        }else {//Eğer daha önce resim varsa ve daha sonra 10'dan fazla resim olursa burası
          for(let k = this.state.images.length; k < 10; k++){
            this.arr[k] = images[count];
            count++;
          }
          this.setState({
            images:this.arr,
          })
        }

      }else {
        if(this.state.images.length === 0){
          this.arr = images;
          this.setState({
            images:images,
          })
        }else {
          console.log(this.state.images.length);
          console.log(images.length);
          var value = this.state.images.length + images.length;
          console.log(value);
          for(let j = this.state.images.length; j < value;j++){
            console.log("bu");
            console.log(j);
            this.arr[j] = images[count];
            count++;
          }
          console.log(this.arr);
          this.setState({
            images:this.arr,
          })
        }


      }

    });
  }


  fetch = async () => {

    if(this.state.title !== "" && this.state.description !== "" && this.state.mail !== "" && this.state.images.length !== 0){

      this.setState({
        load:true,
      })

      let data = new FormData();
      this.state.images.forEach((item, i) => {
        var degerler = item.path.split("/");
        var lenth = degerler.length
        var name = degerler[lenth-1];
        data.append("Image", {
          uri: item.path,
          type: "image/jpeg",
          name: name,
        });

        console.log(item);
      });
      data.append("Title", this.state.title)
      data.append("Price", this.state.price)
      data.append("Status", this.state.statusValue)
      data.append("Description", this.state.description)
      data.append("Category", this.state.selectedValue)
      data.append("Longitude", 37.866667)
      data.append("Latitude", 32.483333)
      data.append("Mail", this.state.mail)
      console.log(data);

      var url = this.getUrl + "Market/upload/";

      await fetch(url, {
        method: 'POST',
        body: data,
        headers:{
          'Accept':"application/json",
          'Content-Type': 'multipart/form-data',
        },
      }).then(response => response.json() )
        .then((response) => {
          var deger = response.valueOf("message");

          if(deger.message === "0"){
            this.setState({
              load:false,
            })
            this.isAdd = true;
            this.success()
          }else {
            this.setState({
              load:false,
            })
            Alert.alert("Hata oluştu!!!");
          }
      }).catch(error =>  ToastAndroid.show(error, ToastAndroid.LONG));

    }else {
        Alert.alert("Bilgileri düzgün girdiğinizden emin olunuz!")
    }
}


  render(){

    var category = this.state.categories.map((v, k) => {
      return(
        <Picker.Item label={v} value={v} key={k} />
      );
    })

    var durum = this.state.status.map((v, k) => {
      return(
        <Picker.Item label={v} value={v} key={k} />
      );
    })

    var event = "auto";

    if(this.state.load === true){
      event = "none";
    }

    return(
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor='#c42846' hidden={false}/>
        <Header
          style={{backgroundColor:'#c42846'}}
          androidStatusBarColor="#c42846"
        >
          <Left>
              <TouchableOpacity
                onPress={this.back}
                style={{marginLeft:10, flex:1, justifyContent:'center'}}
              >
                <Icon name="md-arrow-back" color="#ffffff" size={30}/>
            </TouchableOpacity>
          </Left>
          <Right><Text style={styles.headerBodyText}>İlan Detayları</Text></Right>

        </Header>

        {this.state.load === true && <Loading />}


        <KeyboardAwareScrollView
          style={{margin:10, backgroundColor:'#ffffff'}}
          enableOnAndroid={true}
          enableAutomaticScroll
          extraScrollHeight={100}
        >
          <View style={{flex:1}}>
            <View style={styles.textBoxView}>
              <Text style={styles.text}>Başlık<Text style={{color:'red'}}>*</Text></Text>
              <TextInput
                style={styles.inputText}
                value = {this.state.title}
                onChangeText = {this.handleTitleChange}
              />
              <Text style={{marginLeft:10, fontSize:12}}>Ne sattığınızı tarif edin</Text>
            </View>

            <View style={styles.textBoxView}>
              <Text style={styles.text}>Fiyat<Text style={{color:'red'}}>*</Text></Text>
              <TextInput
                style={styles.inputText}
                keyboardType="numeric"
                value = {this.state.price}
                onChangeText = {this.handlePriceChange}
              />
              <Text style={{marginLeft:10, fontSize:12}}>Bir fiyat belirleyin</Text>
            </View>

            <View style={styles.textBoxView}>
              <Text style={styles.text}>Tanım<Text style={{color:'red'}}>*</Text></Text>
              <TextInput
                style={styles.inputText}
                value = {this.state.description}
                onChangeText = {this.handleDescriptionChange}
              />
              <Text style={{marginLeft:10, fontSize:12}}>Ne sattığınızı detaylandırın</Text>
            </View>



            <View style={[styles.textBoxView, {backgroundColor:'#f1f1f1'}]}>
              <Text style={styles.text}>Kategori<Text style={{color:'red'}}>*</Text></Text>
              <Picker
                selectedValue={this.state.selectedValue}
                style={{ height: 50, width: '100%' }}
                onValueChange={(itemValue, itemIndex) => this.setState({
                  selectedValue:itemValue,
                })}
              >
                {category}
              </Picker>
            </View>

            <View style={[styles.textBoxView, {backgroundColor:'#f1f1f1'}]}>
              <Text style={styles.text}>Durum<Text style={{color:'red'}}>*</Text></Text>
              <Picker
                selectedValue={this.state.statusValue}
                style={{ height: 50, width: '100%' }}
                onValueChange={(itemValue, itemIndex) => this.setState({
                  statusValue:itemValue,
                })}
              >
                {durum}
              </Picker>
            </View>

            <View style={styles.textBoxView}>
              <View style={{flexDirection:'row'}}>
                <View><Text style={styles.text}>Resim Seç<Text style={{color:'red'}}>*</Text></Text></View>
                <View style={{alignItems:'flex-end', flex:1}}><Text style={styles.text}>{this.state.images.length}/10</Text></View>

              </View>
              {this.state.images.length === 0 ?
                <View>
                <TouchableOpacity
                  style={{marginTop:10, width:100, height:100,borderRadius:10, alignItems:'center', justifyContent:'center', backgroundColor:'pink'}}
                  onPress={this.chooseImage}
                >
                    <Text style={{fontSize:30}}>+</Text>
                </TouchableOpacity>


                </View>


                :

                <View style={{flexDirection:'row'}}>
                <ScrollView horizontal={true}>
                  {this.state.images.map((v,k) => {
                    return(
                      <TouchableOpacity
                      key={k}
                      style={{marginTop:10,marginLeft:5, width:100, height:100,borderRadius:10, alignItems:'center', justifyContent:'center', backgroundColor:'pink'}}
                      onPress={() => this.options(k)}
                      >
                        <Image
                          style={{width:'100%', height:'100%', borderRadius:10}}
                          resize="stretch"
                          source = {{uri:v.path}}
                        />
                      </TouchableOpacity>
                    );
                  })}

                  {this.state.images.length < 10 ?

                      <TouchableOpacity
                        style={{marginTop:10, width:100, height:100,borderRadius:10,marginLeft:5, alignItems:'center', justifyContent:'center', backgroundColor:'pink'}}
                        onPress={this.chooseImage}
                      >
                          <Text style={{fontSize:30}}>+</Text>
                      </TouchableOpacity>


                    :

                    null
                  }
                </ScrollView>

                </View>
              }
              <Text style={{marginLeft:10, fontSize:12, fontWeight:'bold'}}>En fazla 10 tane fotoğraf seçebilirsiniz (10 resimden fazla seçerseniz seçtiğiniz ilk 10 fotoğraf eklenir).</Text>
            </View>


            {this.state.images.length === 0 ?
              <View style={{width:'100%', alignItems:'flex-end'}}>
                <TouchableOpacity
                  style={{backgroundColor:'rgba(206,8,39,0.5)', width:100, height:50, marginTop:20, borderRadius:10, alignItems:'center', justifyContent:'center'}}
                  disabled={true}
                >
                  <Text style={{fontSize:22, color:'#ffffff', fontWeight:'bold'}}>YÜKLE</Text>
                </TouchableOpacity>
              </View>

              :

              <View style={{width:'100%', alignItems:'flex-end'}}>
                <TouchableOpacity
                  style={{backgroundColor:'#c42846', width:100, height:50, marginTop:20, borderRadius:10, alignItems:'center', justifyContent:'center'}}
                  onPress={() =>{
                    this.setState({
                      loading:true,
                    })
                    this.fetch();}}
                >
                  <Text style={{fontSize:22, color:'#ffffff', fontWeight:'bold'}}>YÜKLE</Text>
                </TouchableOpacity>
              </View>
            }

          </View>

        </KeyboardAwareScrollView>



      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  headerBodyText:{
    fontSize:25,
    fontWeight:"bold",
    fontFamily:'FFF_Tusj',
    color:'#ffffff',
    marginRight:10,
  },
  inputText:{
    borderWidth:1,
    borderRadius:5,
    fontSize:20
  },
  textBoxView:{
    marginTop:5,
    marginBottom:5,
  },
  text:{
    fontSize:18
  }

})


export default CreateMarket;
