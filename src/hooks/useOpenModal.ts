import { useEffect, useState } from "react";

type FetcherFn<T> = (id: number) => {
  data?: T;
  refetch: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  isFetching: boolean;
};

export function useOpenModal<T>(defaultData: T, fetcher: FetcherFn<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<T>(defaultData);

  const { data, refetch, isLoading, isFetching, isSuccess } = fetcher(
    selectedId!
  );

  const handleOpen = (id?: number) => {
    if (id !== undefined) {
      if (id === selectedId) {
        refetch();
      } else {
        setSelectedId(id);
      }
    } else {
      setInitialData(defaultData);
    }
    setIsOpen(true);
  };

  useEffect(() => {
    if (data) {
      setInitialData(data);
    }
  }, [data]);

  return {
    handleOpen,
    data: initialData,
    isOpen,
    setIsOpen,
    setSelectedId,
    isLoading: isFetching || isLoading,
    isSuccess,
  };
}
