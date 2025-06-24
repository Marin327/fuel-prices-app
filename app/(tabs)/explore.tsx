import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

type Station = {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  price: string;
};

export default function ExploreTab() {
  const [userLocation, setUserLocation] = useState<null | {
    latitude: number;
    longitude: number;
  }>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Разрешение отказано', 'Трябва да разрешите локацията, за да видите бензиностанции.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const bbox = '42.5,23.2,42.8,23.5'; 
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="fuel"](${bbox});
        );
        out body;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        const fetchedStations: Station[] = data.elements
          .slice(0, 100) // тук увеличихме на 100
          .map((node: any) => ({
            id: node.id,
            title: node.tags?.name || 'Бензиностанция',
            latitude: node.lat,
            longitude: node.lon,
            price: randomPrice(),
          }));

        setStations(fetchedStations);
      } catch (error) {
        Alert.alert('Грешка', 'Не можа да се заредят бензиностанциите.');
      }

      setLoading(false);
    })();
  }, []);

  const randomPrice = () => {
    const min = 2.0;
    const max = 3.0;
    return (Math.random() * (max - min) + min).toFixed(2) + ' лв./л';
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  if (!userLocation) {
    return (
      <View style={styles.center}>
        <Text>Не може да се вземе вашата локация.</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
      showsUserLocation
      showsMyLocationButton
    >
      <Marker
        coordinate={userLocation}
        title="Ти си тук"
        pinColor="blue"
      />

      {stations.map(station => (
        <Marker
          key={station.id}
          coordinate={{ latitude: station.latitude, longitude: station.longitude }}
          title={station.title}
          description={`Цена: ${station.price}`}
          pinColor="red"
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
