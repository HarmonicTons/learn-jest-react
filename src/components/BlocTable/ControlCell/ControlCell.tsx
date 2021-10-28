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

const IconButtonStyle = { color: "#996600" };
const spanStyle = { color: "#996600", cursor: "pointer" };

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
    return (
      <span>
        {isSelectable && <Checkbox onChange={onSelect} checked={isSelected} />}
        {isExpandable && (
          <IconButton onClick={onExpand} style={IconButtonStyle}>
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
        <span role="button" style={isExpandable ? spanStyle : undefined}>
          {value}
        </span>
      </span>
    );
  }
);
ControlCell.displayName = "ControlCell";
