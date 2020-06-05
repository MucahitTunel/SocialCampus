
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
  TextInput,
  BackHandler,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ToastAndroid
} from 'react-native';
import { Container, Button, Header, Body, Title, Right, Left, Footer, FooterTab, Content} from 'native-base';
import {get, url, post} from '../components/fetch';
import { YellowBox } from 'react-native'
import {asyncData} from '../components/asyncData';

import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/AntDesign';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

class Comments extends Component{

  constructor(props){
    super(props);

    this.scrollview = null;

    this.subjectId = this.props.route.params["id"];
    this.kontrol = false;

    this.getUrl = url();
    this.state = {
      mail:'',
      comment:"",
      commentData:[],
      subjectData:[],
      userData:[],
      dataNew:[],
      popularCommentList:[],
      fetch:0,
      keyboard:0,
    }

    this.handleComment = this.handleComment.bind(this);

  }


/*  UNSAFE_componentWillMount () {
  this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
  this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  UNSAFE_componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({
      keyboard:1,
    })
  }

  _keyboardDidHide = () => {
    this.setState({
      keyboard:0,
    })
  }
*/


  getMail(){
    asyncData()
      .then(response => {
        console.log(response);
        this.setState({
          mail:response[0],
        })
        this.fetchData();
      })
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
    /*var url = "http://192.168.1.107:8080/Activities/get_data/";
    let data = get(url);
    data.then(response => {
      console.log(response);
      this.setState({
        data:response
      })
    })*/
    this.getMail();

  }





  componentWillUnmount() {
    this.backHandler.remove();
  }

  /*
  *
  * LİKE COMMENT
  *
  */

