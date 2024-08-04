import { useEffect, useRef, useState } from "react";
import { MousePosition } from "../components/ContextMenu/ContextMenu";

const useContextMenu = () => {
  const contextMenuRef = useRef<HTMLTableElement>(null);
  const [contextMenu, setContextMenu] = useState<MousePosition>(null);

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

  return { contextMenuRef, handleContextMenu, contextMenu };
};

export default useContextMenu;