import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { useSyncFilaRelatos } from '@/hooks/useSyncFilaRelatos';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
type TabIconProps = { color: unknown; size: number };
const tab = (title: string, icon: IconName) => ({
  title,
  tabBarIcon: ({ color, size }: TabIconProps) => (
    <Ionicons name={icon} color={color == null ? colors.muted : String(color)} size={size} />
  ),
});

export default function TabsLayout() {
  useSyncFilaRelatos();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen name="index" options={tab('Mapa', 'map-outline')} />
      <Tabs.Screen name="prioridades" options={tab('Prioridades', 'list-outline')} />
      <Tabs.Screen name="relatar" options={tab('Relatar', 'mic-outline')} />
      <Tabs.Screen name="meus-relatos" options={tab('Meus relatos', 'document-text-outline')} />
      <Tabs.Screen name="perfil" options={tab('Perfil', 'person-outline')} />
    </Tabs>
  );
}