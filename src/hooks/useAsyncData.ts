import { useEffect, useState } from 'react';

type AsyncDataState<TData> = {
  data: TData | null;
  error: Error | null;
  isLoading: boolean;
};

type UseAsyncDataOptions = {
  refetchOnWindowFocus?: boolean;
};

export function useAsyncData<TData>(
  loadData: () => Promise<TData>,
  { refetchOnWindowFocus = false }: UseAsyncDataOptions = {},
) {
  const [state, setState] = useState<AsyncDataState<TData>>({
    data: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setState((currentState) => ({
        ...currentState,
        error: null,
        isLoading: true,
      }));

      try {
        const data = await loadData();

        if (isMounted) {
          setState({ data, error: null, isLoading: false });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            error: error instanceof Error ? error : new Error('Request failed'),
            isLoading: false,
          });
        }
      }
    }

    load();

    if (!refetchOnWindowFocus) {
      return () => {
        isMounted = false;
      };
    }

    window.addEventListener('focus', load);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', load);
    };
  }, [loadData, refetchOnWindowFocus]);

  return state;
}
