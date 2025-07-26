export default function FloatingBlocks({shapes}) {
  const shapeList = Object.values(shapes).map((shape) =>
    shape.blocks.map(({ i, j }) => ({
      i: i + 3,
      j: j - 3,
    }))
  );

  return (
    <div className="ambient">
    {Array.from({ length: 18 }).map((_, i) => {
      const shape = shapeList[Math.floor(Math.random() * shapeList.length)];
      const top = `${Math.random() * 100}%`;
      const left = `${Math.random() * 100}%`;
      const duration = `${8 + Math.random() * 4}s`;
      const scale = 1 + Math.random();
      const rotation = Math.random() * 360;

      return (
        <div
          key={i}
          className="floating-shape"
          style={{
            top,
            left,
            animationDuration: duration,
            transform: `scale(${scale}) rotate(${rotation}deg)`,
          }}
        >
        {shape.map((block, k) => (
          <div
            key={k}
            className="mini-cell"
            style={{
              top: `${block.i * 12}px`,
              left: `${block.j * 12}px`,
            }}
          />
        ))}
      </div>
    );
  })}
</div>
  )
}