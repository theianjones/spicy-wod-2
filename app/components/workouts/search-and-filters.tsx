import { Input } from "~/components/ui/input"
import { Form, useSearchParams } from "react-router"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { MultiSelect } from "~/components/ui/multi-select"
import { Movement, Workout } from "~/schemas/models"
import { useRef } from "react"
import { useDebouncedCallback } from "use-debounce"

interface SearchAndFiltersProps {
  movements: Movement[]
}

export function SearchAndFilters({ movements }: SearchAndFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const formRef = useRef<HTMLFormElement>(null)
  const debouncedSearchParams = useDebouncedCallback(
    (searchParams: URLSearchParams) => {
      setSearchParams(searchParams, { replace: true, preventScrollReset: true })
    },
    300
  )

  // Handle search input changes
  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set("name", value)
    } else {
      params.delete("name")
    }
    debouncedSearchParams(params)
  }

  // Handle scheme selection
  function handleSchemeChange(value: string) {
    const params = new URLSearchParams(searchParams)
    if (value && value !== "all") {
      params.set("scheme", value)
    } else {
      params.delete("scheme")
    }
    debouncedSearchParams(params)
  }

  // Handle movement selection
  function handleMovementsChange(values: string[]) {
    const params = new URLSearchParams(searchParams)
    params.delete("movements")
    values.forEach(value => {
      params.append("movements", value)
    })
    debouncedSearchParams(params)
  }

  const movementOptions = movements.map(movement => ({
    label: movement.name,
    value: movement.id,
  }))

  return (
    <Form ref={formRef} className="flex flex-row w-full gap-4">
      <Input
        type="search"
        name="name"
        placeholder="Search workouts..."
        className="flex font-medium text-sm text-muted-foreground w-full p-2 border-[3px] border-black min-h-12 h-auto items-center justify-between bg-white hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-100 [&_svg]:pointer-events-auto max-w-md focus:border-none"
        defaultValue={searchParams.get("name") || ""}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className="flex items-center gap-4 w-full">
        <MultiSelect
          name="movements"
          options={movementOptions}
          placeholder="Filter by movements"
          defaultValue={searchParams.getAll("movements")}
          onValueChange={handleMovementsChange}
          className="max-w-[455px]"
          maxCount={2}
        />
        
        <Select 
          name="scheme"
          defaultValue={searchParams.get("scheme") || "all"} 
          onValueChange={handleSchemeChange}
        >
          <SelectTrigger className="rounded-none border-black w-fit whitespace-nowrap min-w-[120px]">
            <SelectValue placeholder="Filter by scheme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All schemes</SelectItem>
            <SelectItem value="time" className="whitespace-nowrap">Time</SelectItem>
            <SelectItem value="time-with-cap" className="whitespace-nowrap">Time with Cap</SelectItem>
            <SelectItem value="pass-fail" className="whitespace-nowrap">Pass/Fail</SelectItem>
            <SelectItem value="rounds-reps" className="whitespace-nowrap">Rounds & Reps</SelectItem>
            <SelectItem value="reps" className="whitespace-nowrap">Reps</SelectItem>
            <SelectItem value="emom" className="whitespace-nowrap">EMOM</SelectItem>
            <SelectItem value="load" className="whitespace-nowrap">Load</SelectItem>
            <SelectItem value="calories" className="whitespace-nowrap">Calories</SelectItem>
            <SelectItem value="points" className="whitespace-nowrap">Points</SelectItem>
            <SelectItem value="meters" className="whitespace-nowrap">Meters</SelectItem>
            <SelectItem value="feet" className="whitespace-nowrap">Feet</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Form>
  )
}