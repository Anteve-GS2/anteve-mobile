import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { RISK } from '@/constants/risk';
import { colors } from '@/constants/theme';
import { ComunidadeMapa } from '@/types/mapa';
import { interpolar } from '@/utils/geo';
import { Barco, folgaDias, progressoBarco } from '@/utils/logistica';

interface Props {
  items: ComunidadeMapa[];
  selectedId?: number | null;
  onSelect: (id: number) => void;
  barcos?: Barco[];
  tempoDias?: number;
  atrasoHoras?: number;
}

function useBreve(deps: unknown[]) {
  const [track, setTrack] = useState(true);
  useEffect(() => {
    const start = setTimeout(() => setTrack(true), 0);
    const stop = setTimeout(() => setTrack(false), 600);
    return () => {
      clearTimeout(start);
      clearTimeout(stop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return track;
}

function RiskMarker({ item, selected, onPress }: { item: ComunidadeMapa; selected: boolean; onPress: () => void }) {
  const track = useBreve([selected, item.estado, item.diasPrevistos]);
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

function BoatMarker({ barco, tempo, atraso }: { barco: Barco; tempo: number; atraso: number }) {
  const p = progressoBarco(barco, tempo, atraso);
  const chegou = p >= 1;
  const icone = !chegou ? '🚤' : folgaDias(barco, atraso) >= 0 ? '✅' : '⚠️';
  const track = useBreve([icone]);
  return (
    <Marker
      coordinate={interpolar(barco.origem, barco.destino, p)}
      tracksViewChanges={track}
      anchor={{ x: 0.5, y: 0.5 }}
      zIndex={5}
      accessibilityLabel={`Barco para ${barco.nome}`}
    >
      <View style={styles.boat}><Text style={{ fontSize: 16 }}>{icone}</Text></View>
    </Marker>
  );
}

export function RiskMap({ items, selectedId, onSelect, barcos = [], tempoDias = 0, atrasoHoras = 0 }: Props) {
  const ref = useRef<MapView>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready || items.length === 0) return;
    ref.current?.fitToCoordinates(
      items.map((i) => ({ latitude: i.latitude, longitude: i.longitude })),
      { edgePadding: { top: 60, right: 60, bottom: 60, left: 60 }, animated: true }
    );
  }, [ready, items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MapView
      ref={ref}
      style={StyleSheet.absoluteFill}
      onMapReady={() => setReady(true)}
      initialRegion={{ latitude: -3.35, longitude: -64.7, latitudeDelta: 6, longitudeDelta: 6 }}
    >
      {barcos.map((b) => (
        <Polyline key={`r${b.id}`} coordinates={[b.origem, b.destino]} strokeColor={colors.ink} strokeWidth={2} lineDashPattern={[6, 6]} />
      ))}
      {barcos.length > 0 && (
        <Marker coordinate={barcos[0].origem} anchor={{ x: 0.5, y: 0.5 }} accessibilityLabel="Polo de abastecimento">
          <View style={styles.polo}><Text style={styles.poloText}>Polo</Text></View>
        </Marker>
      )}
      {items.map((i) => (
        <RiskMarker key={i.id} item={i} selected={i.id === selectedId} onPress={() => onSelect(i.id)} />
      ))}
      {barcos.map((b) => (
        <BoatMarker key={`b${b.id}`} barco={b} tempo={tempoDias} atraso={atrasoHoras} />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  pin: { minWidth: 38, height: 38, borderRadius: 19, borderWidth: 3, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  pinText: { fontSize: 12, fontWeight: '800' },
  boat: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#fff', borderWidth: 1.5, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  polo: { backgroundColor: colors.ink, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  poloText: { color: '#fff', fontSize: 11, fontWeight: '800' },
});