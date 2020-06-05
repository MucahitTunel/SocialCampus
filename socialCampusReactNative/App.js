/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from "./src/screens/Login";
import RegisterScreen from './src/screens/Register';
import ForgetPasswordScreen from './src/screens/ForgetPassword';
import HomeScreen from './src/screens/Home';
import CreateActivityScreen from './src/screens/CreateActivity';
import DetailScreen from './src/screens/Detail';
import CreateSubjectScreen from './src/screens/CreateSubject';
import CommentScreen from './src/screens/Comments';
import ProfilesScreen from './src/screens/Profiles';
import PrivateMessageScreen from './src/screens/PrivateMessage';
import CreateMarketScreen from './src/screens/CreateMarket';
import MarketDetailScreen from './src/screens/DetailMarket';
import EditMarketScreen from './src/screens/EditMarket';
import EditProfileScreen from './src/screens/EditProfile'
import MessageListScreen from './src/screens/MessageList';

import SubjectScreen from './src/screens/footer/Subject';

import BlocksScreen from './src/screens/settings/Blocks';
import ActivityScreen from './src/screens/settings/Activities';
import MySubjectsScreen from './src/screens/settings/MySubjects';


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        headerMode="none"
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateActivity" component={CreateActivityScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="CreateSubject" component={CreateSubjectScreen} />
        <Stack.Screen name="Subject" component={SubjectScreen} />
        <Stack.Screen name="Comment" component={CommentScreen} />
        <Stack.Screen name="Profiles" component={ProfilesScreen} />
        <Stack.Screen name="PrivateMessage" component={PrivateMessageScreen} />
        <Stack.Screen name="CreateMarket" component={CreateMarketScreen} />
        <Stack.Screen name="DetailMarket" component={MarketDetailScreen} />
        <Stack.Screen name="EditMarket" component={EditMarketScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="MessageList" component={MessageListScreen} />
        <Stack.Screen name="Blocks" component={BlocksScreen} />
        <Stack.Screen name="Activities" component={ActivityScreen} />
        <Stack.Screen name="MySubjects" component={MySubjectsScreen} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}



export default App;
