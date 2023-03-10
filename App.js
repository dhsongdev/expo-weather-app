import * as Location from "expo-location";
import { API_KEY } from "@env";
import { Constants } from "expo";

import { MaterialCommunityIcons } from "@expo/vector-icons";

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

const icons = {
  ThunderStorm: "weather-lightning",
  Drizzle: "weather-rainy",
  Rain: "weather-pouring",
  Snow: "weather-snowy-heavy",
  Atmosphere: "weather-fog",
  Clear: "weather-sunny",
  Clouds: "weather-cloudy",
};

export default function App() {
  const [loading, setLoading] = useState(true); //loading page
  const [city, setCity] = useState("νμ¬ μμΉ.."); //city user located
  const [dayWeathers, setDayWeathers] = useState([]); //weather data[] from weather api
  const [permission, setPermission] = useState(true); //foreground permission

  const getWeather = async () => {
    //request user location
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setPermission(false);
      setCity("unknown");
    }

    //get user location
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({
      accuracy: 5,
    });
    const location = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    //save user location
    setCity(location[0].city);

    //get weather
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=kr&lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    );
    const json = await response.json();

    //set api data on dayWeather
    //How to use: dayWeathers[day-1].weather[0].main or .description
    setDayWeathers(json.list);

    //finish loading page
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
                μ
                {dayWeather.dt_txt.substr(8, 2).charAt(0) === "0"
                  ? ` ${dayWeather.dt_txt.substr(9, 1)}`
                  : ` ${dayWeather.dt_txt.substr(8, 2)}`}
                μΌ{` ${dayWeather.dt_txt.substr(11, 2)}`}μ
              </Text>
              <Text style={styles.temp}>{dayWeather.main.temp}β</Text>
              <Text>μ²΄κ°μ¨λ : {dayWeather.main.feels_like}β</Text>
              <Text style={styles.description}>
                {dayWeather.weather[0].description}
              </Text>
              <MaterialCommunityIcons
                name={icons[dayWeather.weather[0].main]}
                size={24}
                color="black"
              />
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}></View>
    </View>
  );
}

//styles
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
