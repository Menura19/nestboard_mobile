import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { PropertyItem } from "../types/properties";
import { PropertyAPI } from "../api/properties";
import { PropertyType } from "../types/common";

export const usePropertyList = (
  currentPType: PropertyType,
  range: {
    min: number;
    max: number;
  },
  checkedCities: {
    city: string;
    checked: boolean;
  }[],
  triggerFilter: number
) => {
  const isFocused = useIsFocused();
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [fetching, setFetching] = useState(false);
  const limit = 4;
  const [properties, setProperties] = useState<PropertyItem[]>([]);

  useEffect(() => {
    if (isFocused) {
      fetchFirstBatch();
    }
  }, [currentPType, triggerFilter, isFocused]);

  const fetchFirstBatch = async () => {
    setFetching(true);
    setPage(1);

    try {
      const response = await PropertyAPI.getAllProperties(
        1,
        limit,
        currentPType,
        range,
        checkedCities
      );
      setProperties(response.data);
      setHasNext(response.meta.hasNextPage);
      setPage(response.meta.hasNextPage ? 2 : 1);
    } catch {
      setProperties([]);
      setHasNext(false);
    } finally {
      setFetching(false);
    }
  };

  const fetchNextBatch = async () => {
    if (!hasNext || fetching) return;

    setFetching(true);

    try {
      const response = await PropertyAPI.getAllProperties(
        page,
        limit,
        currentPType,
        range,
        checkedCities
      );
      setProperties(oldList => [...oldList, ...response.data]);
      setHasNext(response.meta.hasNextPage);

      if (response.meta.hasNextPage) {
        setPage(currentPage => currentPage + 1);
      }
    } finally {
      setFetching(false);
    }
  };

  return {
    properties,
    fetchNextBatch,
    fetching,
  };
};
