import AsyncStorage from '@react-native-community/async-storage';

export async function asyncData(){

  try {
    const mail = await AsyncStorage.getItem('@eMail')
    const password = await AsyncStorage.getItem('@password')

    return ([mail,password])

  } catch(e) {
    // error reading value
  }
}

export async function getHomePageData(){
  try {
    const homepage = await AsyncStorage.getItem('@homepage')

    return homepage;

  } catch(e) {
    // error reading value
  }
}

export async function getSubjectPageData(){
  try {
    const data = await AsyncStorage.getItem('@subjectpagedata')
    const count = await AsyncStorage.getItem('@subjectpagecount')
    const users = await AsyncStorage.getItem('@subjectpageusers')
    const popular = await AsyncStorage.getItem('@subjectpagepopular')

    return ([data,users,count,popular]);

  } catch(e) {
    // error reading value
  }
}

export async function getProfilPageData(){
  try {
    const data = await AsyncStorage.getItem('@profilpagedata')
    return (data);

  } catch(e) {
    // error reading value
  }
}
