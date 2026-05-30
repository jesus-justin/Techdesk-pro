import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, View } from "react-native";
import { addCommentSchema, type AddCommentInput } from "@techdesk-pro/validators";
import { PRIORITY_COLORS, PRIORITY_LABELS, TICKET_STATUS_COLORS, TICKET_STATUS_LABELS } from "@techdesk-pro/constants";
import { Card, EmptyState, FieldLabel, FormInput, PrimaryButton, SkeletonBlock } from "../../../components/ui";
import { useAddTicketComment, useTicket } from "../../../hooks/useTickets";

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: ticket, isLoading } = useTicket(String(id));
  const addComment = useAddTicketComment(String(id));

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<AddCommentInput>({
    resolver: zodResolver(addCommentSchema),
    defaultValues: { content: "" }
  });

  const onSubmit = handleSubmit(async (values) => {
    await addComment.mutateAsync(values);
    reset({ content: "" });
  });

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerClassName="px-4 pb-10 pt-4">
          <Text className="text-3xl font-black text-white">Ticket detail</Text>

          {isLoading || !ticket ? (
            <View className="mt-6 gap-3">
              <Card className="p-4">
                <SkeletonBlock className="h-6 w-3/5" />
                <SkeletonBlock className="mt-3 h-4 w-full" />
                <SkeletonBlock className="mt-2 h-4 w-4/5" />
                <View className="mt-4 flex-row gap-2">
                  <SkeletonBlock className="h-7 w-24 rounded-full" />
                  <SkeletonBlock className="h-7 w-24 rounded-full" />
                </View>
              </Card>
              <Card className="p-4">
                <SkeletonBlock className="h-5 w-28" />
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
                    <Text className="text-2xl font-bold text-white">{ticket.title}</Text>
                    <Text className="mt-3 text-sm leading-6 text-slate-300">{ticket.description}</Text>
                  </View>
                  <View className="items-end gap-2">
                    <Text className={`rounded-full px-3 py-1 text-xs font-semibold ${TICKET_STATUS_COLORS[ticket.status]}`}>
                      {TICKET_STATUS_LABELS[ticket.status]}
                    </Text>
                    <Text className={`rounded-full px-3 py-1 text-xs font-semibold ${PRIORITY_COLORS[ticket.priority]}`}>
                      {PRIORITY_LABELS[ticket.priority]}
                    </Text>
                  </View>
                </View>

                <View className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <Text className="text-xs uppercase tracking-[0.2em] text-slate-500">Metadata</Text>
                  <Text className="mt-2 text-sm text-slate-300">Submitted by {ticket.submittedBy?.name ?? ticket.submittedBy?.email}</Text>
                  <Text className="mt-1 text-sm text-slate-300">Assigned to {ticket.assignedTo?.name ?? "Unassigned"}</Text>
                  <Text className="mt-1 text-sm text-slate-300">Created {new Date(ticket.createdAt).toLocaleString()}</Text>
                </View>
              </Card>

              <View className="mt-6">
                <Text className="text-xl font-bold text-white">Comments</Text>
                <Text className="mt-1 text-sm text-slate-400">Conversation thread attached to this ticket.</Text>
              </View>

              {ticket.comments.length === 0 ? (
                <EmptyState className="mt-4" title="No comments yet" description="Add the first note to keep the handoff moving." />
              ) : (
                <View className="mt-4 gap-3">
                  {ticket.comments.map((comment) => (
                    <Card key={comment.id} className="p-4">
                      <View className="flex-row items-center justify-between">
                        <Text className="font-semibold text-white">{comment.author?.name ?? comment.author?.email ?? "Unknown"}</Text>
                        <Text className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</Text>
                      </View>
                      <Text className="mt-3 text-sm leading-6 text-slate-300">{comment.content}</Text>
                    </Card>
                  ))}
                </View>
              )}

              <Card className="mt-6 p-4">
                <FieldLabel>Add comment</FieldLabel>
                <Controller
                  control={control}
                  name="content"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormInput
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      className="min-h-[120px]"
                      placeholder="Share next steps or a quick update"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={errors.content?.message}
                    />
                  )}
                />
                <PrimaryButton
                  className="mt-4"
                  title={isSubmitting || addComment.isPending ? "Posting..." : "Post comment"}
                  onPress={() => void onSubmit()}
                  loading={isSubmitting || addComment.isPending}
                />
              </Card>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
