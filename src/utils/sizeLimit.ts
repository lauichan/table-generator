const sizeLimit = (size: number, min: number, max: number) => {
  if (size < min) return min;
  if (size > max) return max;
  return size;
};

export default sizeLimit