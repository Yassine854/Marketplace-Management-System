import {
  OrderState,
  OrderStateType,
  allowedTransitions,
  stateActions,
} from "../OrderState";
import { OrderWithRelations } from "../../types/order";
import { toast } from "react-toastify";

export class OpenState extends OrderState {
  name: OrderStateType = "Open";

  async handleUpdate(order: OrderWithRelations): Promise<void> {
    try {
      const response = await fetch(`/api/marketplace/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to update order");
      }

      toast.success("Order updated successfully!");
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
      throw error;
    }
  }

  async handleDelete(orderId: string): Promise<void> {
    try {
      const response = await fetch(`/api/marketplace/orders/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to delete order");
      }

      toast.success("Order deleted successfully!");
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
      throw error;
    }
  }

  canTransitionTo(nextState: string): boolean {
    return allowedTransitions[this.name].includes(nextState as OrderStateType);
  }

  getAvailableActions(): string[] {
    return stateActions[this.name];
  }
}
