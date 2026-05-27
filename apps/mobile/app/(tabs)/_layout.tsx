import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3B82F6"
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="tickets/index"
        options={{
          title: "Tickets",
          tabBarIcon: ({ color, size }) => <Ionicons name="ticket" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="assets/index"
        options={{
          title: "Assets",
          tabBarIcon: ({ color, size }) => <Ionicons name="laptop" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />
        }}
      />
      <Tabs.Screen name="tickets/new" options={{ href: null }} />
      <Tabs.Screen name="tickets/[id]" options={{ href: null }} />
      <Tabs.Screen name="assets/[id]" options={{ href: null }} />
    </Tabs>
  );
}
