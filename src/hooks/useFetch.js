import { useEffect, useReducer } from 'react';

const initialState = {
  loading: true,
  error: null,
  data: null,
};

function fetchReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { loading: true, error: null, data: null };
    case 'FETCH_SUCCESS':
      return { loading: false, error: null, data: action.payload };
    case 'FETCH_ERROR':
      return { loading: false, error: action.payload, data: null };
    default:
      return state;
  }
}

export function useFetch(fetchFn, deps = []) {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'FETCH_START' });

    fetchFn(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError' && !controller.signal.aborted) {
          dispatch({ type: 'FETCH_ERROR', payload: err.message || 'Something went wrong' });
        }
      });

    return () => {
      controller.abort();
    };
  }, deps);

  return state;
}