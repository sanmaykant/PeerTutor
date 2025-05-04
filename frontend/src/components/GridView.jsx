import React, {
    useRef,
    useEffect,
    useState,
    forwardRef,
    useImperativeHandle,
} from "react";

const bestFitGrid = (itemCount, gridWidth, gridHeight) => {
    let aspectRatio;
    if (gridWidth > gridHeight)
        aspectRatio = gridWidth / gridHeight;
    else
        aspectRatio = gridHeight / gridWidth;

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

const animationStyle = {
    transition: "all 0.75s cubic-bezier(0.16, 1, 0.3, 1)",
};

const GridView = forwardRef(({ children, gap = 10 }, ref) => {
    const gridRef = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0, aspectRatio: 0 });
    const [gridSettings, setGridSettings] = useState({
        columns: 0, rows: 0, pin: null });
    const childrenCount = React.Children.count(children);
    console.log(children);

    useImperativeHandle(ref, () => ({
        pin(i) { setGridSettings({ ...gridSettings, pin: i }); },
        unpin() { setGridSettings({...gridSettings, pin: null}); },
    }));

    const initGridSettings = () => {
        const { width, height } = gridRef.current.getBoundingClientRect();
        setSize({ width, height, aspectRatio: width / height});

        const bestFit = bestFitGrid(childrenCount, width, height);
        setGridSettings({ columns: bestFit.columns, rows: bestFit.rows });
    }

    useEffect(() => {
        if (!gridRef.current)
            return;

        initGridSettings();

        window.addEventListener("resize", initGridSettings);
        return () => { window.removeEventListener("resize", initGridSettings); }
    }, [children]);

    const gridStyles = React.Children.map(children, (_, i) => {
        let tileWidth, tileHeight, left, top;

        if (gridSettings.pin == null) {
            tileWidth = (size.width / gridSettings.columns) - gap;
            tileHeight = (size.height / gridSettings.rows) - gap;

            const row = Math.floor(i / gridSettings.columns);
            const col = i % gridSettings.columns;

            top = (row * (tileHeight + gap)) + 0.5 * gap;
            left = (col * (tileWidth + gap)) + 0.5 * gap;

            const totalAvailableSpaces = gridSettings.columns * gridSettings.rows;
            if (row + 1 === gridSettings.rows &&
                totalAvailableSpaces > childrenCount) {
                const emptySpaces = totalAvailableSpaces - childrenCount;
                left += 0.5 * emptySpaces * (tileWidth + gap);
            }
        } else {
            const pinWidth = 0.75 * size.width;
            if (i !== gridSettings.pin) {
                if (i > gridSettings.pin)
                    i--;
                tileWidth = 0.25 * size.width - gap;
                tileHeight = size.height / (childrenCount - 1) - gap;

                left = pinWidth + gap;
                top = i * (tileHeight + gap) + 0.5 * gap;
            } else {
                tileWidth = pinWidth;
                tileHeight = size.height - gap;

                top = gap * 0.5;
                left = gap * 0.5;
            }
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
            <div style={{...gridStyles[i], ...animationStyle}}>{child}</div>
        ))}
        </div>
    );
});

export default GridView;
