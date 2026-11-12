export const REVIEW_FIELD_NAMES = ["rating", "title", "comment"] as const;

export type ReviewFieldName = (typeof REVIEW_FIELD_NAMES)[number];

export interface ReviewActionState {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: Partial<Record<ReviewFieldName, string[]>>;
  values?: Partial<Record<ReviewFieldName, string>>;
}

export const INITIAL_REVIEW_STATE: ReviewActionState = { status: "idle" };
