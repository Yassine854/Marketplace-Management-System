import { OrderWithRelations } from "../types/order";

// Interface defining the contract for order states
export interface IOrderState {
  name: string;
  handleUpdate(order: OrderWithRelations): Promise<void>;
  handleDelete(orderId: string): Promise<void>;
  canTransitionTo(nextState: string): boolean;
  getAvailableActions(): string[];
}

// Order context that maintains the current state
export interface OrderContext {
  state: IOrderState;
  setState(state: IOrderState): void;
  getState(): IOrderState;
  updateOrder(order: OrderWithRelations): Promise<void>;
  deleteOrder(orderId: string): Promise<void>;
}

// Base state class that implements common functionality
export abstract class OrderState implements IOrderState {
  protected context: OrderContext;
  abstract name: string;

  constructor(context: OrderContext) {
    this.context = context;
  }

  abstract handleUpdate(order: OrderWithRelations): Promise<void>;
  abstract handleDelete(orderId: string): Promise<void>;
  abstract canTransitionTo(nextState: string): boolean;
  abstract getAvailableActions(): string[];
}

// Types for order states
export type OrderStateType =
  | "Open"
  | "Valid"
  | "ReadyToShip"
  | "Shipped"
  | "Delivered"
  | "Archived"
  | "Canceled"
  | "Unpaid";

// Define allowed transitions for each state
export const allowedTransitions: Record<OrderStateType, OrderStateType[]> = {
  Open: ["Valid", "Canceled"],
  Valid: ["ReadyToShip", "Open", "Canceled"],
  ReadyToShip: ["Shipped", "Canceled"],
  Shipped: ["Delivered", "Unpaid"],
  Delivered: ["Archived"],
  Archived: [],
  Canceled: [],
  Unpaid: ["Delivered"],
};

// Available actions for each state
export const stateActions: Record<OrderStateType, string[]> = {
  Open: ["edit", "setToValid", "cancel", "pickList"],
  Valid: ["edit", "setToReadyToShip", "setBackToOpen", "cancel", "pickList"],
  ReadyToShip: ["edit", "setToShipped", "cancel", "pickList"],
  Shipped: ["edit", "setToUnpaid", "setToDelivered", "cancel", "pickList"],
  Delivered: ["setToArchived", "pickList"],
  Archived: ["pickList"],
  Canceled: ["pickList"],
  Unpaid: ["setToDelivered", "pickList"],
};
