import { RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import { AuditAction } from "@techdesk-pro/constants";
import { Card, EmptyState, SkeletonBlock, StatCard } from "../../components/ui";
import { useDashboard } from "../../hooks/useDashboard";

const statCards = [
  { label: "Open", key: "openTickets", accent: "bg-brand-500" },
  { label: "In Progress", key: "inProgressTickets", accent: "bg-amber-500" },
  { label: "Resolved", key: "resolvedTickets", accent: "bg-emerald-500" },
  { label: "Total", key: "totalTickets", accent: "bg-fuchsia-500" }
] as const;

export default function DashboardScreen() {
  const { data, isLoading, refetch, isRefetching } = useDashboard();

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} tintColor="#22d3ee" />}
        contentContainerClassName="px-4 pb-10 pt-4"
      >
        <Text className="text-3xl font-black text-white">Dashboard</Text>
        <Text className="mt-2 text-sm text-slate-400">Track tickets, assets, and the latest operational activity.</Text>

        {isLoading || !data ? (
          <View className="mt-6 flex-row flex-wrap justify-between gap-3">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="w-[48%] p-4">
                <SkeletonBlock className="h-4 w-20" />
                <SkeletonBlock className="mt-4 h-8 w-16" />
              </Card>
            ))}
            <Card className="mt-3 w-full p-4">
              <SkeletonBlock className="h-5 w-40" />
              {[1, 2, 3].map((item) => (
                <SkeletonBlock key={item} className="mt-3 h-16 w-full" />
              ))}
            </Card>
          </View>
        ) : (
          <>
            <View className="mt-6 flex-row flex-wrap justify-between gap-3">
              {statCards.map((card) => (
                <View key={card.label} className="w-[48%]">
                  <StatCard label={card.label} value={String(data[card.key])} accentClassName={card.accent} />
                </View>
              ))}
            </View>

            <Card className="mt-5 p-4">
              <View>
                <Text className="text-lg font-bold text-white">Recent activity</Text>
                <Text className="text-sm text-slate-400">Latest audit log entries from the backend.</Text>
              </View>

              {data.recentActivity.length === 0 ? (
                <EmptyState
                  className="mt-4"
                  title="Nothing yet"
                  description="New updates will appear here when tickets or assets change."
                />
              ) : (
                <View className="mt-4 gap-3">
                  {data.recentActivity.map((entry) => (
                    <View key={entry.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-base font-semibold text-white">
                          {entry.action === AuditAction.LOGIN ? "Login" : entry.action}
                        </Text>
                        <Text className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200">
                          {entry.entity}
                        </Text>
                      </View>
                      <Text className="mt-2 text-sm text-slate-300">
                        {entry.performedBy?.name ?? "System"} updated {entry.entity.toLowerCase()} {entry.entityId}
                      </Text>
                      <Text className="mt-2 text-xs text-slate-500">{new Date(entry.createdAt).toLocaleString()}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
