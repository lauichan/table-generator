export type MousePosition = {
  x: number;
  y: number;
} | null;

function ContextMenu({ position }: { position: MousePosition }) {
  if (position === null) return null;
  return (
    <ul style={{ top: position.y, left: position.x }}>
      <div>
        {position.x}, {position.y}
      </div>
    </ul>
  );
}

export default ContextMenu;
