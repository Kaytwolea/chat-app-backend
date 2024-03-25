import vine from "@vinejs/vine";

export const registerSchema = vine.object({
  user_name: vine.string().toLowerCase(),
  email: vine.string().email().toLowerCase().trim(),
  password: vine.string().confirmed(),
  role: vine.string().optional(),
});
