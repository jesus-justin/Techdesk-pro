import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View, type TextInputProps } from "react-native";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <View className={`rounded-3xl border border-slate-800 bg-slate-900/90 ${className}`}>{children}</View>;
}

export function FieldLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <Text className={`text-sm font-semibold text-slate-200 ${className}`}>{children}</Text>;
}

export function FieldError({ message }: { message?: string | null }) {
  if (!message) {
    return null;
  }

  return <Text className="mt-2 text-sm font-medium text-rose-400">{message}</Text>;
}

export function FormInput({ className = "", error, ...props }: TextInputProps & { error?: string | null }) {
  return (
    <View>
      <TextInput
        {...props}
        placeholderTextColor="#64748b"
        className={`rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-white ${className}`}
      />
      <FieldError message={error} />
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
  loading = false,
  className = ""
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  className?: string;
}) {
  return (
    <Pressable
      className={`items-center rounded-2xl bg-brand-500 px-4 py-4 active:opacity-80 ${className}`}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? <ActivityIndicator color="#020617" /> : <Text className="text-base font-extrabold text-slate-950">{title}</Text>}
    </Pressable>
  );
}

export function EmptyState({
  title,
  description,
  className = ""
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <View className={`items-center rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 px-5 py-8 ${className}`}>
      <Text className="text-lg font-bold text-white">{title}</Text>
      <Text className="mt-2 text-center text-sm leading-6 text-slate-400">{description}</Text>
    </View>
  );
}

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <View className={`rounded-2xl bg-slate-800/80 ${className}`} />;
}

export function Pill({ label, className = "" }: { label: string; className?: string }) {
  return <Text className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{label}</Text>;
}

export function StatCard({ label, value, accentClassName }: { label: string; value: string; accentClassName: string }) {
  return (
    <Card className="p-4">
      <View className={`mb-4 h-1.5 w-14 rounded-full ${accentClassName}`} />
      <Text className="text-sm font-semibold text-slate-400">{label}</Text>
      <Text className="mt-2 text-3xl font-black text-white">{value}</Text>
    </Card>
  );
}