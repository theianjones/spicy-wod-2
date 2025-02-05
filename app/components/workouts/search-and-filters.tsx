import { Input } from "~/components/ui/input"
import { Link } from "react-router"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { MultiSelect } from "~/components/ui/multi-select"

interface SearchAndFiltersProps {
  searchQuery: string
  selectedScheme: string
  selectedMovements: string[]
  uniqueSchemes: string[]
  uniqueMovements: string[]
  onSearchChange: (value: string) => void
  onSchemeChange: (value: string) => void
  onMovementsChange: (value: string[]) => void
}

export function SearchAndFilters({
  searchQuery,
  selectedScheme,
  selectedMovements,
  uniqueSchemes,
  uniqueMovements,
  onSearchChange,
  onSchemeChange,
  onMovementsChange,
}: SearchAndFiltersProps) {
  const movementOptions = uniqueMovements.map(movement => ({
    label: movement,
    value: movement,
  }))

  return (
    <div className="flex flex-row w-full gap-4">
        <Input
          type="search"
          placeholder="Search workouts..."
          className="flex font-medium text-sm text-muted-foreground w-full p-2 border-[3px] border-black min-h-12 h-auto items-center justify-between bg-white hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-100 [&_svg]:pointer-events-auto max-w-md focus:border-none"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="flex items-center gap-4 w-full">
          <MultiSelect
            options={movementOptions}
            placeholder="Filter by movements"
            onValueChange={onMovementsChange}
            className="max-w-[455px]"
            maxCount={2}
          />
          
          <Select value={selectedScheme} onValueChange={onSchemeChange}>
            <SelectTrigger className="rounded-none border-black w-fit whitespace-nowrap min-w-[120px]">
              <SelectValue placeholder="Filter by scheme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" >All schemes</SelectItem>
              {uniqueSchemes.map((scheme) => (
                <SelectItem key={scheme} value={scheme} className="whitespace-nowrap">
                  {scheme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
    </div>
  )
}