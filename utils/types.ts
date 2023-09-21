export interface CtxState {
  user: User | null;
}

export interface User {
  id: string;
  name: string;
}

export interface RoomMember extends User {
  estimate?: number;
}

export interface Room {
  id: string;
  adminId: string;
}

export interface RoomState extends Room {
  members: RoomMember[];
  mode: "hidden" | "revealed";
}
export type UserAction = {
  type: "estimate";
  estimate: number;
} | {
  type: "toggle";
};
export interface RoomUpdateMessage {
  room: RoomState;
}

export interface MembershipMessage {
  type: "join" | "leave";
  user: User;
  roomId: string;
}

export interface UserActionMessage {
  userId: string;
  roomId: string;
  action: UserAction;
}
