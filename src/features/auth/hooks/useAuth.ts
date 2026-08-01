"use client";
import type { ApiResponse } from "@/shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth.api";
import { useLocale } from "next-intl";
import { AcceptInvitePayload, AuthUser, ChangePasswordPayload, ForgotPasswordPayload, InviteUserPayload, ResetPasswordPayload, VerifyTokenPayload } from "../types/auth.types";

export const useAcceptInvite = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();
  return useMutation({
    mutationFn: (data: AcceptInvitePayload) => authApi.acceptInvite(data),
    onSuccess: (response) => {
      const cachedUserResponse: ApiResponse<{ user: AuthUser }> = {
        success: true,
        message: response.message || "Invitation accepted",
        statusCode: response.statusCode || 200,
        data: { user: response.data.user },
        errors: undefined,
      };
      queryClient.setQueryData(["auth", "me"], cachedUserResponse);
      router.push(`/${locale}/admin`);
      router.refresh();
    },
  });
};

export const useChangePassword = () =>
  useMutation({
    mutationFn: (data: ChangePasswordPayload) => authApi.changePassword(data),
  });

export const useCurrentUser = () =>
  useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (data: ForgotPasswordPayload) => authApi.forgotPassword(data),
  });

export const useInviteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InviteUserPayload) => authApi.invite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const cachedUserResponse: ApiResponse<{ user: AuthUser }> = {
        success: true,
        message: response.message || "Authenticated",
        statusCode: response.statusCode || 200,
        data: { user: response.data.user },
        errors: undefined,
      };
      queryClient.setQueryData(["auth", "me"], cachedUserResponse);
      router.push(`/${locale}/admin`);
      router.refresh();
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
      router.push(`/${locale}/login`);
      router.refresh();
    },
  });
};

export const useResetPassword = () =>
  useMutation({
    mutationFn: (data: ResetPasswordPayload) => authApi.resetPassword(data),
  });

export const useVerifyToken = () =>
  useMutation({
    mutationFn: (data: VerifyTokenPayload) => authApi.verifyToken(data),
  });
