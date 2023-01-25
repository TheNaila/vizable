import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import React, { useEffect, useReducer, useRef, useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
<<<<<<< HEAD
=======
import { Audio } from 'expo-av';

>>>>>>> 18c7a2912d152f3459d002788885c5350d27854c


import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  NativeModules,
  Dimensions,
  LogBox
} from "react-native";

LogBox.ignoreAllLogs();
//setting our initial app state
const cameraState = {
  cameraType: "back",
  flash: "off",
  zoomValue: 0,
};

const winHeight = Dimensions.get('window').height;
const winWidth = Dimensions.get('window').width;



<<<<<<< HEAD
export default function App() {

=======


export default function App() {

  //for adding the sound
  const [sound, setSound] = React.useState();


>>>>>>> 18c7a2912d152f3459d002788885c5350d27854c
  const deviceLanguage =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13 // make diff selection
        : NativeModules.I18nManager.localeIdentifier;
        
  state = cameraState;

//checking device permissions for camera
  const [hasPermission, setHasPermission] = useState(null);
  const { cameraType } = state;

  const camera =  useRef();

<<<<<<< HEAD
  const [showCaption, setScaption] = useState(false)
=======
  const [showCaption, setScaption] = useState(false);
>>>>>>> 18c7a2912d152f3459d002788885c5350d27854c
  

//function for clicking picture
  const clickPicture = async () => {    
      let photo = await camera.current.takePictureAsync();
      const image_location = photo.uri; //store the cache location of the image
      //maybe change 
      setScaption(true)
      camera.current.pausePreview();
      await savePicture(image_location); //save it to the camera roll
      camera.current.resumePreview();
<<<<<<< HEAD
      

=======
      playSound(); //here's where the sound is played
>>>>>>> 18c7a2912d152f3459d002788885c5350d27854c
  };
//Function to load the recording and play the sound 
  async function playSound() {
    console.log('Recording is being played');
    const { sound } = await Audio.Sound.createAsync( require('./recording/caption_recording.mp3') //CHANGE HERE
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

//saving the image to camera roll
  const savePicture = async (photo) => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY); 
    //write status, we will need read status later for python script
    if (status === "granted") {
      const assert = await MediaLibrary.createAssetAsync(photo);
      await MediaLibrary.createAlbumAsync("Vizapp", assert); //creates an album called vizapp in user's gallery
      console.log("taken picture");
    } else {
      console.log("Please provide permission to use the gallery to store picture");
    }
  };

//here is where we ask our user to grant permissions
    useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
//here is where the app works on restarting the sound
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);


  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Please provide access to your camera</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor:  "#e6f3ff"}}>
      <StatusBar/>
      <View style = {{flexDirection: "row"}}>
        <Text style ={{flex:1, fontFamily: "monospace", fontSize: 25, fontWeight: "bold", color: "#8187FD", textAlign: "center", marginLeft: "4%", marginVertical: "1%"}}> Vizable</Text>
        <Ionicons name = 'information-circle-sharp' style ={{fontSize: 34,alignSelf: "center",marginRight: "2%", color: '#8187FD' }}></Ionicons>
      </View>
      
      {/* {<!--Caption component -->} */}
      <Camera
        ref={camera}
        style={{ flex:1}} //change back 
        type={cameraType}
      />     
      { showCaption &&
<<<<<<< HEAD
        <View style = {{height: 100,width: winWidth*.95,  backgroundColor: 'white', borderRadius: 8, alignSelf: "center",position: "absolute", top: 60, paddingHorizontal: "2%"}}> 
<<<<<<< HEAD
        <Text>
          Ipsum Loremmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
=======
        <Text style = {{fontSize: 20, adjustFontSizeToFit: true, allowFontScaling: true, fontWeight: "bold", color: "black", opacity: 1}} >
          Dim desk with chocolate and flask and books
//           CHANGE HERE 
>>>>>>> 18c7a2912d152f3459d002788885c5350d27854c
=======
        <View style = {{height: winHeight*.1,width: winWidth*.95,  backgroundColor: 'white', borderRadius: 8, alignSelf: "center",position: "absolute", top: 60, paddingHorizontal: "2%"}}> 
        <Text >
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
>>>>>>> dfedeea1e035095b2b6890e70579b376fc6e6bfd
        </Text>
        </View>
      }
      <TouchableOpacity  style = {styles.btnSub} onPress = {clickPicture} >
        <Ionicons name = 'camera-sharp' style = {{fontSize: 60, color: '#FAEAFB'}}></Ionicons>
      </TouchableOpacity>
      
      
      </View>
      


  );
<<<<<<< HEAD
<<<<<<< HEAD
  
}
//responsive text
const styles = StyleSheet.create({
  btnSub: {
    width: winWidth*.95,
    height: winHeight*.13,
    alignSelf: 'center',
    maxHeight: 300,
    backgroundColor: "rgba(29, 40, 251, .7)",
    alignItems: "center",
    justifyContent: "center", 
    marginHorizontal: "2%", //need to center it 
    position: "absolute",
    bottom: winHeight*.02,
    borderRadius: 8,

  }
})
=======
}
>>>>>>> c7df52938d44dad8c49e2a36cf4aca6c6102b761
=======
  
}
//responsive text
const styles = StyleSheet.create({
  btnSub: {
    width: winWidth*.95,
    height: winHeight*.13,
    alignSelf: 'center',
    maxHeight: 300,
    backgroundColor: "rgba(29, 40, 251, .7)",
    alignItems: "center",
    justifyContent: "center", 
    marginHorizontal: "2%", //need to center it 
    position: "absolute",
    bottom: winHeight*.02,
    borderRadius: 8,

  }
})
>>>>>>> 18c7a2912d152f3459d002788885c5350d27854c
