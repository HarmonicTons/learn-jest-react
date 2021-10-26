import React, { CSSProperties, memo } from "react";

interface HeadLabelWithUnitProps {
  name: string;
  unit?: string;
  style?: CSSProperties;
}
/**
 * Custom Header with unit
 */
export const HeadLabelWithUnit = memo(
  ({ name, unit, style }: HeadLabelWithUnitProps) => {
    console.log("RENDER HeadLabelWithUnit");
    const containerStyle: CSSProperties = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      fontSize: "12px",
      ...style
    };
    const itemStyle: CSSProperties = { textAlign: "left", height: "auto" };
    return (
      <div style={containerStyle}>
        <span style={itemStyle}>{name}</span>
        <span style={itemStyle}>{unit}</span>
      </div>
    );
  }
);
HeadLabelWithUnit.displayName = "HeadLabelWithUnit";
