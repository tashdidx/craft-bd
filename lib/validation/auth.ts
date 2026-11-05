import "server-only";

import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .max(254, "Use 254 characters or fewer.")
  .email("Enter a valid email address.")
  .transform((value) => value.toLowerCase());

const newPasswordField = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(72, "Use 72 characters or fewer.")
  .regex(/[A-Za-z]/, "Include at least one letter.")
  .regex(/[0-9]/, "Include at least one number.");

export const signInSchema = z.object({
  email: emailField,
  password: z
    .string()
    .min(1, "Enter your password.")
    .max(72, "Use 72 characters or fewer."),
});

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Use at least 2 characters.")
      .max(80, "Use 80 characters or fewer."),
    email: emailField,
    password: newPasswordField,
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match.",
  });

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z
  .object({
    password: newPasswordField,
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match.",
  });

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Use at least 2 characters.")
    .max(80, "Use 80 characters or fewer."),
  phone: z
    .string()
    .trim()
    .max(30, "Use 30 characters or fewer.")
    .refine(
      (value) => value === "" || /^[0-9+()\-\s]{6,30}$/.test(value),
      "Enter a valid phone number.",
    ),
});
