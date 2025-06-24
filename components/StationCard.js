import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function StationCard({ name, fuel }) {
  return (
    <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center' }}>
      <MaterialCommunityIcons name={fuel} size={24} color="black" />
      <Text style={{ marginLeft: 10, fontSize: 18 }}>{name}</Text>
    </View>
  );
}
