import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Order, orderStatus } from "@/types/Order"
import { Button } from "@/components/ui/button"

type Props = {
  orders: Order[]
}

const statusConfig: Record<orderStatus, { className: string; label: string }> = {
  cancelled: {
    className: "inline-block bg-error/10 px-2.5 py-1 rounded-md text-error text-xs text-center font-medium",
    label: "Cancelled",
  },
  completed: {
    className: "inline-block bg-brand-primary/10 px-2.5 py-1 rounded-md text-brand-primary text-xs text-center font-medium",
    label: "Completed",
  },
  pending: {
    className: "inline-block bg-brand-secondary/10 px-2.5 py-1 rounded-md text-brand-secondary text-xs text-center font-medium",
    label: "Pending",
  },
  preparing: {
    className: "inline-block bg-brand-secondary/10 px-2.5 py-1 rounded-md text-brand-secondary text-xs text-center font-medium",
    label: "Preparing",
  },
}

const OrdersTable = ({ orders }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">#</TableHead>
          <TableHead className="text-center">Items</TableHead>
          <TableHead className="text-center">Cashier</TableHead>
          <TableHead className="text-center">Total</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Time</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((order) => {
          const totalAmount = order.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          )

          const currentStatus = statusConfig[order.status]

          return (
            <TableRow
              key={order.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <TableCell className="text-center">{order.id}</TableCell>

              <TableCell className="max-w-50 truncate text-center">
                {order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
              </TableCell>

              <TableCell className="text-center">{order.cashier}</TableCell>

              <TableCell className="text-center">₱{totalAmount.toFixed(2)}</TableCell>

              <TableCell className="text-center">
                <span className={currentStatus?.className}>
                  {currentStatus?.label ?? order.status}
                </span>
              </TableCell>

              <TableCell className="text-center">
                {new Date(order.created_at).toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  minute: "numeric",
                  hour: "numeric",
                })}
              </TableCell>

              <TableCell className="text-center">
                <Button variant={"outline"} size={"sm"} className={"text-xs"}>View</Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default OrdersTable