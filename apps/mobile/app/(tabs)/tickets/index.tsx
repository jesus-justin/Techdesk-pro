import { Link } from "expo-router";
import { FlatList, SafeAreaView, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { useMemo, useState } from "react";
import { PRIORITY_LABELS, TICKET_STATUS_LABELS, TicketStatus } from "@techdesk-pro/constants";
import { useTickets } from "../../../hooks/useTickets";

const statuses: Array<TicketStatus | "ALL"> = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export default function TicketsScreen() {
  const [status, setStatus] = useState<TicketStatus | "ALL">("ALL");
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useTickets(
    status === "ALL" ? undefined : status
  );

  const items = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4">
        <Text className="text-xl font-semibold text-gray-900">Tickets</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-3">
        <View className="flex-row gap-2">
          {statuses.map((item) => (
            <TouchableOpacity
              key={item}
              className={`rounded-full px-4 py-2 ${status === item ? "bg-primary" : "bg-white"}`}
              onPress={() => setStatus(item)}
            >
              <Text className={`${status === item ? "text-white" : "text-gray-700"} text-xs font-medium`}>
                {item === "ALL" ? "All" : TICKET_STATUS_LABELS[item]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        onEndReached={() => {
          if (hasNextPage) {
            void fetchNextPage();
          }
        }}
        ListEmptyComponent={
          <View className="mx-4 my-1 rounded-xl bg-white p-4 shadow-sm">
            <Text className="text-gray-500">{isLoading ? "Loading tickets..." : "No tickets found."}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Link href={`/(tabs)/tickets/${item.id}`} asChild>
            <TouchableOpacity className="mx-4 my-1 rounded-xl bg-white p-4 shadow-sm">
              <Text className="text-base font-semibold text-gray-900">{item.title}</Text>
              <Text className="mt-1 text-xs text-gray-500">
                {PRIORITY_LABELS[item.priority]} • {new Date(item.createdAt).toLocaleString()}
              </Text>
            </TouchableOpacity>
          </Link>
        )}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="mx-4 my-1 rounded-xl bg-white p-4 shadow-sm">
              <Text className="text-gray-500">Loading more...</Text>
            </View>
          ) : null
        }
      />

      <Link href="/(tabs)/tickets/new" asChild>
        <TouchableOpacity className="absolute bottom-6 right-6 rounded-full bg-primary px-5 py-3 shadow-lg">
          <Text className="font-semibold text-white">New Ticket</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}
