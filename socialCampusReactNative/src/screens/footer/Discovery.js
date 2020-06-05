
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
  TouchableOpacity
} from 'react-native';
import Constants from '../../../Constants';
import {get, url} from '../../components/fetch';

class Discovery extends Component{

  constructor(props){
    super(props);

    this.url = url();
    this.state = {
      data:[],
      dataNew:[],
    }

  }

  render(){
    return(
        <View style={styles.container}>
          <Text>Discovery</Text>

        </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },

});

export default Discovery;
