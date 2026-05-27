import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { loginSchema, type LoginInput } from "@techdesk-pro/validators";
import { useAuthStore } from "../../store/authStore";

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    await login(values);
    router.replace("/(tabs)/dashboard");
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        className="flex-1 items-center justify-center px-6"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
          <Text className="text-center text-3xl font-bold text-primary">TechDesk Pro</Text>
          <Text className="mt-2 text-center text-gray-500">Sign in to continue</Text>

          <Text className="mt-6 mb-2 text-sm font-medium text-gray-700">Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                autoCapitalize="none"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
                placeholder="you@company.com"
              />
            )}
          />
          {errors.email ? <Text className="mt-1 text-xs text-danger">{errors.email.message}</Text> : null}

          <Text className="mt-4 mb-2 text-sm font-medium text-gray-700">Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                placeholder="Password"
              />
            )}
          />
          {errors.password ? <Text className="mt-1 text-xs text-danger">{errors.password.message}</Text> : null}

          <TouchableOpacity
            className="mt-6 rounded-xl bg-primary py-3"
            disabled={isSubmitting}
            onPress={() => void onSubmit()}
          >
            <Text className="text-center font-semibold text-white">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
