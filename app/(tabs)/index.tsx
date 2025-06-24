import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Animated,
} from 'react-native';

type Offer = {
  id: string;
  title: string;
  description: string;
  price: string;
};

const offersData: Offer[] = [
  { id: '1', title: 'Лукойл', description: 'Отстъпка на бензин', price: '2.30 лв./л' },
  { id: '2', title: 'Shell', description: 'Промоция на дизел', price: '2.20 лв./л' },
  { id: '3', title: 'OMV', description: 'Газ на специална цена', price: '1.15 лв./л' },
  { id: '4', title: 'Petrol', description: 'Почистващи препарати безплатно', price: '-' },
];

const tips = [
  'Поддържайте правилното налягане в гумите.',
  'Избягвайте резки ускорения и спирания.',
  'Планирайте маршрутите си предварително.',
  'Изключвайте двигателя, когато сте на място повече от 1 минута.',
  'Използвайте по-висока предавка при движение по равен път.',
];

export default function Home() {
  const [loading, setLoading] = useState(true);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: -15,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();

    const timer = setTimeout(() => {
      setLoading(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, [scaleAnim, translateYAnim, opacityAnim]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.View
          style={[
            styles.drop,
            {
              transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
              opacity: opacityAnim,
            },
          ]}
        />
        <Text style={styles.loadingText}>Зареждане...</Text>
      </View>
    );
  }

  const renderOffer = ({ item }: { item: Offer }) => (
    <View style={styles.offerCard}>
      <Text style={styles.offerTitle}>{item.title}</Text>
      <Text style={styles.offerDescription}>{item.description}</Text>
      <Text style={styles.offerPrice}>{item.price}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Text style={styles.heading}>Добре дошли в Fuel App</Text>

        <Text style={styles.sectionTitle}>Текущи оферти</Text>
        <FlatList
          data={offersData}
          renderItem={renderOffer}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.offersList}
        />

        <Text style={styles.sectionTitle}>Съвети за пестене на гориво</Text>
        <View style={styles.tipsContainer}>
          {tips.map((tip, index) => (
            <Text key={index} style={styles.tipItem}>• {tip}</Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Новини</Text>
        <View style={styles.newsContainer}>
          <Text style={styles.newsItem}>🔥 Намаления на горивата през юни!</Text>
          <Text style={styles.newsItem}>📍 Нови станции в София и Пловдив.</Text>
          <Text style={styles.newsItem}>⛽ Вземи карта с отстъпки от Fuel App.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#2196f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drop: {
    width: 50,
    height: 70,
    backgroundColor: '#4fc3f7',
    borderRadius: 25,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    shadowColor: '#0288d1',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
  },
  loadingText: {
    marginTop: 30,
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#e6f0ff',
  },
  scrollContainer: {
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2196f3',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0d47a1',
    marginBottom: 10,
  },
  offersList: {
    marginBottom: 25,
  },
  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: '#0d47a1',
  },
  offerDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  offerPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196f3',
  },
  tipsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
  },
  tipItem: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  newsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
  },
  newsItem: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
});
