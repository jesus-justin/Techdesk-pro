import { useRouter } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";
import { Card, PrimaryButton } from "../../components/ui";
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
    <SafeAreaView className="flex-1 bg-slate-950 px-4 pt-4">
      <Text className="text-3xl font-black text-white">Profile</Text>
      <Text className="mt-2 text-sm text-slate-400">Review the signed-in account and sign out when you're done.</Text>

      <Card className="mt-6 items-center p-6">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-brand-500/20">
          <Text className="text-2xl font-black text-brand-300">{initials}</Text>
        </View>
        <Text className="mt-4 text-xl font-bold text-white">{user?.name ?? "Unknown user"}</Text>
        <Text className="mt-1 text-sm text-slate-400">{user?.email ?? "No account loaded"}</Text>
        <Text className="mt-3 rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200">{user?.role ?? "-"}</Text>
      </Card>

      <PrimaryButton
        className="mt-6"
        title="Logout"
        onPress={async () => {
          await logout();
          router.replace("/(auth)/login");
        }}
      />
    </SafeAreaView>
  );
}
