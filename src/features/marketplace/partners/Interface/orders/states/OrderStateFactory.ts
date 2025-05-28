import { OrderContext } from "./OrderContext";
import { IOrderState, OrderStateType } from "./OrderState";
import { OpenState } from "./concrete/OpenState";
// Import other state classes as they are created

export class OrderStateFactory {
  static createState(
    stateName: OrderStateType,
    context: OrderContext,
  ): IOrderState {
    switch (stateName) {
      case "Open":
        return new OpenState(context);
      // Add cases for other states as they are implemented
      default:
        throw new Error(`Unknown state: ${stateName}`);
    }
  }
}
