//Concept and code reference credits to Aditya's tutorials and freecodecamp
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import React, { useEffect, useReducer, useRef, useState } from "react";

import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Platform,
  NativeModules,
} from "react-native";

//setting our initial app state
const cameraState = {
  cameraType: "back",
  flash: "off",
  zoomValue: 0,
};

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
//#E5E5E5

  return (
    <View style={{ flex: 1 }}>
      <StatusBar/>
      <View style={{flex:.5, backgroundColor: "#14213D", justifyContent:"center"}}>
        <Image source = {require("./logo2-250.png")} style={{alignSelf:"center", flex:1}}/>
      </View>
      <Text style = {{flex: 1, backgroundColor: "#E5E5E5", marginVertical: 10, marginVertical: 10, adjustFontSizeToFit:true, allowFontScaling:true} }> 
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
      {'\n'}
      {'\n'}
      {deviceLanguage}
      </Text>
      <Camera
        ref={camera}
        style={{ flex: 3 }}
        type={cameraType}
      />
      <TouchableOpacity  style = {styles.btnSub} onPress = {clickPicture} >
        <Text style = {{fontSize: 20, adjustFontSizeToFit: true, allowFontScaling: true, fontWeight: "bold", color: "white"}}>My button</Text>
      </TouchableOpacity>
      
      </View>


  );
  
}

const styles = StyleSheet.create({
  btnSub: {
    flex: 1, 
    backgroundColor: "#14213D",
    alignItems: "center",
    justifyContent: "center",
    
  }
})
