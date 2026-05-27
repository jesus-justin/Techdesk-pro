import { Link } from "expo-router";
import { FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useMemo, useState } from "react";
import { ASSET_STATUS_LABELS, AssetStatus } from "@techdesk-pro/constants";
import { useAssets } from "../../../hooks/useAssets";

const statuses: Array<AssetStatus | "ALL"> = ["ALL", "AVAILABLE", "IN_USE", "UNDER_REPAIR", "RETIRED"];

export default function AssetsScreen() {
  const [status, setStatus] = useState<AssetStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useAssets(status === "ALL" ? undefined : status, search);
  const items = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4">
        <Text className="text-xl font-semibold text-gray-900">Assets</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search assets"
          className="mt-3 rounded-xl border border-gray-200 bg-white px-3 py-2"
        />
      </View>

      <View className="px-4 py-2">
        <View className="flex-row flex-wrap gap-2">
          {statuses.map((item) => (
            <TouchableOpacity
              key={item}
              className={`rounded-full px-3 py-2 ${status === item ? "bg-primary" : "bg-white"}`}
              onPress={() => setStatus(item)}
            >
              <Text className={`${status === item ? "text-white" : "text-gray-700"} text-xs`}>
                {item === "ALL" ? "All" : ASSET_STATUS_LABELS[item]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="mx-4 my-1 rounded-xl bg-white p-4 shadow-sm">
            <Text className="text-gray-500">{isLoading ? "Loading assets..." : "No assets found."}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Link href={`/(tabs)/assets/${item.id}`} asChild>
            <TouchableOpacity className="mx-4 my-1 rounded-xl bg-white p-4 shadow-sm">
              <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
              <Text className="mt-1 text-xs text-gray-500">{item.category} • {item.status}</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </SafeAreaView>
  );
}
