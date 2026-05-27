import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { loginSchema, type LoginInput } from "@techdesk-pro/validators";
import { useAuthStore } from "../../store/authStore";

export function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = handleSubmit(async (values) => {
    await login(values);
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-center text-3xl font-bold text-blue-600">TechDesk Pro</h1>
        <p className="mt-2 text-center text-sm text-gray-500">Sign in to your account</p>

        <form className="mt-6 space-y-4" onSubmit={(event) => void onSubmit(event)}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <input
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                  type="email"
                  {...field}
                />
              )}
            />
            {errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email.message}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <input
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                  type="password"
                  {...field}
                />
              )}
            />
            {errors.password ? <p className="mt-1 text-xs text-red-500">{errors.password.message}</p> : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
