import type { MousePosition } from '@/components/ContextMenu/ContextMenu';

import { useCallback, useEffect, useRef, useState } from 'react';

const useContextMenu = () => {
  const contextMenuRef = useRef<HTMLUListElement>(null);
  const [contextMenu, setContextMenu] = useState<MousePosition>(null);

  const hideContextMenu = useCallback(() => {
    setContextMenu(null);
  }, [setContextMenu]);

  const handleContextMenu = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return { contextMenu, contextMenuRef, handleContextMenu, hideContextMenu };
};

export default useContextMenu;
