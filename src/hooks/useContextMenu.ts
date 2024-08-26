import type { MousePosition } from '@/components/ContextMenu/ContextMenu';

import { useRef, useState } from 'react';
import useOutsideClick from './useOutsideClick';

const useContextMenu = () => {
  const contextMenuRef = useRef<HTMLUListElement>(null);
  const [contextMenu, setContextMenu] = useState<MousePosition>(null);

  const handleContextMenu = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
    });
  };

  useOutsideClick(contextMenuRef, () => setContextMenu(null));

  return { contextMenu, contextMenuRef, handleContextMenu };
};

export default useContextMenu;
