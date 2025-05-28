import { IOrderState, OrderContext as IOrderContext } from "./OrderState";
import { OrderWithRelations } from "../types/order";
import { OpenState } from "./concrete/OpenState";

export class OrderContext implements IOrderContext {
  public state: IOrderState;

  constructor() {
    // Initialize with Open state by default
    this.state = new OpenState(this);
  }

  setState(state: IOrderState): void {
    this.state = state;
  }

  getState(): IOrderState {
    return this.state;
  }

  async updateOrder(order: OrderWithRelations): Promise<void> {
    await this.state.handleUpdate(order);
  }

  async deleteOrder(orderId: string): Promise<void> {
    await this.state.handleDelete(orderId);
  }

  // Helper method to check if transition is allowed
  canTransitionTo(nextState: string): boolean {
    return this.state.canTransitionTo(nextState);
  }

  // Get available actions for current state
  getAvailableActions(): string[] {
    return this.state.getAvailableActions();
  }
}
