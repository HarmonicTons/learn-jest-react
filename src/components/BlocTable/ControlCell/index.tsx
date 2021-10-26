import React, { memo } from "react";
import { ExpandMore, ExpandLess } from "@material-ui/icons";
import { Checkbox, IconButton } from "@material-ui/core";

export interface ControlCellProps {
  value: string;
  isExpandable?: boolean;
  isExpanded?: boolean;
  onExpand?: () => void;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

/**
 * ControlCell
 * Custom render for a cell with expand/collapse arrow & select
 */
export const ControlCell = memo(
  ({
    value,
    isExpandable = false,
    isExpanded = false,
    onExpand = () => undefined,
    isSelectable = false,
    isSelected = false,
    onSelect = () => undefined
  }: ControlCellProps): JSX.Element => {
    console.log("RENDER ControlCell");
    return (
      <span>
        {isSelectable && <Checkbox onChange={onSelect} value={isSelected} />}
        {isExpandable && (
          <IconButton onClick={onExpand} style={{ color: "#996600" }}>
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
        <span
          role="button"
          style={
            isExpandable ? { color: "#996600", cursor: "pointer" } : undefined
          }
        >
          {value}
        </span>
      </span>
    );
  }
);
ControlCell.displayName = "ControlCell";
