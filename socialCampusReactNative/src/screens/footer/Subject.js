
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
  ToastAndroid,
} from 'react-native';
import { Container, Button, Header, Body, Title, Right, Left, Footer, FooterTab, Content} from 'native-base';
import Constants from '../../../Constants';
import {get, url} from '../../components/fetch';

import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/AntDesign';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import {asyncData, getHomePageData, getSubjectPageData} from '../../components/asyncData';

import AsyncStorage from '@react-native-community/async-storage';


class Subject extends Component{

  constructor(props){
    super(props);


    this.sayac = 0;
    this.getUrl = url();
    this.state = {
      data:[],
      users:[],
      count:[],
      popularSubjects:[],
      activeFoot:1,
      refreshing:false,
      fetchKontrol:false,
    }

    this.addSubjectAsync=0;


  }



  /*
  *
  *Component Did Mount Fetch
  *
  */

  componentDidMount(){

    var deger = this.props.page;
    this.getMail(deger);
  }


  storeData = async () => {

    if(this.state.fetchKontrol === true){
      try {
        await AsyncStorage.setItem('@subjectpagedata', JSON.stringify(this.state.data));
        await AsyncStorage.setItem('@subjectpageusers', JSON.stringify(this.state.users));
        await AsyncStorage.setItem('@subjectpagecount', JSON.stringify(this.state.count));
        await AsyncStorage.setItem('@subjectpagepopular', JSON.stringify(this.state.popularSubjects));

      } catch (e) {
        // saving error
        console.log("hata");
      }
    }
  }

  getAsyncData = () => {
    getSubjectPageData()
      .then(response => {

        this.setState({
          data:JSON.parse(response[0]),
          users:JSON.parse(response[1]),
          count:JSON.parse(response[2]),
          popularSubjects:JSON.parse(response[3]),
        })
      })
  }


  /*componentWillUnmount() {
    this._unsubscribe();
  }*/

  getMail(deger){
    asyncData()
      .then(response => {
        this.setState({
          mail:response[0],
        })

        if(deger===2){
          this.getAsyncData()
        }else {
          this.fetch()
        }
      })
  }


  refresh = (v) =>{
    if(v === 1){
        this.addSubjectAsync=0;
        this.fetch();
    }else {

    }

  }



  flatlistRefresh = () => {
    this.setState({
      refreshing:true,
    })
    this.addSubjectAsync=0;
    this.fetch();
  }


  async fetch(){
      var url = "http://192.168.1.104:8080/Subjects/subjects/";
      var value = {mail: this.state.mail}
      console.log(value);

      await fetch(url, {
        method: 'POST',
        body: JSON.stringify(value),
        headers:{
          'Content-Type': 'application/json',
        },
      }).then(response => response.json() )
        .then((response) => {
          console.log(response);
          this.addSubjectAsync=0;
          this.setState({
            data:response.Subject,
            users:response.Users,
            count:response.Count,
            popularSubjects: response.PopularSubjects,
            refreshing:false,
            fetchKontrol:true,
          })
      }).catch(error => console.log(error))
  }



