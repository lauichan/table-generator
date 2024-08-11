import type { MousePosition } from "@/components/ContextMenu/ContextMenu";

import { useEffect, useRef, useState } from "react";

const useContextMenu = () => {
  const contextMenuRef = useRef<HTMLTableElement>(null);
  const [contextMenu, setContextMenu] = useState<MousePosition>(null);

  const hideContextMenu = () => {
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    e.preventDefault();
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [contextMenu]);

  return { contextMenu, contextMenuRef, handleContextMenu, hideContextMenu };
};

export default useContextMenu;
