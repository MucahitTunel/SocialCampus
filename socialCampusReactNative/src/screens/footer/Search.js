import React, {Component} from 'react';
import {View,ToastAndroid, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList, ScrollView, Image, TextInput, DatePickerAndroid,Picker, Alert} from 'react-native';
import { Container, Button, Header, Body, Title, Right, Left, Footer, FooterTab, Content} from 'native-base';


import Constants from '../../../Constants';
import {get, url} from '../../components/fetch';
import { YellowBox } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/AntDesign';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {asyncData} from '../../components/asyncData';



class Search extends Component{

  constructor(props){
    super(props);

    this.getUrl = url();

    this.ara = false;

    this.state={
      search:'',
      activeFoot:1,
      data:[],
      mail:"",
    }

    this.handleSearchChange = this.handleSearchChange.bind(this)

  }//Constructor

  componentDidMount(){
    this.getMail();
  }


  getMail(){
    asyncData()
      .then(response => {
        this.setState({
          mail:response[0],
        })
      })
  }


  refresh = (v) => {
    if(v===true){
      this.fetchData();
    }
  }


  /*
  *
  *Searching text işlemi
  *
  */
  handleSearchChange = (v) => {
    console.log(v);
    this.ara = true;
    this.setState({
      search: v,
    })

  }



  gotoAccount = (email, id) => {
      this.props.navigation.navigate("Profiles", {id:id})
  }



  /*
  *Fetch işlemi
  */

  async fetchData(){

    if(this.state.search !== ""){

      var formData = new FormData();
      formData.append("search", this.state.search)
      formData.append("mark", this.state.activeFoot)

      var url = this.getUrl + "Subjects/search/"

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
            data: response,
          })
      }).catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
    }
  }


  /*
  *aktif olan aram tipi
  */

  activeFootStatus = (v) => {

    if(this.state.activeFoot !== v){
      this.setState({
        activeFoot:v,
        data:[],
      })

      this.ara = true;
    }


  }


  /*
  *
  *Render Item işlemleri
  *Aktif olan arama tipine göre
  *
  */

  renderItem = ({item}) => {

    if(this.state.activeFoot === 3){
      return(
        <TouchableOpacity
          style={styles.borderSubject}
          onPress={() => this.props.navigation.navigate("Comment", {id:item.id})}

        >
          <Text style={styles.textStyle}>{item.Subject}</Text>
        </TouchableOpacity>
      );
    }else if (this.state.activeFoot === 1) {
      return(

        <TouchableOpacity
          style={styles.borderAccount}
          onPress = {() => this.gotoAccount(item.Email, item.id)}
        >
          <View>
            <Image
              style={{width:50, height:50, borderRadius:20, alignItems:'flex-start'}}
              resize='stretch'
              source = {{uri: "http://192.168.1.104:8080" + item.Image}}
            />
          </View>
          <View>
            <Text style={styles.textStyle}>  {item.Kullanici_Adi}</Text>
          </View>

        </TouchableOpacity>

      );
    }else {
      return(

        <TouchableOpacity
          style={styles.borderAccount}
            onPress={() => this.props.navigation.navigate("Detail", {id:item.id, onGoBack:this.refresh})}
        >
          <View>
            <Image
              style={{width:50, height:50, borderRadius:20, alignItems:'flex-start'}}
              resize='stretch'
              source = {{uri: "http://192.168.1.104:8080" + item.Image}}
            />
          </View>
          <View style={{justifyContent:'center'}}>
            <Text style={styles.textStyle}>  {item.Type}</Text>
          </View>

        </TouchableOpacity>

      );
    }

  }

  /*
  *
  *Render
  *
  */


  render(){

    var {navigation} = this.props;

    /*
    * Arama kutusunun dolu olup olmamasına göre fetch işlemleri burada ayarlanıyor
    */
    if(this.state.search.length !== 0 && this.ara === true){
      this.fetchData();
      this.ara = false;
    }

    if(this.state.search.length === 0 && this.ara === true){
      this.setState({
        data:[],
      })
      this.ara = false;
    }

    return(

        <Container>

            <Header
              style={styles.header}
              androidStatusBarColor="#c42846">

                <View style={{flex:1, justifyContent:'center'}}>
                  <TextInput
                    style={styles.textSearchInput}
                    value = {this.state.search}
                    onChangeText = {this.handleSearchChange}
                    maxLength={100}
                    placeholder='Arama...'
                  />
                </View>

            </Header>

            <Footer
              style={{height:25}}
            >

              <FooterTab style={{backgroundColor:'#f37f95'}}>
                <Button vertical
                  active={this.state.activeFoot===1}
                  onPress={() => this.activeFootStatus(1)}
                  style={{backgroundColor: this.state.activeFoot === 1 ? "#ffffff" : null,height:25, borderRadius:0}}
                  >
                  <Text style={styles.text}>HESAPLAR</Text>
                </Button>

                <Button vertical
                  active={this.state.activeFoot===2}
                  onPress={() => this.activeFootStatus(2)}
                  style={{backgroundColor: this.state.activeFoot === 2 ? "#ffffff" : null,height:25, borderRadius:0}}
                  >
                  <Text style={styles.text}>ETKİNLİKLER</Text>
                </Button>

                <Button vertical
                  active={this.state.activeFoot===3}
                  onPress={() => this.activeFootStatus(3)}
                  style={{backgroundColor: this.state.activeFoot === 3 ? "#ffffff" : null,height:25, borderRadius:0}}
                  >
                  <Text style={styles.text}>KONULAR</Text>
                </Button>
              </FooterTab>
            </Footer>


            <Content>
              <View style={styles.contentBox}>

                <FlatList
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={item=>item.id.toString()}
                    scrollEnable={true}
                />


              </View>
            </Content>




        </Container>

    );
  }
}

const styles = StyleSheet.create({
  borderAccount:{
    flexDirection:'row',
    alignItems:'flex-start',
    marginTop:10,
  },
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
    fontWeight:'bold',
  },
  textStyle:{
    fontSize:20,
    marginTop:5,
    marginBottom:5,
    marginLeft:5,
    fontWeight:'bold'
  },
  textSearchInput:{
    height:40, borderWidth:1, fontSize:16, marginRight:5, backgroundColor:'#f7f3f3'
  },

})


export default Search;
