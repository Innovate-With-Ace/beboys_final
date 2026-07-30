import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Categories } from "@/types/Categories"

export const mockCategories: Categories[] = [
  {
    id: '05a87e23-b890-4580-a09a-a95429fdca84',
    label: 'Main Dishes',
    created_at: '2025-01-10T08:00:00Z',
    updated_at: '2025-01-10T08:00:00Z',
  },
  {
    id: '2',
    label: 'Soups',
    created_at: '2025-01-10T08:05:00Z',
    updated_at: '2025-01-10T08:05:00Z',
  },
  {
    id: '3',
    label: 'Noodles',
    created_at: '2025-01-10T08:10:00Z',
    updated_at: '2025-02-15T10:30:00Z',
  },
  {
    id: '4',
    label: 'Rice & Sides',
    created_at: '2025-01-10T08:15:00Z',
    updated_at: '2025-01-10T08:15:00Z',
  },
  {
    id: '5',
    label: 'Beverages',
    created_at: '2025-01-10T08:20:00Z',
    updated_at: '2025-03-01T14:00:00Z',
  },
  {
    id: '6',
    label: 'Appetizers',
    created_at: '2025-01-12T09:00:00Z',
    updated_at: '2025-01-12T09:00:00Z',
  },
  {
    id: '7',
    label: 'Desserts',
    created_at: '2025-01-12T09:10:00Z',
    updated_at: '2025-01-12T09:10:00Z',
  },
]

type Props = {
  selectedCategoryId?: string
  onSelectCategory?: (categoryId: string) => void
}

const CategoriesSelect = ({ selectedCategoryId, onSelectCategory }: Props) => {
  return (
    <Select
      value={selectedCategoryId}
      onValueChange={onSelectCategory}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Categories" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {mockCategories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id} label={cat.label}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default CategoriesSelect