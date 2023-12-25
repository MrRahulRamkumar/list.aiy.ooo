export const NEW_ITEM_CHANNEL = "shopping-list:new-item";
export const COMPLETE_ITEM_CHANNEL = "shopping-list:complete-item";
export const DELETE_ITEM_CHANEL = "shopping-list:delete-item";
export const JOIN_ROOM_CHANNEL = "shopping-list:join-room";
export const CHANNELS = [
  NEW_ITEM_CHANNEL,
  COMPLETE_ITEM_CHANNEL,
  DELETE_ITEM_CHANEL,
  JOIN_ROOM_CHANNEL,
] as const;
export type Channel = (typeof CHANNELS)[number];
