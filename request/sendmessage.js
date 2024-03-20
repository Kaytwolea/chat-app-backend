import vine from "@vinejs/vine";

export const messageSchema = vine.object({
  body: vine.string().optional(),
  receiver_id: vine.string(),
  conversation_id: vine.string(),
  image: vine.string().optional(),
});
