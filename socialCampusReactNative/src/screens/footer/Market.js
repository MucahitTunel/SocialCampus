
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

import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/AntDesign';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {asyncData} from '../../components/asyncData';
import Loading from '../../components/Loading';
import MyIcons from '../../components/icons';


class Market extends Component{

  constructor(props){
    super(props);

    this.active = null;


    this.getUrl = url();
    this.state = {
      marketdata:[],
      urundata:[],
      favdata:[],
      activeFoot:1,
      fetchmarket:0,
      fetchurun:0,
      fetchfav:0,
      mail:'',
      categories:["Elektronik","Ev-Bahçe","Spor","Eğlence","Araç","Moda-Aksesuar","Bebek-Çocuk","Film-Kitap-Müzik","Diğer"],
      refreshing:false,
      loading:false,
      filter:false,
    }
  }

  /*
  *
  *Component Did Mount
  *
  */

  componentDidMount(){
    this.getMail();
    this.getData();
  }

  /*
  *Mail adresi alındı
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
  *Refresh
  */
  flatlistRefresh = () => {
    this.setState({
      refreshing: true,
    })
    this.getData();
  }


  /*
  *onGoback
  */
  refreshnew = (isAdd,isLike) => {
    console.log("refresh new: " + isAdd);
    console.log(isLike);
    if(isAdd === true){
      this.getData();
    }

    if(isLike === true){
      this.setState({
        fetchfav: 0,
      })
    }
  }

