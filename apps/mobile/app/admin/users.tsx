import { FlatList, Modal, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Role } from "@techdesk-pro/constants";

const roleOptions = [Role.ADMIN, Role.IT_STAFF, Role.EMPLOYEE];

const users = [
  { id: "1", name: "System Admin", email: "admin@techdesk.local", role: Role.ADMIN },
  { id: "2", name: "Carlo Reyes", email: "staff1@techdesk.local", role: Role.IT_STAFF }
];

export default function AdminUsersScreen() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Text className="px-4 pt-4 text-xl font-semibold text-gray-900">Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity className="mx-4 my-1 rounded-xl bg-white p-4 shadow-sm" onPress={() => setSelectedUserId(item.id)}>
            <Text className="font-semibold text-gray-900">{item.name}</Text>
            <Text className="text-xs text-gray-500">{item.email}</Text>
            <Text className="mt-1 self-start rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">{item.role}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={Boolean(selectedUserId)} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/30 px-6">
          <View className="w-full rounded-xl bg-white p-4">
            <Text className="mb-3 text-base font-semibold text-gray-900">Change Role</Text>
            {roleOptions.map((role) => (
              <TouchableOpacity key={role} className="mb-2 rounded-lg bg-gray-100 px-3 py-2" onPress={() => setSelectedUserId(null)}>
                <Text className="text-sm text-gray-700">{role}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
