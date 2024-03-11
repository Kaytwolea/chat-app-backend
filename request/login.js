import vine from "@vinejs/vine";

export const loginSchema = vine.object({
  email: vine.string().email().trim(),
  password: vine.string(),
});