  likeComment = async (id) => {
    var url = this.getUrl + "PopularComments/add_popular_comments/";
    var formData = new FormData()

    formData.append("SubjectId", this.subjectId);
    formData.append("CommentId", id);
    formData.append("Mail", this.state.mail);

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers:{
        'Content-Type': 'application/json',
      },
    }).then(response => response.json() )
      .then((response) => {
        console.log("***************************************************");
        console.log(response);
        console.log("***************************************************");
          this.setState({
            popularCommentList: response.popularComments,
            commentData: response.comments,
          })
    })
  }



  /*
  *
  * Comment Text Change
  *
  */

  handleComment = (v) => {
    this.setState({
      comment: v,
    })
  }


  /*
  *
  *Back Press
  *
  */
  back = () => {
    this.props.navigation.goBack();
    return true;
  }

  /*
  *
  * Button press
  *
  */

  pressButton = async () => {
    var url = this.getUrl + "Comments/add_comment/"

    var formData = new FormData();
    formData.append('id', this.subjectId)
    formData.append('mail', this.state.mail)
    formData.append('comment',this.state.comment)

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers:{
        'Content-Type': 'application/json',
      },
    }).then(response => response.json() )
      .then((response) => {
        var value = response.valueOf("message")
        if(value.message === "1"){
          this.setState({
            comment:"",
          })
          Alert.alert("Yorum eklendi");
          this.fetchData();
        }else {
          console.log("Hata oluştu");
        }
    }).catch(error =>  ToastAndroid.show(error, ToastAndroid.LONG));

  }


  /*
  *
  *Fetch Data
  *
  */

  async fetchData(){
    var url = this.getUrl + "Comments/comment/"
    var formData = new FormData();
    formData.append('id', this.subjectId)
    formData.append('mail', this.state.mail)

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
          commentData: response.comments,
          subjectData: response.subject,
          userData: response.users,
          popularCommentList: response.popular,
          fetch:1,
        })
    }).catch(error =>  ToastAndroid.show(error, ToastAndroid.LONG));
  }



  /*
  *
  *Render item
  *
  */

  renderItem = ({item}) => {

    /*
    *Kullanıcı bilgileri ve gönderinin beğenilip beğenilmediği işlemleri
    */
    console.log(this.state.popularCommentList);

    var id = item.Kullanici_Id;
    var username = "";
    var image = "";
    var like = false;
    var userId = 0;
    this.state.userData.map((v) => {
      if(v.id === id){
        username = v.Kullanici_Adi;
        image = v.Image;
        userId = v.id;
      }
    });

    if(this.state.popularCommentList.length > 0){
      this.state.popularCommentList.map((v) => {
        if(v.Comment_Id === item.id){
          like = true;
        }
      })
    }


    var data = item.Date.split("T")
    var data2 = data[1].split(".")

    var tarih = data[0];
    var saat = data2[0];

    return(

      <View style={{flexDirection:'column', marginTop:10}}>

        <View style={{flexDirection:'row', marginLeft:5,marginTop:5, borderBottomWidth:1, borderColor:'pink', marginBottom:2}}>
          <TouchableOpacity style={{justifyContent:'center', marginBottom:2}}
              onPress={() => this.props.navigation.navigate("Profiles", {id:userId})}
          >
            <Image
              style={{width:30, height:30, borderRadius:20}}
              resize='stretch'
              source = {{uri: "http://192.168.1.104:8080" + image}}
            />
          </TouchableOpacity>
          <View style={{justifyContent:'center'}}>
            <Text style={{fontWeight:'bold'}}>  {username}</Text>
          </View>
        </View>


        <View style={{flexDirection:'row'}}>
          <View style={{flex:1}}><Text style={{fontSize:16}}>{item.Comment}</Text></View>
          <View style={{width:50, alignItems:'center', justifyContent:'center'}}>
            <TouchableOpacity
              onPress = {() => this.likeComment(item.id)}
            >
              {like === true ?
                <Icons name="heart" size={15} color="rgba(196,40,70,0.8)"></Icons>
                :
                <Icons name="heart" size={15} color="rgba(0,0,0,0.5)"></Icons>
              }

            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.likeColumn}>
          <View style={{flex:1}}><Text style={{color:'rgba(0,0,0,0.5)'}}>{item.Like}  beğeni</Text></View>

          <View style={{flex:1}}><Text style={{color:'rgba(0,0,0,0.5)'}}>{tarih} / {saat}</Text></View>

        </View>


      </View>

    );
  }



  /*
  *
  * Process render Item
  *
  */


  /*ref={ref => {this.scrollView = ref}}
  onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}*/


  render(){


    /*
    *
    *
    * Return
    *
    */

    return(

      <Container
        style={{marginBottom:5}}
      >

          <Header
            style={styles.header}
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

            <Right style={{marginRight:20, }}>
              <Text style={styles.headerBodyText}>Yorumlar</Text>
            </Right>

          </Header>

          <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center'}} behavior="height" enabled   keyboardVerticalOffset={30}>


            <ScrollView>
              <View style={{margin:10}}>
                {this.state.subjectData.map((v,k) => {
                    var data = v.Date.split("T")
                    var data2 = data[1].split(".")
                    var tarih = data[0];
                    var saat = data2[0];

                    return(
                      <View style={styles.commentViewBox} key={k}>
                        <View style={{flexDirection:'row'}}>
                          <View style={{flex:1}}><Text style={styles.commentText}>{v.Subject}</Text></View>

                        </View>

                        <View style={styles.likeColumn}>
                          <View style={{flex:1}}><Text>{v.Like}  beğeni</Text></View>

                          <View style={{flex:1}}><Text>{tarih} / {saat}</Text></View>

                        </View>


                      </View>
                    );
                })}

                <FlatList
                  data = {this.state.commentData}
                  keyExtractor={item => item.id.toString()}
                  renderItem={this.renderItem}
                />


              </View>
            </ScrollView>

            <View style={{flexDirection:'row', height:50, marginLeft:5, justifyContent:'center', marginTop:10}}>
              <View style={{flex:3, justifyContent:'center'}}>
                <TextInput
                  style={{borderRadius:30, borderWidth:1, marginLeft:5}}
                  pointerevents="none"
                  placeholder="Yorum Yap"
                  value={this.state.comment}
                  onChangeText={this.handleComment}
                />
              </View>
              <TouchableOpacity
                style={{justifyContent:'center', marginLeft:5, marginRight:5}}
                onPress={this.pressButton}
                >
                <MaterialIcon name="send" size={40}/>
              </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>


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
    marginBottom:5
  },
  commentText:{
    fontSize:20,
    fontWeight:'bold',
  },
  commentViewBox:{
    flexDirection:'column',
    borderBottomWidth:2,
    borderColor:'#c42846',
  },
  likeColumn:{
    flexDirection:'row',
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

export default Comments;
