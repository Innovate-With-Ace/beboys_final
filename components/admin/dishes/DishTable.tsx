import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDishStore } from "@/stores/DishStore"
import { useDishEditorStore } from "@/stores/DishEditorStore"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Soup } from "lucide-react"

const DishTable = () => {
  const { dishes } = useDishStore()
  const openForEdit = useDishEditorStore((s) => s.openForEdit)

  return (
    <Table>
      <TableCaption>A list of all dishes on the menu.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Servings</TableHead>
          <TableHead>Available</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {dishes.map((dish) => (
          <TableRow key={dish.id}>
            <TableCell className="w-14">
              <div className="relative size-10 rounded-md overflow-hidden bg-bg-muted flex items-center justify-center shrink-0">
                {dish.image ? (
                  <Image src={dish.image} alt={dish.name} fill className="object-cover" />
                ) : (
                  <Soup className="size-4 text-muted-foreground" />
                )}
              </div>
            </TableCell>
            <TableCell className="font-medium">{dish.name}</TableCell>
            <TableCell>₱{dish.price.toFixed(2)}</TableCell>
            <TableCell>{dish.servings_left}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  dish.isAvailable
                    ? "text-success border-success/30 bg-success/10"
                    : "text-error border-error/30 bg-error/10"
                }
              >
                {dish.isAvailable ? "Available" : "Unavailable"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" onClick={() => openForEdit(dish)}>
                Modify
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default DishTable