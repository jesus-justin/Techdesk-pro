import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "../../store/authStore";

export default function AdminLayout() {
  const user = useAuthStore((state) => state.user);

  if (user?.role === "EMPLOYEE") {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
