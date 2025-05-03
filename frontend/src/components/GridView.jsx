import React, { useRef, useEffect, useState } from "react";

const bestFitGrid = (itemCount, gridWidth, gridHeight) => {
    const aspectRatio = gridWidth / gridHeight;
    let best = { columns: itemCount, rows: 1, delta: Infinity };

    for (let columns = itemCount; columns > 0; columns--) {
        const rows = Math.ceil(itemCount / columns);

        const tileWidth = gridWidth / columns;
        const tileHeight = gridHeight / rows;
        const tileAspectRatio = tileWidth / tileHeight;

        const delta = Math.abs(aspectRatio - tileAspectRatio);
        if (delta < best.delta) {
            best = { columns, rows, delta };
        }
    }

    return best;
}

export default function GridView({ children, gap = 10 }) {
    const gridRef = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0, aspectRatio: 0 });
    const [gridSettings, setGridSettings] = useState({ columns: 0, rows: 0 });
    const childrenCount = React.Children.count(children);
    console.log(gridSettings, childrenCount);

    useEffect(() => {
        if (!gridRef.current)
            return;

        const { width, height } = gridRef.current.getBoundingClientRect();
        setSize({ width, height, aspectRatio: width / height});

        const bestFit = bestFitGrid(childrenCount, width, height);
        setGridSettings({ columns: bestFit.columns, rows: bestFit.rows });
    }, []);

    const gridStyles = React.Children.map(children, (_, i) => {
        const tileWidth = (size.width / gridSettings.columns) - gap;
        const tileHeight = (size.height / gridSettings.rows) - gap;

        const row = Math.floor(i / gridSettings.columns);
        const col = i % gridSettings.columns;

        let top = (row * (tileHeight + gap)) + 0.5 * gap;
        let left = (col * (tileWidth + gap)) + 0.5 * gap;

        const totalAvailableSpaces = gridSettings.columns * gridSettings.rows;
        if (row + 1 === gridSettings.rows &&
            totalAvailableSpaces > childrenCount) {
            const emptySpaces = totalAvailableSpaces - childrenCount;
            left += 0.5 * emptySpaces * (tileWidth + gap);
        }

        return {
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            width: `${tileWidth}px`,
            height: `${tileHeight}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #ccc',
        };
    });

    return (
        <div
            ref={gridRef}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
            }}
        >
        {React.Children.map(children, (child, i) => (
            <div style={gridStyles[i]}>{child}</div>
        ))}
        </div>
    );
};
