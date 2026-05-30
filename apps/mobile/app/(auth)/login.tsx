import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useState } from "react";
import { loginSchema, type LoginInput } from "@techdesk-pro/validators";
import { Card, FieldError, FieldLabel, FormInput, PrimaryButton } from "../../components/ui";
import { useAuthStore } from "../../store/authStore";

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setSubmitError(null);
      await login(values);
      router.replace("/(tabs)/dashboard");
    } catch (error) {
      setError("password", { type: "manual", message: "Invalid email or password" });
      setSubmitError(error instanceof Error ? error.message : "Unable to sign in");
    }
  });

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerClassName="flex-grow px-4 py-10">
          <View className="flex-1 justify-center">
            <View className="mb-8 items-center">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-3xl bg-brand-500/20">
                <Text className="text-2xl font-black text-brand-300">T</Text>
              </View>
              <Text className="text-3xl font-black text-white">TechDesk Pro</Text>
              <Text className="mt-2 text-center text-sm text-slate-400">
                Service operations, asset control, and ticketing in one place.
              </Text>
            </View>

            <Card className="p-5">
              <Text className="text-xl font-bold text-white">Welcome back</Text>
              <Text className="mt-1 text-sm text-slate-400">Sign in with your backend account.</Text>

              <FieldLabel className="mt-5">Email</FieldLabel>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="you@company.com"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.email?.message}
                  />
                )}
              />

              <FieldLabel className="mt-4">Password</FieldLabel>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    secureTextEntry
                    placeholder="Your password"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.password?.message}
                  />
                )}
              />

              {submitError ? <FieldError message={submitError} /> : null}

              <PrimaryButton
                className="mt-6"
                title={isSubmitting ? "Signing in..." : "Sign in"}
                onPress={() => void onSubmit()}
                loading={isSubmitting}
              />
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}import { zodResolver } from "@hookform/resolvers/zod";
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
