import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { ASSET_STATUS_COLORS, ASSET_STATUS_LABELS } from "@techdesk-pro/constants";
import { Card, EmptyState, SkeletonBlock } from "../../../components/ui";
import { useAsset } from "../../../hooks/useAssets";

export default function AssetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: asset, isLoading } = useAsset(String(id));

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView contentContainerClassName="px-4 pb-10 pt-4">
        <Text className="text-3xl font-black text-white">Asset detail</Text>

        {isLoading || !asset ? (
          <View className="mt-6 gap-3">
            <Card className="p-4">
              <SkeletonBlock className="h-6 w-3/5" />
              <SkeletonBlock className="mt-3 h-4 w-full" />
              <SkeletonBlock className="mt-2 h-4 w-4/5" />
            </Card>
            <Card className="p-4">
              <SkeletonBlock className="h-5 w-44" />
              {[1, 2].map((item) => (
                <SkeletonBlock key={item} className="mt-3 h-16 w-full" />
              ))}
            </Card>
          </View>
        ) : (
          <>
            <Card className="mt-6 p-5">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-white">{asset.name}</Text>
                  <Text className="mt-2 text-sm text-slate-400">
                    {asset.category} • {asset.model} • {asset.manufacturer}
                  </Text>
                </View>
                <Text className={`rounded-full px-3 py-1 text-xs font-semibold ${ASSET_STATUS_COLORS[asset.status]}`}>
                  {ASSET_STATUS_LABELS[asset.status]}
                </Text>
              </View>

              <View className="mt-4 gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <Text className="text-sm text-slate-300">Serial: {asset.serialNumber}</Text>
                <Text className="text-sm text-slate-300">
                  Purchase date: {asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : "Not recorded"}
                </Text>
                <Text className="text-sm text-slate-300">Notes: {asset.notes ?? "None"}</Text>
              </View>
            </Card>

            <View className="mt-6">
              <Text className="text-xl font-bold text-white">Assignment history</Text>
              <Text className="mt-1 text-sm text-slate-400">Latest assignments and handoffs for this asset.</Text>
            </View>

            {asset.assignments.length === 0 ? (
              <EmptyState className="mt-4" title="No assignments yet" description="This asset has not been issued to anyone yet." />
            ) : (
              <View className="mt-4 gap-3">
                {asset.assignments.map((assignment) => (
                  <Card key={assignment.id} className="p-4">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-semibold text-white">{assignment.user.name}</Text>
                      <Text className="text-xs text-slate-500">{new Date(assignment.assignedAt).toLocaleDateString()}</Text>
                    </View>
                    <Text className="mt-2 text-sm text-slate-300">
                      {assignment.returnedAt ? `Returned ${new Date(assignment.returnedAt).toLocaleDateString()}` : "Currently assigned"}
                    </Text>
                    {assignment.notes ? <Text className="mt-2 text-sm text-slate-400">{assignment.notes}</Text> : null}
                  </Card>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
