import { OrderState } from "../OrderState";
import { OrderContext } from "../OrderContext";
import { ClosedState } from "./ClosedState";
import { CanceledState } from "./CanceledState";

export class CompleteState implements OrderState {
  name = "complete";

  getAvailableActions(): string[] {
    return ["close", "cancel"];
  }

  canTransitionTo(nextState: string): boolean {
    return ["closed", "canceled"].includes(nextState.toLowerCase());
  }

  async handleTransition(
    context: OrderContext,
    nextState: string,
  ): Promise<boolean> {
    if (nextState.toLowerCase() === "closed") {
      // API call to close order would go here
      context.setState(new ClosedState());
      return true;
    } else if (nextState.toLowerCase() === "canceled") {
      // API call to cancel order would go here
      context.setState(new CanceledState());
      return true;
    }
    return false;
  }
}
