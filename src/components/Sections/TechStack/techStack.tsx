import React, { useEffect, useState } from "react";
import { Cell, Cross, Grid, System } from "@components/ui/GridSystem";
import "@components/ui/css/GridSystem.css";

// Import your SVG files as React components
import NodeJs from "@/assets/nodejs";
import NextJs from "@/assets/nextjs";
import ReactJs from "@/assets/reactjs";
import ViteJs from "@/assets/vitejs";
import Python from "@/assets/python";
import Tailwindcss from "@/assets/tailwindcss";

const GridSystem: React.FC = () => {
  const [gridSize, setGridSize] = useState({ rows: 4, columns: 4 });

  useEffect(() => {
    const updateGridSize = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setGridSize({ rows: 2, columns: 3 });
      } else {
        setGridSize({ rows: 1, columns: 6 });
      }
    };

    window.addEventListener("resize", updateGridSize);
    updateGridSize(); // Initial call

    return () => window.removeEventListener("resize", updateGridSize);
  }, []);

  return (
    <section className="mt-20 xs:mt-16">
      <h2 className="font-bold text-textSecondary text-3xl my-8">
        <span className="underlineText text-textPrimary">TechStacks</span>
        &nbsp;in My Skillset
      </h2>
      <System guideWidth={1}>
        <Grid rows={gridSize.rows} columns={gridSize.columns}>
          <Cell className="p-12 xs:p-7" row={1} column={1}>
            <NodeJs style={{ fill: "var(--techstackLogo-color)" }} />
          </Cell>
          <Cell className="p-12 xs:p-7" row={1} column={2}>
            <NextJs style={{ fill: "var(--techstackLogo-color)" }} />
          </Cell>
          <Cell className="p-12 xs:p-7" row={1} column={3}>
            <ReactJs style={{ fill: "var(--techstackLogo-color)" }} />
          </Cell>
          <Cell
            className="p-12 xs:p-7"
            row={gridSize.rows}
            column={gridSize.rows == 1 ? 4 : 1}
          >
            <ViteJs style={{ fill: "var(--techstackLogo-color)" }} />
          </Cell>
          <Cell
            className="p-12 xs:p-7"
            row={gridSize.rows}
            column={gridSize.rows == 1 ? 5 : 2}
          >
            <Python style={{ fill: "var(--techstackLogo-color)" }} />
          </Cell>
          <Cell
            className="p-12 xs:p-7"
            row={gridSize.rows}
            column={gridSize.rows == 1 ? 6 : 3}
          >
            <Tailwindcss style={{ fill: "var(--techstackLogo-color)" }} />
          </Cell>

          <Cross row={1} column={1} />
          <Cross row={gridSize.rows + 1} column={gridSize.columns + 1} />
        </Grid>
      </System>
    </section>
  );
};

export default GridSystem;
