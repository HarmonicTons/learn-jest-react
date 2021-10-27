import { TableCell, TableRow } from "@material-ui/core";

import React, { memo } from "react";
import { TypologieTable } from "./TypologieTable";
import { AddTypologie } from "./AddTypologie";
import { useSelector } from "react-redux";
import { BlocTableState } from "../../App";

export interface ExpandedBlocContentProps {
  colSpan: number;
  dataIndex: number;
}

const tableCellStyle = { padding: 0 };
const divStyle = { margin: "5px" };

export const ExpandedBlocContent = memo(
  ({ colSpan, dataIndex }: ExpandedBlocContentProps): JSX.Element => {
    const hasTypologie = useSelector<BlocTableState, boolean>(
      state => state.blocList[dataIndex].typologieDeLotsList.length !== 0
    );
    return (
      <TableRow>
        <TableCell colSpan={colSpan} style={tableCellStyle}>
          {hasTypologie && <TypologieTable blocIndex={dataIndex} />}
          <div style={divStyle}>
            <AddTypologie blocIndex={dataIndex} />
          </div>
        </TableCell>
      </TableRow>
    );
  }
);
ExpandedBlocContent.displayName = "ExpandedBlocContent";
