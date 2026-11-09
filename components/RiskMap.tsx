import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { RISK } from '@/constants/risk';
import { colors } from '@/constants/theme';
import { ComunidadeMapa } from '@/types/mapa';

interface Props {
  items: ComunidadeMapa[];
  selectedId?: number | null;
  onSelect: (id: number) => void;
}

function RiskMarker({ item, selected, onPress }: { item: ComunidadeMapa; selected: boolean; onPress: () => void }) {
  const [track, setTrack] = useState(true);
  useEffect(() => {
    setTrack(true);
    const t = setTimeout(() => setTrack(false), 600);
    return () => clearTimeout(t);
  }, [selected, item.estado, item.diasPrevistos]);
  const r = RISK[item.estado];
  return (
    <Marker
      coordinate={{ latitude: item.latitude, longitude: item.longitude }}
      onPress={onPress}
      tracksViewChanges={track}
      accessibilityLabel={`${item.nome}, ${r.label}`}
    >
      <View style={[styles.pin, { backgroundColor: r.color, borderColor: selected ? colors.ink : '#fff' }]}>
        <Text style={[styles.pinText, { color: r.text }]}>
          {item.diasPrevistos === null ? '–' : `${item.diasPrevistos}d`}
        </Text>
      </View>
    </Marker>
  );
}

export function RiskMap({ items, selectedId, onSelect }: Props) {
  const ref = useRef<MapView>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready || items.length === 0) return;
    ref.current?.fitToCoordinates(
      items.map((i) => ({ latitude: i.latitude, longitude: i.longitude })),
      { edgePadding: { top: 60, right: 60, bottom: 60, left: 60 }, animated: true }
    );
  }, [ready, items]);

  return (
    <MapView
      ref={ref}
      style={StyleSheet.absoluteFill}
      onMapReady={() => setReady(true)}
      initialRegion={{ latitude: -3.35, longitude: -64.7, latitudeDelta: 6, longitudeDelta: 6 }}
    >
      {items.map((i) => (
        <RiskMarker key={i.id} item={i} selected={i.id === selectedId} onPress={() => onSelect(i.id)} />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  pin: { minWidth: 38, height: 38, borderRadius: 19, borderWidth: 3, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  pinText: { fontSize: 12, fontWeight: '800' },
});