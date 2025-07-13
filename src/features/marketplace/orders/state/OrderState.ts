import type { OrderContext } from "./OrderContext";
export interface OrderState {
  name: string;
  getAvailableActions(): string[];
  canTransitionTo(nextState: string): boolean;
  handleTransition(context: OrderContext, nextState: string): Promise<boolean>;
}
