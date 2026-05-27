import { useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View, FlatList } from "react-native";
import { useState } from "react";
import { TICKET_STATUS_FLOW } from "@techdesk-pro/constants";
import { useAuthStore } from "../../../store/authStore";
import { useTicketMutations } from "../../../hooks/useTickets";

const mockTicket = {
  id: "",
  title: "Ticket Detail",
  description: "Detailed issue description",
  status: "OPEN" as const,
  priority: "MEDIUM" as const,
  assignedToId: null,
  createdAt: new Date().toISOString(),
  assetId: null,
  comments: [] as Array<{ id: string; content: string; createdAt: string }>
};

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [comment, setComment] = useState("");
  const user = useAuthStore((state) => state.user);
  const { updateTicket } = useTicketMutations();

  const isStaff = user?.role === "IT_STAFF" || user?.role === "ADMIN";
  const nextStatuses = TICKET_STATUS_FLOW[mockTicket.status];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View className="mx-4 my-1 rounded-xl bg-white p-4 shadow-sm">
          <Text className="text-xl font-semibold text-gray-900">{mockTicket.title}</Text>
          <Text className="mt-2 text-sm text-gray-600">{mockTicket.description}</Text>
          <View className="mt-3 flex-row gap-2">
            <Text className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">{mockTicket.status}</Text>
            <Text className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">{mockTicket.priority}</Text>
          </View>
          <Text className="mt-2 text-xs text-gray-500">Created: {new Date(mockTicket.createdAt).toLocaleString()}</Text>
        </View>

        {isStaff ? (
          <View className="mx-4 my-1 rounded-xl bg-white p-4 shadow-sm">
            <Text className="mb-2 text-sm font-semibold text-gray-900">Update Status</Text>
            <View className="flex-row flex-wrap gap-2">
              {nextStatuses.map((status) => (
                <TouchableOpacity
                  key={status}
                  className="rounded-full bg-primary px-3 py-2"
                  onPress={() => void updateTicket.mutateAsync({ id: String(id), payload: { status } })}
                >
                  <Text className="text-xs font-medium text-white">{status}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}

        <FlatList
          data={mockTicket.comments}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View className="mx-4 my-1 rounded-xl bg-white p-4 shadow-sm">
              <Text className="text-sm text-gray-500">No comments yet.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View className="mx-4 my-1 rounded-xl bg-white p-4 shadow-sm">
              <Text className="text-sm text-gray-800">{item.content}</Text>
            </View>
          )}
        />

        <View className="mx-4 my-2 rounded-xl bg-white p-3 shadow-sm">
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Add comment"
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
          />
          <TouchableOpacity className="mt-2 rounded-lg bg-primary py-2" onPress={() => setComment("") }>
            <Text className="text-center font-medium text-white">Add Comment</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
