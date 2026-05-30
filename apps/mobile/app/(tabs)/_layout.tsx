import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const tabBarOptions = {
  headerShown: false,
  tabBarActiveTintColor: "#22d3ee",
  tabBarInactiveTintColor: "#94a3b8",
  tabBarStyle: {
    backgroundColor: "#020617",
    borderTopColor: "#1e293b"
  }
} as const;

export default function TabsLayout() {
  return (
    <Tabs screenOptions={tabBarOptions}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="tickets/index"
        options={{
          title: "Tickets",
          tabBarIcon: ({ color, size }) => <Ionicons name="ticket-outline" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="assets/index"
        options={{
          title: "Assets",
          tabBarIcon: ({ color, size }) => <Ionicons name="briefcase-outline" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" color={color} size={size} />
        }}
      />
      <Tabs.Screen name="tickets/new" options={{ href: null }} />
      <Tabs.Screen name="tickets/[id]" options={{ href: null }} />
      <Tabs.Screen name="assets/[id]" options={{ href: null }} />
    </Tabs>
  );
}
