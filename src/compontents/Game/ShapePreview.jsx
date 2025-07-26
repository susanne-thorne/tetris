import "../../App.scss";

export default function ShapePreview({ shape }) {
  const adjustedBlocks = shape.blocks.map(({ i, j }) => ({
    i: i - shape.rotationCenter.i,
    j: j - shape.rotationCenter.j,
  }));

  const minI = Math.min(...adjustedBlocks.map(b => b.i));
  const maxI = Math.max(...adjustedBlocks.map(b => b.i));
  const minJ = Math.min(...adjustedBlocks.map(b => b.j));
  const maxJ = Math.max(...adjustedBlocks.map(b => b.j));

  const height = maxI - minI + 1;
  const width = maxJ - minJ + 1;

  const previewGrid = Array(height)
    .fill(null)
    .map(() => Array(width).fill(false));

  adjustedBlocks.forEach(({ i, j }) => {
    const x = i - minI;
    const y = j - minJ;
    previewGrid[x][y] = true;
  });

  return (
    <div className="preview-container">
      <div className="preview-title">Next</div>
      <div className="shape">
        {previewGrid.map((row, i) => (
          <div key={i} className="shape-row">
            {row.map((cell, j) => (
              <div
                key={j}
                className={`shape-cell ${cell ? "marked" : ""}`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
