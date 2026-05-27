import { useRouter } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../../store/authStore";

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const initials = user?.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "U";

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-4 pt-6">
      <View className="rounded-xl bg-white p-4 shadow-sm">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-primary">
          <Text className="text-xl font-bold text-white">{initials}</Text>
        </View>
        <Text className="mt-3 text-lg font-semibold text-gray-900">{user?.name ?? "Unknown User"}</Text>
        <Text className="text-sm text-gray-500">{user?.email ?? "-"}</Text>
        <Text className="mt-2 self-start rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">{user?.role}</Text>
      </View>

      <View className="mt-4 rounded-xl bg-white p-4 shadow-sm">
        <Text className="mb-2 text-sm font-semibold text-gray-900">Settings</Text>
        <TouchableOpacity className="rounded-lg bg-gray-100 px-3 py-2" onPress={() => router.push("/(tabs)/profile") }>
          <Text className="text-sm text-gray-700">Change Password</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="mt-4 rounded-xl bg-danger py-3"
        onPress={async () => {
          await logout();
          router.replace("/(auth)/login");
        }}
      >
        <Text className="text-center font-semibold text-white">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
