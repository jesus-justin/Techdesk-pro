import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ASSET_STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS, TICKET_STATUS_COLORS, TICKET_STATUS_LABELS, TicketStatus } from "@techdesk-pro/constants";
import { Card, EmptyState, SkeletonBlock } from "../../../components/ui";
import { useTickets } from "../../../hooks/useTickets";

const statuses: Array<TicketStatus | "ALL"> = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export default function TicketsScreen() {
  const [status, setStatus] = useState<TicketStatus | "ALL">("ALL");
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useTickets({
    status: status === "ALL" ? undefined : status
  });

  const items = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="px-4 pt-4">
        <Text className="text-3xl font-black text-white">Tickets</Text>
        <Text className="mt-2 text-sm text-slate-400">Filter by status and tap into a ticket for the full thread.</Text>
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
                  {item === "ALL" ? "All" : TICKET_STATUS_LABELS[item]}
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
              <EmptyState title="No tickets found" description="Try a different filter or create a new ticket." />
            </View>
          }
          renderItem={({ item }) => (
            <Link href={`/(tabs)/tickets/${item.id}`} asChild>
              <TouchableOpacity className="mb-3">
                <Card className="p-4">
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-white">{item.title}</Text>
                      <Text className="mt-2 text-sm leading-5 text-slate-400" numberOfLines={2}>
                        {item.description}
                      </Text>
                    </View>
                    <View className="rounded-full bg-slate-800 px-3 py-1">
                      <Text className="text-xs font-semibold text-slate-200">#{item.id.slice(0, 6)}</Text>
                    </View>
                  </View>

                  <View className="mt-4 flex-row flex-wrap gap-2">
                    <Text className={`rounded-full px-3 py-1 text-xs font-semibold ${TICKET_STATUS_COLORS[item.status]}`}>
                      {TICKET_STATUS_LABELS[item.status]}
                    </Text>
                    <Text className={`rounded-full px-3 py-1 text-xs font-semibold ${PRIORITY_COLORS[item.priority]}`}>
                      {PRIORITY_LABELS[item.priority]}
                    </Text>
                    {item.asset ? (
                      <Text className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                        {ASSET_STATUS_LABELS[item.asset.status]}
                      </Text>
                    ) : null}
                  </View>

                  <Text className="mt-3 text-xs text-slate-500">
                    Submitted by {item.submittedBy?.name ?? item.submittedBy?.email ?? "Unknown"} • {new Date(item.createdAt).toLocaleString()}
                  </Text>
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

      <Link href="/(tabs)/tickets/new" asChild>
        <TouchableOpacity className="absolute bottom-6 right-6 rounded-full bg-brand-500 px-5 py-3 shadow-lg shadow-brand-500/40">
          <Text className="font-semibold text-slate-950">New Ticket</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}
