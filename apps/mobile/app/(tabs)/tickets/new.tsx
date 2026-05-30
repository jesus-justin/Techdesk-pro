import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { createTicketSchema, type CreateTicketInput } from "@techdesk-pro/validators";
import { PRIORITY_LABELS, TicketPriority } from "@techdesk-pro/constants";
import { Card, FieldError, FieldLabel, FormInput, PrimaryButton } from "../../../components/ui";
import { useCreateTicket } from "../../../hooks/useTickets";

export default function NewTicketScreen() {
  const router = useRouter();
  const createTicket = useCreateTicket();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: TicketPriority.MEDIUM
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setSubmitError(null);
      await createTicket.mutateAsync(values);
      router.replace("/(tabs)/tickets");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to create ticket");
    }
  });

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerClassName="px-4 pb-10 pt-4">
          <Text className="text-3xl font-black text-white">New ticket</Text>
          <Text className="mt-2 text-sm text-slate-400">Capture the issue, set urgency, and submit it to the team.</Text>

          <Card className="mt-6 p-5">
            <FieldLabel>Title</FieldLabel>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  placeholder="Password reset failing for finance"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.title?.message}
                />
              )}
            />

            <FieldLabel className="mt-4">Description</FieldLabel>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  className="min-h-[140px]"
                  placeholder="Include what happened, who is affected, and any steps already tried."
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.description?.message}
                />
              )}
            />

            <FieldLabel className="mt-4">Priority</FieldLabel>
            <Controller
              control={control}
              name="priority"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row flex-wrap gap-2">
                  {[TicketPriority.LOW, TicketPriority.MEDIUM, TicketPriority.HIGH, TicketPriority.CRITICAL].map((priority) => {
                    const active = value === priority;
                    return (
                      <TouchableOpacity
                        key={priority}
                        className={`rounded-full border px-3 py-2 ${active ? "border-brand-400 bg-brand-500/20" : "border-slate-700 bg-slate-900"}`}
                        onPress={() => onChange(priority)}
                      >
                        <Text className={`text-xs font-semibold ${active ? "text-brand-200" : "text-slate-300"}`}>
                          {PRIORITY_LABELS[priority]}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            />
            {errors.priority ? <FieldError message={errors.priority.message} /> : null}

            {submitError ? <FieldError message={submitError} /> : null}

            <PrimaryButton
              className="mt-6"
              title={isSubmitting ? "Submitting..." : "Create ticket"}
              onPress={() => void onSubmit()}
              loading={isSubmitting || createTicket.isPending}
            />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
