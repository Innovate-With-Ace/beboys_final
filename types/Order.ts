
import { OrderItems } from "./OrderItem";

export type orderStatus = "pending" | "preparing" | "cancelled" | "completed";

export type Order = {
    id : string;
    items : OrderItems[];
    cashier : string;
    total : number;
    status : orderStatus,
    created_at : string;
}


