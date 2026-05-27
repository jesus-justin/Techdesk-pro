import { VictoryPie } from "victory-native";
import { ScrollView, SafeAreaView, Text, View, RefreshControl } from "react-native";
import { useDashboard } from "../../hooks/useDashboard";

export default function DashboardScreen() {
  const { data, isLoading, refetch, isRefetching } = useDashboard();

  if (isLoading || !data) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-500">Loading dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />}
      >
        <View className="px-4 pt-4">
          <Text className="mb-3 text-xl font-semibold text-gray-900">Dashboard</Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {[data.openTickets, data.inProgressTickets, data.resolvedTickets, data.totalTickets].map((value, idx) => (
              <View key={idx} className="w-[48%] rounded-xl bg-white p-4 shadow-sm">
                <Text className="text-xs text-gray-500">{["Open", "In Progress", "Resolved", "Total"][idx]}</Text>
                <Text className="mt-1 text-2xl font-bold text-gray-900">{value}</Text>
              </View>
            ))}
          </View>
          <View className="rounded-xl bg-white p-4 shadow-sm">
            <Text className="mb-2 text-base font-semibold text-gray-900">Ticket Status</Text>
            <VictoryPie
              data={[
                { x: "Open", y: data.openTickets },
                { x: "In Progress", y: data.inProgressTickets },
                { x: "Resolved", y: data.resolvedTickets }
              ]}
              colorScale={["#3B82F6", "#F59E0B", "#10B981"]}
              height={220}
            />
          </View>
          <View className="mt-4 rounded-xl bg-white p-4 shadow-sm">
            <Text className="mb-3 text-base font-semibold text-gray-900">Recent Activity</Text>
            {data.recentActivity.length === 0 ? (
              <Text className="text-sm text-gray-500">No recent activity.</Text>
            ) : (
              data.recentActivity.map((entry) => (
                <View key={entry.id} className="mb-2 rounded-lg bg-gray-50 p-3">
                  <Text className="font-medium text-gray-800">{entry.action}</Text>
                  <Text className="text-xs text-gray-500">{entry.entity} • {new Date(entry.createdAt).toLocaleString()}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
