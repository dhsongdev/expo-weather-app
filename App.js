import * as Location from "expo-location";

import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";

const WINDOW_WIDTH = Dimensions.get("window").width;

export default function App() {
  const [city, setCity] = useState("getting your location..");
  const [permission, setPermission] = useState(true);

  const getLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setPermission(false);
      setCity("unknown");
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({
      accuracy: 5,
    });
    const location = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    setCity(location[0].city);
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        ContentContainerStyle={styles.weather}
        pagingEnabled
      >
        <View style={styles.day}>
          <Text style={styles.temp}>11</Text>
          <Text style={styles.description}>rainny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>12</Text>
          <Text style={styles.description}>rainny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>13</Text>
          <Text style={styles.description}>rainny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>14</Text>
          <Text style={styles.description}>rainny</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "yellow",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 70,
  },
  weather: {
    backgroundColor: "grey",
  },
  day: {
    width: WINDOW_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  temp: {
    fontSize: "60",
  },
  description: {
    fontSize: 40,
  },
  footer: {
    flex: 0.5,
  },
});
