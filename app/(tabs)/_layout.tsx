import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationOptions } from 'expo-router/build/react-navigation/bottom-tabs/types';
import { colors, shadow } from '@/constants/theme';
import { useSyncFilaRelatos } from '@/hooks/useSyncFilaRelatos';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
type TabOptions = Pick<BottomTabNavigationOptions, 'title' | 'tabBarIcon'>;

const tab = (title: string, icon: IconName): TabOptions => ({
  title,
  tabBarIcon: ({ color, size }) => (
    <Ionicons name={icon} color={color == null || typeof color === 'number' ? colors.ink : color} size={size} />
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
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: { height: 66, paddingTop: 6, paddingBottom: 8, backgroundColor: colors.white, borderTopWidth: 0, ...shadow },
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