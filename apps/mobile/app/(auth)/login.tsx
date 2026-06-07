import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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
      if (axios.isAxiosError(error) && !error.response) {
        setSubmitError(
          "Cannot reach the server. Make sure the backend is running on your PC (port 3000) and your phone is on the same Wi-Fi."
        );
        return;
      }

      setError("password", { type: "manual", message: "Invalid email or password" });
      setSubmitError("Invalid email or password. Check your credentials and try again.");
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
}
