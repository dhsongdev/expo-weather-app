import * as Location from "expo-location";
import { API_KEY } from "@env";
import { Constants } from "expo";

import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";

const WINDOW_WIDTH = Dimensions.get("window").width;

const windowWidthHalf = WINDOW_WIDTH / 2;

export default function App() {
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("현재 위치..");
  const [dayWeathers, setDayWeathers] = useState([]);
  const [permission, setPermission] = useState(true);

  const getWeather = async () => {
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

    //get weather
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    );
    const json = await response.json();

    //set api data on dayWeather
    //useage: dayWeathers[day-1].weather[0].main or .description
    setDayWeathers(json.list);

    setLoading(false);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        ContentContainerStyle={styles.weathers}
      >
        {loading === true ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        ) : (
          dayWeathers.map((dayWeather, index) => (
            <View key={index} style={styles.weather}>
              <Text style={styles.date}>
                {dayWeather.dt_txt.substr(5, 2).charAt(0) === "0"
                  ? `${dayWeather.dt_txt.substr(6, 1)}`
                  : `${dayWeather.dt_txt.substr(5, 2)}`}
                월
                {dayWeather.dt_txt.substr(8, 2).charAt(0) === "0"
                  ? ` ${dayWeather.dt_txt.substr(9, 1)}`
                  : ` ${dayWeather.dt_txt.substr(8, 2)}`}
                일{` ${dayWeather.dt_txt.substr(11, 2)}`}시
              </Text>
              <Text style={styles.temp}>{dayWeather.main.temp}℃</Text>
              <Text>체감온도 : {dayWeather.main.feels_like}℃</Text>
              <Text style={styles.description}>
                {dayWeather.weather[0].description}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
      <View style={styles.footer}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  city: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 70,
    color: "#FFFFFF",
  },
  weathers: {
    justifyContent: "center",
    alignItems: "center",
  },
  weather: {
    width: WINDOW_WIDTH / 2,
    height: WINDOW_WIDTH / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: WINDOW_WIDTH / 4,
    margin: WINDOW_WIDTH / 20,
  },
  loading: { width: WINDOW_WIDTH },
  date: {
    fontSize: WINDOW_WIDTH / 20,
    marginBottom: 10,
  },
  temp: {
    fontSize: WINDOW_WIDTH / 24,
  },
  description: {
    fontSize: WINDOW_WIDTH / 22,
  },
  footer: {
    flex: 1,
  },
});
