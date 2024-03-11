import vine from "@vinejs/vine";

export const messageSchema = vine.object({
  body: vine.string(),
  receiver_id: vine.string(),
  conversation_id: vine.string(),
});
