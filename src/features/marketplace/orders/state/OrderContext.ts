import { OrderState } from "./OrderState";

export class OrderContext {
  private state: OrderState;
  private orderId: string;

  constructor(initialState: OrderState, orderId: string) {
    this.state = initialState;
    this.orderId = orderId;
  }

  getState(): OrderState {
    return this.state;
  }

  setState(newState: OrderState): void {
    this.state = newState;
  }

  getOrderId(): string {
    return this.orderId;
  }

  getAvailableActions(): string[] {
    return this.state.getAvailableActions();
  }

  async requestTransition(nextState: string): Promise<boolean> {
    if (this.state.canTransitionTo(nextState)) {
      return await this.state.handleTransition(this, nextState);
    }
    return false;
  }
}