  /*
  *Veritabanı işlemleri,
  *Hangi buton aktifse ona göre fetch işlemi gerçekleşiyor
  */
  getData = async () => {

    if(this.state.activeFoot===1){
      var url = this.getUrl+"Market/getMarket/";
      let data = get(url);
      data.then(response => {
        console.log(response);
        this.setState({
          marketdata:response,
          fetchmarket:1,
          refreshing:false,
          loading:false,
        })
      }).catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
    }else if (this.state.activeFoot === 2) {
      var formData = new FormData();
      formData.append("Mail", this.state.mail)
      var url = this.getUrl + "Market/getMyMarket/"

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
            urundata: response,
            fetchurun:1,
            refreshing:false,
            loading:false,
          })
      }).catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
    }else {
      console.log("else şartı");
      var formData = new FormData();
      formData.append("Mail", this.state.mail)
      var url = this.getUrl + "Market/getmyfav/"

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
            favdata: response,
            fetchfav:1,
            refreshing:false,
            loading:false,
          })
      }).catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
    }


  }


  /*
  *Sayfa refresh
  */
  refresh = (v) =>{
    console.log("refresh");
    console.log(v);
    if(v === true){

      this.setState({
        fetchurun:0,
        fetchmarket:0,
      })
    }else {

    }
  }

  /*
  *Filtreleme yapılıyor
  */
  activation = (v) => {
    console.log(this.state.categories[v]);
    this.active = v;
    this.setState({
      refreshing:true,
      filter:true,
    })
    this.filterFetch(v);
  }

  /*
  *Filtreleme iptal
  */
  cancelFilter = () => {
    this.active = null;
    this.setState({
      filter:false,
      refreshing:true,
    })

    this.getData();
  }



  filterFetch = async (v) => {
    var url = this.getUrl + "Market/getfilter/";
    var value = {type:this.state.categories[v]};

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(value),
      headers:{
        'Content-Type': 'application/json',
      },
    }).then(response => response.json() )
      .then((response) => {

        console.log(response);
        this.setState({
          marketdata:response,
          fetchmarket:1,
          refreshing:false,
          loading:false,
        })

    }).catch(error => ToastAndroid.show(error, ToastAndroid.LONG) );
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
          onPress={() => this.props.navigation.navigate("DetailMarket", {id:item.Market_Id, onGoBack:this.refreshnew})}
        >
            <Image
              style={styles.image}
              resize='stretch'
              source = {{uri: "http://192.168.1.104:8080" + item.Image}}
            />
        </TouchableOpacity>
      </View>
    );
  }


  render(){

    if(this.state.activeFoot === 2 && this.state.fetchurun === 0){

      this.getData();
    }
    if(this.state.activeFoot === 1 && this.state.fetchmarket === 0){

      this.getData();
    }

    if(this.state.activeFoot === 3 && this.state.fetchfav === 0){

      this.getData();
    }








    if(this.state.mail === ""){
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
              onPress = {() => this.props.navigation.navigate("CreateMarket", {onGoBack: this.refresh})}
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
              onPress={() => this.setState({activeFoot:1,
                                            fetchfav:0})}
              style={{backgroundColor: this.state.activeFoot === 1 ? "#ffffff" : null,height:25, borderRadius:0}}
              >
              <Text style={styles.text}>MARKET</Text>
            </Button>

            <Button vertical
              active={this.state.activeFoot===2}
              onPress={() => this.setState({activeFoot:2,
                                            fetchfav:0})}
              style={{backgroundColor: this.state.activeFoot === 2 ? "#ffffff" : null,height:25, borderRadius:0}}
              >
              <Text style={styles.text}>ÜRÜNLERİM</Text>
            </Button>

            <Button vertical
              active={this.state.activeFoot===3}
              onPress={() => this.setState({activeFoot:3})}
              style={{backgroundColor: this.state.activeFoot === 3 ? "#ffffff" : null,height:25, borderRadius:0}}
              >
              <Text style={styles.text}>FAVORİLER</Text>
            </Button>
          </FooterTab>
        </Footer>


        </Container>

      );
    }else {
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
                onPress = {() => this.props.navigation.navigate("CreateMarket", {onGoBack: this.refresh})}
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
                <Text style={styles.text}>MARKET</Text>
              </Button>

              <Button vertical
                active={this.state.activeFoot===2}
                onPress={() => this.setState({activeFoot:2})}
                style={{backgroundColor: this.state.activeFoot === 2 ? "#ffffff" : null,height:25, borderRadius:0}}
                >
                <Text style={styles.text}>ÜRÜNLERİM</Text>
              </Button>

              <Button vertical
                active={this.state.activeFoot===3}
                onPress={() => this.setState({activeFoot:3})}
                style={{backgroundColor: this.state.activeFoot === 3 ? "#ffffff" : null,height:25, borderRadius:0}}
                >
                <Text style={styles.text}>FAVORİLER</Text>
              </Button>
            </FooterTab>
          </Footer>

          <View style={{flex:1}}>

            {this.state.activeFoot === 1 ?
              <View style={styles.categoryStyle}>
                {this.state.filter === false ?
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

                    <MyIcons activation={this.activation}/>
                  </ScrollView>
                  :
                  <View style={styles.filterTrue}>
                    <View>
                      <Text style={{fontSize:20, color:'rgba(0,0,0,0.5)'}}>{this.state.categories[this.active]}</Text>
                    </View>
                    <TouchableOpacity style={{marginLeft:10, marginRight:10}}
                      onPress={this.cancelFilter}
                    >
                      <Text style={{fontSize:20, color:'rgba(0,0,0,1)'}}>x</Text>
                    </TouchableOpacity>
                  </View>
                }
              </View>

              :

              null
            }



            <View style={{flex:1}}>

            {this.state.activeFoot===1 && this.state.fetchmarket === 1 ?
              <View style={styles.container}>
                <FlatList
                    data={this.state.marketdata}
                    numColumns={2}
                    renderItem={this.renderItem}
                    keyExtractor={item=>item.id.toString()}
                    scrollEnabled={false}
                    onRefresh={this.flatlistRefresh}
                    refreshing={this.state.refreshing}
                />
              </View>

              :

              <View style={{marginLeft:10, marginTop:5}}>
                {this.state.activeFoot===2 && this.state.fetchurun===1 ?
                    <FlatList
                        data={this.state.urundata}
                        numColumns={2}
                        renderItem={this.renderItem}
                        keyExtractor={item=>item.id.toString()}
                        scrollEnabled={false}
                        onRefresh={this.flatlistRefresh}
                        refreshing={this.state.refreshing}
                    />


                  :

                  <View>
                    {this.state.activeFoot === 3 && this.state.fetchfav === 1 ?
                      <FlatList
                          data={this.state.favdata}
                          numColumns={2}
                          renderItem={this.renderItem}
                          keyExtractor={item=>item.id.toString()}
                          scrollEnabled={false}
                          onRefresh={this.flatlistRefresh}
                          refreshing={this.state.refreshing}
                      />

                      :

                      null
                    }
                  </View>
                }

              </View>
            }

            </View>

          </View>

          {this.state.loading === true && <Loading />}


        </Container>

      );
    }

  }
}

const styles = StyleSheet.create({
  categoryStyle:{
    height:70,
    justifyContent:'center',
    backgroundColor:'#e1e3e8',
  },
  container:{
    flex:1,
    marginLeft:10,
    marginRight:10,
    marginTop:5,
    marginBottom:5
  },
  renderBoxButton:{
    margin:5,
    borderWidth:1,
  },
  header:{
    backgroundColor:'#c42846',
  },
  icons:{
    marginLeft:15,
    color:'#ffffff'
  },
  filterTrue:{
    justifyContent:'center',
    height:30 ,
    flexDirection:'row',
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.5)',
    borderRadius:10,
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
  image:{
    width:Constants.MAX_WIDTH/2-20,
    height: Constants.MAX_WIDTH/2-20,
  },
  text:{
    fontWeight:'bold',
  },



});

export default Market;