  subjectLike = async (id) => {
    console.log(id);
    var url = this.getUrl + "Popularsubjects/add_popular_subjects/";
    console.log(url);

    var formData = new FormData()
    formData.append("id", id);
    formData.append("mail", this.state.mail)

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
            popularSubjects: response.popularSubjects,
            data: response.subjects,
          })
          this.fetch();
    })
  }











  /*
  *
  * RenderItem
  *
  */

  renderItem = ({item}) => {

    /*
    *Kullanıcı bilgileri alınıyor
    */
    var user = "";
    var path = "";
    var like = false;
    var id;
    for(let i=0; i<this.state.users.length;i++){
      if(item.Created_By === this.state.users[i].id){
        user = this.state.users[i].Kullanici_Adi;
        path = this.state.users[i].Image;
        id = this.state.users[i].id;
        break;
      }
    }

    /*
    * Ürünün beğenilen bir ürün olup olmadığı belirleiniyor
    */
    if(this.state.popularSubjects.length > 0){
      this.state.popularSubjects.map((v) => {
        if(v.Subject_Id === item.id){
          like = true;
        }
      })
    }

    /*
    *Kaç tane yorum olduğu hesaplanıyor
    */
    for(let i = 0; i < this.state.count.length;i++){
      //Gelen nesnenin key değerlerini aldık
      var a = Object.keys(this.state.count[i])
      var value = this.state.count[i];


      if(item.id.toString() === a[0]){
        //key değerinden veri aldık
        var commentCount = value[a[0]]
      }
    }


    var Date = item.Date.split("T")
    var date = Date[0]

    var Hour = Date[1].split(".")
    hour = Hour[0]

    var hour = hour.split("+")
    hour = hour[0];
    console.log(hour);




    return(

      <TouchableOpacity style={styles.renderItemButtonView}
        onPress = {() => this.props.navigation.navigate("Comment", {id:item.id})}
      >
        <View style={styles.renderItemView}>
          <TouchableOpacity style={{justifyContent:'center', marginBottom:2}}
              onPress={() => this.props.navigation.navigate("Profiles", {id:id})}
          >
            <Image
              style={{width:30, height:30, borderRadius:20}}
              resize='stretch'
              source = {{uri: "http://192.168.1.104:8080" + path}}
            />
          </TouchableOpacity>
          <View style={{justifyContent:'center'}}>
            <Text style={{fontWeight:'bold'}}>  {user}</Text>
          </View>
        </View>

        <View>
          <Text style={{fontSize:20, marginLeft:5}}>{item.Subject}</Text>
        </View>

        <View style={{flexDirection:'row', borderTopWidth:1, borderColor:"pink", marginLeft:5}}>
          <View style={{flex:1, justifyContent:'center', flexDirection:"row"}}>
            <View style={{justifyContent:'center'}}><Text style={styles.text}>{item.Like}</Text></View>
            <TouchableOpacity style={{justifyContent:'center', marginLeft:5}}
              onPress={() => this.subjectLike(item.id)}
            >

            {like === true ?
              <Foundation name="like" size={30} color="rgba(196,40,70,0.8)"/>
              :
              <Foundation name="like" size={30} color="rgba(196,40,70,0.3)"/>
            }

            </TouchableOpacity>

          </View>

          <View style={{flex:1, justifyContent:'center'}}>
            <Text style={styles.text}>{commentCount} Yorum</Text>
          </View>

          <View style={{flex:2, justifyContent:'center'}}>
            <Text style={styles.text}>{date} {hour}</Text>
          </View>
        </View>

      </TouchableOpacity>



    );

  }










  renderItemPopular = ({item}) =>{


    var isLiked=false;
    this.state.popularSubjects.map((value) => {
      if(item.id === value.Subject_Id){
        isLiked = true;
      }
    })

    if(isLiked === true){
      var user = "";
      var path = "";
      var like = false;
      var id;
      for(let i=0; i<this.state.users.length;i++){
        if(item.Created_By === this.state.users[i].id){
          user = this.state.users[i].Kullanici_Adi;
          path = this.state.users[i].Image;
          id = this.state.users[i].id;
          break;
        }
      }

      if(this.state.popularSubjects.length > 0){
        this.state.popularSubjects.map((v) => {
          if(v.Subject_Id === item.id){
            like = true;
          }
        })
      }


      for(let i = 0; i < this.state.count.length;i++){
        //Gelen nesnenin key değerlerini aldık
        var a = Object.keys(this.state.count[i])
        var value = this.state.count[i];


        if(item.id.toString() === a[0]){
          //key değerinden veri aldık
          var commentCount = value[a[0]]
        }
      }


      var Date = item.Date.split("T")
      var date = Date[0]

      var Hour = Date[1].split(".")
      hour = Hour[0]

      var hour = hour.split("+")
      hour = hour[0];
      console.log(hour);
      return(
        <TouchableOpacity style={styles.renderItemButtonView}
          onPress = {() => this.props.navigation.navigate("Comment", {id:item.id})}
        >
          <View style={styles.renderItemView}>
            <TouchableOpacity style={{justifyContent:'center', marginBottom:2}}
                onPress={() => this.props.navigation.navigate("Profiles", {id:id})}
            >
              <Image
                style={{width:30, height:30, borderRadius:20}}
                resize='stretch'
                source = {{uri: "http://192.168.1.104:8080" + path}}
              />
            </TouchableOpacity>
            <View style={{justifyContent:'center'}}>
              <Text style={{fontWeight:'bold'}}>  {user}</Text>
            </View>
          </View>

          <View>
            <Text style={{fontSize:20, marginLeft:5}}>{item.Subject}</Text>
          </View>

          <View style={{flexDirection:'row', borderTopWidth:1, borderColor:"pink", marginLeft:5}}>
            <View style={{flex:1, justifyContent:'center', flexDirection:"row"}}>
              <View style={{justifyContent:'center'}}><Text style={styles.text}>{item.Like}</Text></View>
              <TouchableOpacity style={{justifyContent:'center', marginLeft:5}}
                onPress={() => this.subjectLike(item.id)}
              >

              {like === true ?
                <Foundation name="like" size={30} color="rgba(196,40,70,0.8)"/>
                :
                <Foundation name="like" size={30} color="rgba(196,40,70,0.3)"/>
              }

              </TouchableOpacity>

            </View>

            <View style={{flex:1, justifyContent:'center'}}>
              <Text style={styles.text}>{commentCount} Yorum</Text>
            </View>

            <View style={{flex:2, justifyContent:'center'}}>
              <Text style={styles.text}>{date} {hour}</Text>
            </View>
          </View>

        </TouchableOpacity>
      );
    }else {
      return null;
    }
  }




  /*
  *
  *Render
  *
  */
  render(){

    if(this.state.fetchKontrol===true && this.addSubjectAsync===0){
      this.storeData();
      this.addSubjectAsync=1;
    }

    return(

      <Container>
        <Header
          style={styles.header}
          >

          <Body style={{marginLeft:20, }}>
            <Text style={styles.headerBodyText}>Sosyal Kampüs</Text>
          </Body>

          <Right>


            <TouchableOpacity
              onPress = {() => this.props.navigation.navigate("CreateSubject", {onGoBack:this.refresh})}
            >
              <Icon name="md-add-circle-outline" size={30} style={styles.icons}></Icon>
            </TouchableOpacity>

          {/*  <TouchableOpacity>
              <Icon name="md-options" size={30} style={styles.icons}></Icon>
            </TouchableOpacity>
          */}
          </Right>

        </Header>


        <Footer
          style={{height:25}}
        >

          <FooterTab style={{backgroundColor:'#f37f95'}}>
            <Button vertical
              active={this.state.activeFoot===1}
              onPress={() => this.setState({activeFoot:1})}
              style={{backgroundColor: this.state.activeFoot === 1 ? "#ffffff" : null,height:25, borderRadius:0}}
              >
              <Text style={styles.footerText}>KONULAR</Text>
            </Button>

            <Button vertical
              active={this.state.activeFoot===2}
              onPress={() => this.setState({activeFoot:2})}
              style={{backgroundColor: this.state.activeFoot === 2 ? "#ffffff" : null,height:25, borderRadius:0}}
              >
              <Text style={styles.footerText}>BEĞENİLER</Text>
            </Button>

          </FooterTab>
        </Footer>



        <View style={{marginBottom:60, flex:1}}>

        {this.state.activeFoot === 1 && this.state.data.length >= 0  ?

          <View style={styles.container}>
              <FlatList
                  data={this.state.data}
                  renderItem={this.renderItem}
                  keyExtractor={item=>item.id.toString()}
                  onRefresh={this.flatlistRefresh}
                  refreshing={this.state.refreshing}
              />
          </View>

          :

          <View style={styles.container}>
            <FlatList
                data={this.state.data}
                renderItem={this.renderItemPopular}
                keyExtractor={item=>item.id.toString()}
                onRefresh={this.flatlistRefresh}
                refreshing={this.state.refreshing}
            />
          </View>
        }



        </View>

        <StatusBar hidden={false} backgroundColor='#c42846' />
      </Container>


    );
  }
}

const styles = StyleSheet.create({
  borderSubject:{
    borderWidth:3,
    borderColor:'#c42846',
    justifyContent:'center',
    marginTop:10
  },
  container:{
    flex:1,
    margin:10,
  },
  textStyle:{
    fontSize:20,
    marginTop:5,
    marginBottom:5,
    marginLeft:5,
    fontWeight:'bold'
  },
  footerIcons:{
    color:'#ffffff',
  },
  footerText:{
    fontWeight:'bold',
  },
  header:{
    backgroundColor:'#c42846',
  },
  headerBodyText:{
    fontSize:20,
    fontWeight:"bold",
    fontFamily:'FFF_Tusj',
    color:'#ffffff',
  },
  icons:{
    marginLeft:15,
    color:'#ffffff'
  },
  text:{
    color:"rgba(0,0,0,0.5)",
    fontSize:16,
  },
  renderItemButtonView:{
    flexDirection:'column',
    marginTop:10,
    borderWidth:1,
    borderColor:"rgba(0,0,0,0.5)",
  },
  renderItemView:{
    flexDirection:'row',
    marginLeft:5,
    marginTop:5,
    borderBottomWidth:1,
    borderColor:'pink',
    marginBottom:2,
  },


});

export default Subject;
