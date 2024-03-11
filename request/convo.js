import vine from "@vinejs/vine";

export const convoSchema = vine.object({
  receiver_id: vine.string(),
});
