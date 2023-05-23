import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import {Button, StyleSheet, Text, View, Image, Modal, Pressable,TextInput} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Stack = createNativeStackNavigator();




const SettingsScreen = ({navigation}) => {

  const getItem = async () => {
    return await AsyncStorage.getItem('apiuri')
  }
  
  
  const handleText = async (e) => {
    AsyncStorage.setItem('apiuri', e)
    console.log(await AsyncStorage.getItem('apiuri'))
  }



  return(
  <View style={styles.container}>
    <Text style={{ fontWeight: 600, fontSize: 18 }}>API URI: </Text>
    <TextInput
        style={styles.input}
        onChangeText={handleText}
        value={getItem()}
      />
    <StatusBar style="auto" />
  </View>
  )
  
}

const HomeScreen = ({navigation}) => {
  const [response, setResponse] = useState("N/A")
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  
    const handleSubmit = async () => {
      setModalVisible(true);
       
      //get base64 encoded
      const getbase64 = (dataURL) => {
       return dataURL.replace('data:', '').replace(/^.+,/, '');
       }

      //get dataurl
      function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
          var reader = new FileReader();
          reader.onloadend = function() {
            callback(reader.result);
          }
          reader.readAsDataURL(xhr.response);
        };
        xhr.open('POST', url);
        xhr.responseType = 'blob';
        xhr.send();
      }
    //apiuri
    
    let apiuri = await AsyncStorage.getItem("apiuri")
    console.log("api uri : " + apiuri)
      
     toDataURL(image, function(dataUrl) {
      
     let encoded = getbase64(dataUrl)
     //console.log(encoded)
     const formData = new FormData();
     
     formData.append('filename', "Image");
     formData.append('filedata', encoded);
 
     const options = {
       method: 'POST',
       body: formData,
       // If you add this, upload won't work
       // headers: {
       //   'Content-Type': 'multipart/form-data',
       // }
     };
     
     //SEND TO API
     
     fetch(apiuri, options)
     .then(data => {
      data.json().then(data => {console.log(data.prediction)
      setResponse(data.prediction)}
      )
    })
     
    
 
    })
      
     
   

    
      console.log("reached")
      

    

    }

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      })
      console.log(result);
    
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    }

  return(
  <>

        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>

        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{fontWeight: 600, fontSize: 24, marginBottom: 10}}>Predicted Text : </Text>
            <Text style={styles.modalText}>{response}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      



  <View style={styles.container}>
    <StatusBar style="auto" />
    {/* Image */}
   
    <Text style={{ fontWeight: 600, fontSize: 24 }}>Selected Image:</Text>
    <View style={{margin:10,height: 200, width: 300, borderWidth: 2, }}>
    <Image style={{ height: 196, width: 296, resizeMode: 'contain' }} source={{
          uri: image,
        }} />
    </View>
   

    {/* Buttons */}
    <View style={{ marginTop: 100 }}>
    <View style={{ margin: 10, width: 120}}>
    <Button 
    title="Choose Photo"
    onPress={pickImage}
    />
    </View>

    <View style={{ margin: 10, width: 120}}>
    <Button onPress={handleSubmit}
    title="Read"
    
    />
    
    </View>
    </View>

    <View style={{ width: 120 ,margin: 10}}>
    <Button 
    title="Settings"
    onPress={() =>
      navigation.navigate('Settings')
    }/>
    </View>

  </View>
  
  </>
  )
}




export default function App() {


    return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'WriteScanner by 4BUGSMASHERS'}}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
    {/* Rest of your app code */}
    

}

const styles = StyleSheet.create({

  

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: 250,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: 80,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  input: {
    height: 40,
    width: 250,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },


});
