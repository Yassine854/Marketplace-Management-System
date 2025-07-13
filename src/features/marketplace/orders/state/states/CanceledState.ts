import { OrderState } from "../OrderState";
import { OrderContext } from "../OrderContext";

export class CanceledState implements OrderState {
  name = "canceled";

  getAvailableActions(): string[] {
    return []; // No further actions available
  }

  canTransitionTo(nextState: string): boolean {
    return false; // Cannot transition from canceled state
  }

  async handleTransition(
    context: OrderContext,
    nextState: string,
  ): Promise<boolean> {
    return false; // No transitions allowed
  }
}
