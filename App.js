import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState({
    latitude: 65.0800,
    longitude: 25.4800,
    latitudeDelta: 1.9220,
    longitudeDelta: 0.0421,
  });
  
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    (async () => {
      getUserPosition();
    })();
  }, []);

  const getUserPosition = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    try {
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation({
        ...location,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLongPress = (event) => {
    console.log("Long press detected:", event.nativeEvent.coordinate);
    const newMarker = event.nativeEvent.coordinate;
    setMarkers([...markers, newMarker]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={location}
        mapType="hybrid"
        onLongPress={handleLongPress}
      >
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker} />
        ))}
      </MapView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
