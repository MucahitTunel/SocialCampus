import React, {Component} from 'react';
import {SafeAreaView,View, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList, ScrollView, BackHandler, Alert, YellowBox} from 'react-native';
import { Container, Button, Header, Body, Title, Right, Left, Footer, FooterTab, Content} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/AntDesign';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import HomePage from './footer/HomePage';
import Subject from './footer/Subject';
import Discovery from './footer/Discovery';
import Search from './footer/Search';
import Profile from './footer/Profile';
import Market from './footer/Market'

YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])


class Home extends Component{

  constructor(props){
    super(props);
    this.homepage = 0;
    this.subjectpage=0;
    this.marketpage=0;
    this.profilpage=0;

    this.state={
      activeFoot: 1,
    }

  }

  componentDidMount(){
    this.backHandler = BackHandler.addEventListener(
     "hardwareBackPress",
     this.back
   );
  }


  componentWillUnmount() {
    this.backHandler.remove();
  }

  /*
  *Uygulamadan çıkarken gösterilen mesaj
  */
  back = () => {

    Alert.alert(
      'Çıkış',
      'Uygulamadan çıkmak istediğinizden emin misiniz?',
      [

        {text: 'İptal', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Evet', onPress: () => BackHandler.exitApp()},
      ],
      { cancelable: false }
    )

    return true;
  }




  render(){

    var {navigation} = this.props;

    return(

        <Container>

            <Content
              scrollEnabled={false}
              style={{marginBottom:5}}
            >
              <SafeAreaView>
              {this.state.activeFoot === 1 && <HomePage navigation={navigation} page={this.homepage}/>}
              {this.state.activeFoot === 2 && <Subject navigation={navigation} page={this.subjectpage}/>}
              {this.state.activeFoot === 3 && <Search navigation={navigation} />}
              {this.state.activeFoot === 5 && <Profile navigation={navigation} page={this.profilpage}/>}
              {this.state.activeFoot === 6 && <Market navigation={navigation}/>}
              </SafeAreaView>
            </Content>


            <Footer>
              <FooterTab style={{backgroundColor:'#c42846'}}>
                <Button vertical
                  active={this.state.activeFoot===1}
                  onPress={() => {
                    this.setState({activeFoot:1})
                    if(this.subjectpage === 0){
                    }else {this.subjectpage=2;}

                    if(this.profilpage === 0){}
                    else{this.profilpage=2;}

                  }}
                  style={{backgroundColor: this.state.activeFoot === 1 ? "#000000" : null, height:55, borderRadius:0}}
                  >
                  <Icons name="home" size={20} style={styles.footerIcons}/>
                </Button>

                <Button vertical active={this.state.activeFoot===2} onPress={() => {
                  this.setState({activeFoot:2});
                  this.homepage=1;
                  if(this.subjectpage===2){
                  }else {
                    this.subjectpage=1;
                  }

                  if(this.profilpage === 0){}
                  else{this.profilpage=2;}

                }}
                style={{backgroundColor: this.state.activeFoot === 2 ? "#000000" : null, height:55, borderRadius:0}}
                >
                  <MaterialIcon name="explore" size={25} style={styles.footerIcons}/>
                </Button>

                <Button vertical active={this.state.activeFoot===3} onPress={() => {
                  this.setState({activeFoot:3});
                  this.homepage=1;
                  if(this.subjectpage === 0){
                  }else {
                    this.subjectpage=2;
                  }

                  if(this.profilpage === 0){}
                  else{this.profilpage=2;}
                }}
                style={{backgroundColor: this.state.activeFoot === 3 ? "#000000" : null, height:55, borderRadius:0}}
                >
                  <Icon name="md-search" size={30} style={styles.icons}></Icon>
                </Button>


                <Button vertical active={this.state.activeFoot===6} onPress={() => {
                  this.setState({activeFoot:6});
                  this.homepage=1;
                  if(this.subjectpage === 0){
                  }else {
                    this.subjectpage=2;
                  }

                  if(this.profilpage === 0){}
                  else{this.profilpage=2;}
                }}
                style={{backgroundColor: this.state.activeFoot === 6 ? "#000000" : null, height:55, borderRadius:0}}
                >
                  <Fontisto name="shopping-basket" size={20} style={styles.footerIcons}/>
                </Button>

                <Button vertical active={this.state.activeFoot===5} onPress={() => {
                  this.setState({activeFoot:5});
                  this.homepage=1;

                  if(this.subjectpage === 0){
                  }else {
                    this.subjectpage=2;
                  }

                  if(this.profilpage===2){
                  }else {
                    this.profilpage=1;
                  }
                }}
                style={{backgroundColor: this.state.activeFoot === 5 ? "#000000" : null, height:55, borderRadius:0}}
                >
                  <Fontisto name="person" size={20} style={styles.footerIcons}/>
                </Button>


              </FooterTab>

            </Footer>

            <StatusBar hidden={false} backgroundColor='#c42846'/>
        </Container>

    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  footerIcons:{
    color:'#ffffff',
  },
  footerText:{
    color:'#ffffff',
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
  icons:{
    marginLeft:15,
    color:'#ffffff'
  },


})


export default Home;
