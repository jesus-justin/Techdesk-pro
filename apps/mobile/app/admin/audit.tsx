import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";

const entries = Array.from({ length: 30 }).map((_, i) => ({
  id: String(i + 1),
  action: i % 2 === 0 ? "UPDATE" : "CREATE",
  entity: i % 3 === 0 ? "TICKET" : "ASSET",
  date: new Date(Date.now() - i * 3600_000).toISOString()
}));

export default function AuditScreen() {
  const [count, setCount] = useState(15);
  const visible = entries.slice(0, count);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Text className="px-4 pt-4 text-xl font-semibold text-gray-900">Audit Log</Text>
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mx-4 my-1 rounded-xl bg-white p-4 shadow-sm">
            <Text className="font-semibold text-gray-900">{item.action}</Text>
            <Text className="text-sm text-gray-600">{item.entity}</Text>
            <Text className="text-xs text-gray-500">{new Date(item.date).toLocaleString()}</Text>
          </View>
        )}
        ListFooterComponent={
          count < entries.length ? (
            <TouchableOpacity className="mx-4 my-3 rounded-xl bg-primary py-3" onPress={() => setCount((v) => v + 10)}>
              <Text className="text-center font-semibold text-white">Load More</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
