//Concept and code reference credits to Aditya's tutorials and freecodecamp
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import React, { useEffect, useReducer, useRef, useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';


import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  NativeModules,
  Dimensions, 
} from "react-native";

//setting our initial app state
const cameraState = {
  cameraType: "back",
  flash: "off",
  zoomValue: 0,
};

const winHeight = Dimensions.get('window').height;
const winWidth = Dimensions.get('window').width;

export default function App() {



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

//function for clicking picture
  const clickPicture = async () => {    
      let photo = await camera.current.takePictureAsync();
      const image_location = photo.uri; //store the cache location of the image
      camera.current.pausePreview();
      await savePicture(image_location); //save it to the camera roll
      camera.current.resumePreview();
  };

//saving the image to camera roll
  const savePicture = async (photo: string) => {
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
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Please provide access to your camera</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor:  "#e6f3ff"}}>
      <StatusBar/>
      <View style = {{flex:.5, flexDirection: "row", display: 'flex', alignItems: "center", justifyContent: "space-between"}}> 
      <Text style = {{fontFamily: "monospace", fontSize: 25, fontWeight: "bold", color: "#8187FD", margin: "1%", alignSelf:"center", marginLeft: "auto", marginRight: "auto"}}>VIZABLE</Text>
      <Ionicons name = 'information-circle-sharp' style = {{ color: '#8187FD', fontSize: 36, marginRight: "2%"}}></Ionicons>
      </View>
      <Camera
        ref={camera}
        style={{ flex: 5}}
        type={cameraType}
      />     
      <TouchableOpacity  style = {styles.btnSub} onPress = {clickPicture} >
        <Text style = {{fontSize: 20, adjustFontSizeToFit: true, allowFontScaling: true, fontWeight: "bold", color: "white", opacity: 1}}>Take Picture</Text>
      </TouchableOpacity> 
      </View>
      


  );
  
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
