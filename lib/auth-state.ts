export type AuthFieldName =
  | "fullName"
  | "email"
  | "phone"
  | "password"
  | "confirmPassword";

export interface AuthActionState {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: Partial<Record<AuthFieldName, string[]>>;
  values?: Partial<Record<"fullName" | "email" | "phone", string>>;
}

export const INITIAL_AUTH_STATE: AuthActionState = { status: "idle" };
