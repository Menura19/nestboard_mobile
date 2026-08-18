import { useCallback, useEffect, useRef, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import { PropertyItem } from '../types/properties'
import { PropertyAPI } from '../api/properties'
import { PropertyType } from '../types/common'

export const usePropertyList = (
  currentPType: PropertyType,
  range: {
    min: number
    max: number
  },
  checkedCities: {
    city: string
    checked: boolean
  }[],
  triggerFilter: number
) => {
  const isFocused = useIsFocused()
  const limit = 4

  const [properties, setProperties] = useState<PropertyItem[]>([])
  const [fetching, setFetching] = useState(false)

  const nextPageRef = useRef(1)
  const hasNextRef = useRef(false)
  const requestRunningRef = useRef(false)
  const requestVersionRef = useRef(0)

  useEffect(() => {
    if (!isFocused) return

    const requestVersion = ++requestVersionRef.current

    const fetchFirstBatch = async () => {
      requestRunningRef.current = true
      setFetching(true)
      nextPageRef.current = 1
      hasNextRef.current = false

      try {
        const response = await PropertyAPI.getAllProperties(
          1,
          limit,
          currentPType,
          range,
          checkedCities
        )

        if (requestVersion !== requestVersionRef.current) return

        const uniqueProperties = Array.from(
          new Map(
            response.data.map(property => [property.id, property])
          ).values()
        )

        setProperties(uniqueProperties)
        hasNextRef.current = response.meta.hasNextPage
        nextPageRef.current = 2
      } catch {
        if (requestVersion === requestVersionRef.current) {
          setProperties([])
          hasNextRef.current = false
        }
      } finally {
        if (requestVersion === requestVersionRef.current) {
          requestRunningRef.current = false
          setFetching(false)
        }
      }
    }

    fetchFirstBatch()
  }, [currentPType, triggerFilter, isFocused])

  const fetchNextBatch = useCallback(async () => {
    if (
      requestRunningRef.current ||
      !hasNextRef.current ||
      !isFocused
    ) {
      return
    }

    requestRunningRef.current = true
    setFetching(true)

    const requestedPage = nextPageRef.current
    const requestVersion = requestVersionRef.current

    try {
      const response = await PropertyAPI.getAllProperties(
        requestedPage,
        limit,
        currentPType,
        range,
        checkedCities
      )

      if (requestVersion !== requestVersionRef.current) return

      setProperties(currentProperties => {
        const propertyMap = new Map<string, PropertyItem>()

        currentProperties.forEach(property => {
          propertyMap.set(property.id, property)
        })

        response.data.forEach(property => {
          propertyMap.set(property.id, property)
        })

        return Array.from(propertyMap.values())
      })

      hasNextRef.current = response.meta.hasNextPage
      nextPageRef.current = requestedPage + 1
    } catch {
      // Preserve properties that have already loaded.
    } finally {
      if (requestVersion === requestVersionRef.current) {
        requestRunningRef.current = false
        setFetching(false)
      }
    }
  }, [checkedCities, currentPType, isFocused, range])

  return {
    properties,
    fetchNextBatch,
    fetching,
  }
}