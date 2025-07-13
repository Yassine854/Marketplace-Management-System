import { OrderState } from "../OrderState";
import { OrderContext } from "../OrderContext";
import { CompleteState } from "./CompleteState";
import { CanceledState } from "./CanceledState";

export class NewState implements OrderState {
  name = "new";

  getAvailableActions(): string[] {
    return ["complete", "canceled"];
  }

  canTransitionTo(nextState: string): boolean {
    return ["complete", "canceled"].includes(nextState.toLowerCase());
  }

  async handleTransition(
    context: OrderContext,
    nextState: string,
  ): Promise<boolean> {
    if (nextState.toLowerCase() === "complete") {
      // API call to update order status would go here
      context.setState(new CompleteState());
      return true;
    } else if (nextState.toLowerCase() === "canceled") {
      // API call to cancel order would go here
      context.setState(new CanceledState());
      return true;
    }
    return false;
  }
}
