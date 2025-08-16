
import { useState, useEffect } from 'react';
import { useYjs } from '../contexts/YjsContext';
import * as Y from 'yjs';

function yMapToJsObject<T>(yMap: Y.Map<any>): T {
    return yMap.toJSON() as T;
}

export function useYjsArray<T>(name: string): T[] {
  const { doc } = useYjs();
  const [array, setArray] = useState<T[]>([]);

  useEffect(() => {
    if (!doc) return;

    const yArray = doc.getArray(name) as Y.Array<Y.Map<any>>;

    const updateArray = () => {
      setArray(yArray.toArray().map(item => (item instanceof Y.Map ? yMapToJsObject<T>(item) : item as T)));
    };
    
    updateArray(); // Initial load

    yArray.observe(updateArray);

    return () => {
      yArray.unobserve(updateArray);
    };
  }, [doc, name]);

  return array;
}
