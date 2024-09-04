import { useEffect, type RefObject } from 'react';

const useOutsideClick = (ref: RefObject<HTMLElement>, handler: (event: MouseEvent) => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [ref, handler]);
};

export default useOutsideClick;
