import { z } from "zod";
import { userRoleEnumSchema } from "./schema";

const VALID_ERRORS = {
  required: "Поле обязательно",
};

export const userMutationSchema = z
  .object({
    email: z.string().email(),
    role: userRoleEnumSchema,
    balance: z
      .string()
      .min(1, "Поле обязательно")
      .regex(
        /^\d+$/,
        "Поле должно содержать только цифры"
      ),
    password: z
      .string()
      .optional()
      .transform((pwd) => pwd?.trim()),
    confirmPassword: z
      .string()
      .optional()
      .transform((pwd) => pwd?.trim()),
    isEdit: z.boolean(),
  })
  .superRefine(
    (
      {
        isEdit,
        password,
        confirmPassword,
      },
      ctx
    ) => {
      if (
        !isEdit ||
        (isEdit && !!password)
      ) {
        if (password === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              VALID_ERRORS.required,
            path: ["password"],
          });
        }

        if (
          password?.length &&
          password.length < 8
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Пароль слишком маленький",
            path: ["password"],
          });
        }

        if (
          password !== confirmPassword
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Пароли не совпадают",
            path: ["confirmPassword"],
          });
        }
      }
    }
  );

export type UserMutation = z.infer<
  typeof userMutationSchema
>;
