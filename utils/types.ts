export interface CtxState {
  userToken: string | null;
}

export interface User {
  id: string;
  name: string;
}

type RoomState = "estimating" | "viewing";

export interface RoomMember extends User {
  estimate?: number;
}

export interface RoomData {
  id: string;
  adminId: string;
  userIds: string[];
  estimates: { [key: string]: number };

  state: RoomState;
}

export interface Room {
  id: string;
  adminId: string;
  users: RoomMember[];
  state: RoomState;
}

export interface SyncMessage {
  roomData: RoomData;
}

export type UserMessage = {
  type: "estimate";
  estimate: number;
} | {
  type: "toggleState";
};
