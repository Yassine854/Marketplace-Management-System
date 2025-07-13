import { OrderState } from "../OrderState";
import { OrderContext } from "../OrderContext";

export class ClosedState implements OrderState {
  name = "closed";

  getAvailableActions(): string[] {
    return []; // No further actions available
  }

  canTransitionTo(nextState: string): boolean {
    return false; // Cannot transition from closed state
  }

  async handleTransition(
    context: OrderContext,
    nextState: string,
  ): Promise<boolean> {
    return false; // No transitions allowed
  }
}
