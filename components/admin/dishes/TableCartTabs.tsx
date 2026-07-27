import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid2X2, List } from "lucide-react"


type Props = {
  value: 'grid' | 'table';
  onValueChange: (value: string) => void;
}


const TableCartTabs = ({value, onValueChange} : Props) => {
  return (
    <Tabs value={value} defaultValue={"grid"} onValueChange={onValueChange}>
  <TabsList>
    <TabsTrigger value="grid"><Grid2X2/></TabsTrigger>
    <TabsTrigger value="table"><List/></TabsTrigger>
  </TabsList>
</Tabs>
  )
}

export default TableCartTabs