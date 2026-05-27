import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { createTicketSchema, type CreateTicketInput } from "@techdesk-pro/validators";
import { TicketPriority } from "@techdesk-pro/constants";
import { useTicketMutations } from "../../../hooks/useTickets";

export default function NewTicketScreen() {
  const router = useRouter();
  const { createTicket } = useTicketMutations();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: TicketPriority.MEDIUM
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    await createTicket.mutateAsync(values);
    router.back();
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 px-4 pt-4"
      >
        <View className="rounded-xl bg-white p-4 shadow-sm">
          <Text className="text-xl font-semibold text-gray-900">Create Ticket</Text>

          <Text className="mt-4 mb-1 text-sm font-medium text-gray-700">Title</Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2" value={value} onChangeText={onChange} />
            )}
          />
          {errors.title ? <Text className="mt-1 text-xs text-danger">{errors.title.message}</Text> : null}

          <Text className="mt-4 mb-1 text-sm font-medium text-gray-700">Description</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                multiline
                className="min-h-[100px] rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.description ? <Text className="mt-1 text-xs text-danger">{errors.description.message}</Text> : null}

          <Text className="mt-4 mb-1 text-sm font-medium text-gray-700">Priority</Text>
          <Controller
            control={control}
            name="priority"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row gap-2">
                {[TicketPriority.LOW, TicketPriority.MEDIUM, TicketPriority.HIGH, TicketPriority.CRITICAL].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    className={`rounded-full px-3 py-2 ${value === priority ? "bg-primary" : "bg-gray-100"}`}
                    onPress={() => onChange(priority)}
                  >
                    <Text className={`${value === priority ? "text-white" : "text-gray-700"} text-xs`}>{priority}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />

          <TouchableOpacity className="mt-6 rounded-xl bg-primary py-3" onPress={() => void onSubmit()}>
            <Text className="text-center font-semibold text-white">Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
