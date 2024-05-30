import React, {ReactNode, ReactElement } from 'react';

interface GridCellProps {
  row: number;
  column: number;
  children: ReactNode;
  className?: string;
}

const Cell: React.FC<GridCellProps> = ({ row, column, children, className }) => (
  <div className={`${className} grid-cell`} style={{ gridRow: row, gridColumn: column }}>
    {children}
  </div>
);


interface CrossProps {
  row: number;
  column: number;
}

const Cross: React.FC<CrossProps> = ({ row, column }) => (
  <div className="cross" style={{ '--cross-row': row, '--cross-column': column } as React.CSSProperties}>
    <div className="crossLine" style={{ width: 'var(--cross-half-size)', height: 'var(--cross-size)', borderRightWidth: 'var(--guide-width)' }}></div>
    <div className="crossLine" style={{ width: 'var(--cross-size)', height: 'var(--cross-half-size)', borderBottomWidth: 'var(--guide-width)' }}></div>
  </div>
);

interface GridProps {
  rows: number;
  columns: number;
  children: ReactElement[];
}

const Grid: React.FC<GridProps> = ({ rows, columns, children }) => (
  <div className="grid" style={{ '--rows': rows, '--columns': columns } as React.CSSProperties}>
    <div className="grid-guides">
      {Array.from({ length: rows * columns }, (_, index) => {
        const x = (index % columns) + 1;
        const y = Math.floor(index / columns) + 1;
        return <div key={index} className="grid-guide" style={{ '--x': x, '--y': y } as React.CSSProperties} />;
      })}
    </div>
    {children}
  </div>
);

interface SystemProps {
  guideWidth: number;
  children: ReactNode;
}

const System: React.FC<SystemProps> = ({ guideWidth, children }) => (
  <div style={{ '--guide-width': `${guideWidth}px` } as React.CSSProperties}>
    {children}
  </div>
);

export  { Cell, Cross, Grid, System};
