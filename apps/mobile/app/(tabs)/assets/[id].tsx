import { SafeAreaView, Text, TouchableOpacity, View, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAuthStore } from "../../../store/authStore";

const assignmentHistory = [
  { id: "1", user: "Juan dela Cruz", assignedAt: "2026-04-01", returnedAt: null },
  { id: "2", user: "Ana Gomez", assignedAt: "2026-03-10", returnedAt: "2026-03-29" }
];

export default function AssetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const canAssign = user?.role === "IT_STAFF" || user?.role === "ADMIN";

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="mx-4 my-1 rounded-xl bg-white p-4 shadow-sm">
        <Text className="text-xl font-semibold text-gray-900">Asset #{id}</Text>
        <Text className="mt-2 text-sm text-gray-600">Model, serial, manufacturer, purchase date details.</Text>
        <Text className="mt-2 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">AVAILABLE</Text>
        {canAssign ? (
          <TouchableOpacity className="mt-3 rounded-lg bg-primary py-2">
            <Text className="text-center font-medium text-white">Assign / Unassign</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        data={assignmentHistory}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text className="mx-4 mt-2 mb-1 text-base font-semibold text-gray-900">Assignment History</Text>}
        renderItem={({ item }) => (
          <View className="mx-4 my-1 rounded-xl bg-white p-4 shadow-sm">
            <Text className="font-medium text-gray-800">{item.user}</Text>
            <Text className="text-xs text-gray-500">
              {item.assignedAt} {item.returnedAt ? `to ${item.returnedAt}` : "(active)"}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
