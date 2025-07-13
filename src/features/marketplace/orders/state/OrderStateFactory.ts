import { OrderState } from "./OrderState";
import { NewState } from "./states/NewState";
import { CompleteState } from "./states/CompleteState";
import { ClosedState } from "./states/ClosedState";
import { CanceledState } from "./states/CanceledState";
export class OrderStateFactory {
  static createState(stateName: string): OrderState {
    switch (stateName.toLowerCase()) {
      case "new":
        return new NewState();
      case "complete":
        return new CompleteState();
      case "closed":
        return new ClosedState();
      case "canceled":
        return new CanceledState();
      default:
        return new NewState(); // Default to new state
    }
  }
}
