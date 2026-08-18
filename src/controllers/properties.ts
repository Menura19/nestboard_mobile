import { useEffect, useState } from "react"
import { PropertyAPI } from "../api/properties"
import { PropertyItem } from "../types/properties"

export const useGetProperties = () => {
  const [properties, setProperties] = useState<PropertyItem[]>([])
  const [page] = useState(1)

  useEffect(() => {
    PropertyAPI.getAllProperties(
      page,
      10,
      "All",
      { min: 0, max: 0 },
      []
    ).then((data) => {
      setProperties((current) => [...current, ...data.data])
    })
  }, [page])

  return {
    properties,
  }
}
