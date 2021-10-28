import { TableCell, TableRow } from "@material-ui/core";

import React, { memo } from "react";
import { TypologieTable } from "./TypologieTable/TypologieTable";
import { AddTypologie } from "./AddTypologie/AddTypologie";
import { useSelector } from "react-redux";
import { BlocTableState } from "../../App";

export interface ExpandedBlocContentProps {
  colSpan: number;
  blocIndex: number;
}

const tableCellStyle = { padding: 0 };
const divStyle = { margin: "5px" };

export const ExpandedBlocContent = memo(
  ({ colSpan, blocIndex }: ExpandedBlocContentProps): JSX.Element => {
    const hasTypologie = useSelector<BlocTableState, boolean>(
      state => state.blocList[blocIndex].typologieDeLotsList.length !== 0
    );
    return (
      <TableRow>
        <TableCell colSpan={colSpan} style={tableCellStyle}>
          {hasTypologie && <TypologieTable blocIndex={blocIndex} />}
          <div style={divStyle}>
            <AddTypologie blocIndex={blocIndex} />
          </div>
        </TableCell>
      </TableRow>
    );
  }
);
ExpandedBlocContent.displayName = "ExpandedBlocContent";
