import React, { CSSProperties, memo, useMemo } from "react";

interface HeadLabelWithUnitProps {
  name: string;
  unit?: string;
  style?: CSSProperties;
}

const itemStyle: CSSProperties = { textAlign: "left", height: "auto" };

/**
 * Custom Header with unit
 */
export const HeadLabelWithUnit = memo(
  ({ name, unit, style }: HeadLabelWithUnitProps) => {
    const containerStyle: CSSProperties = useMemo(
      () => ({
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        fontSize: "12px",
        ...style
      }),
      [style]
    );

    return (
      <div style={containerStyle}>
        <span style={itemStyle}>{name}</span>
        <span style={itemStyle}>{unit}</span>
      </div>
    );
  }
);
HeadLabelWithUnit.displayName = "HeadLabelWithUnit";
