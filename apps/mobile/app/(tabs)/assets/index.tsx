import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ASSET_STATUS_COLORS, ASSET_STATUS_LABELS, AssetStatus } from "@techdesk-pro/constants";
import { Card, EmptyState, SkeletonBlock } from "../../../components/ui";
import { useAssets } from "../../../hooks/useAssets";

const statuses: Array<AssetStatus | "ALL"> = ["ALL", "AVAILABLE", "IN_USE", "UNDER_REPAIR", "RETIRED"];

export default function AssetsScreen() {
  const [status, setStatus] = useState<AssetStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useAssets({
    status: status === "ALL" ? undefined : status,
    q: search || undefined
  });
  const items = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="px-4 pt-4">
        <Text className="text-3xl font-black text-white">Assets</Text>
        <Text className="mt-2 text-sm text-slate-400">Search hardware, filter by state, and inspect the details.</Text>
        <View className="mt-4 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3">
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name, model, or serial number"
            placeholderTextColor="#64748b"
            className="text-base text-white"
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-4">
        <View className="flex-row gap-2">
          {statuses.map((item) => {
            const active = status === item;
            return (
              <TouchableOpacity
                key={item}
                className={`rounded-full border px-4 py-2 ${active ? "border-brand-400 bg-brand-500/20" : "border-slate-700 bg-slate-900"}`}
                onPress={() => setStatus(item)}
              >
                <Text className={`text-xs font-semibold ${active ? "text-brand-200" : "text-slate-300"}`}>
                  {item === "ALL" ? "All" : ASSET_STATUS_LABELS[item]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {isLoading ? (
        <View className="px-4">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="mb-3 p-4">
              <SkeletonBlock className="h-5 w-3/5" />
              <SkeletonBlock className="mt-3 h-4 w-1/2" />
              <SkeletonBlock className="mt-4 h-6 w-24" />
            </Card>
          ))}
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-28"
          onEndReached={() => {
            if (hasNextPage) {
              void fetchNextPage();
            }
          }}
          ListEmptyComponent={
            <View className="pt-8">
              <EmptyState title="No assets found" description="Try a broader search or a different state filter." />
            </View>
          }
          renderItem={({ item }) => (
            <Link href={`/(tabs)/assets/${item.id}`} asChild>
              <TouchableOpacity className="mb-3">
                <Card className="p-4">
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-white">{item.name}</Text>
                      <Text className="mt-2 text-sm text-slate-400" numberOfLines={2}>
                        {item.category} • {item.model}
                      </Text>
                    </View>
                    <Text className={`rounded-full px-3 py-1 text-xs font-semibold ${ASSET_STATUS_COLORS[item.status]}`}>
                      {ASSET_STATUS_LABELS[item.status]}
                    </Text>
                  </View>

                  <Text className="mt-3 text-xs text-slate-500">Serial {item.serialNumber}</Text>
                </Card>
              </TouchableOpacity>
            </Link>
          )}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator color="#22d3ee" />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}
