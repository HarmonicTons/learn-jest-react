import { cloneDeep } from "lodash";
import React, { useCallback, useState } from "react";
import { collide, Lattice as TLattice, stream } from "../../domain/lattice";
import { Lattice } from "../Lattice/Lattice";
import { useControllableLatticeStyles } from "./ControllableLattice.styles";

export type ControllableLatticeProps = {
  lattice: TLattice;
  viscosity?: number;
  gravity?: number;
};

export const ControllableLattice = ({
  lattice: initialLattice,
  viscosity = 0.02,
  gravity = 0.01,
}: ControllableLatticeProps): JSX.Element => {
  const classNames = useControllableLatticeStyles();
  const [lattice, setLattice] = useState(cloneDeep(initialLattice));
  const handleClickReset = useCallback(() => {
    setLattice({ ...initialLattice });
  }, [initialLattice, setLattice]);
  const handleClickCollide = useCallback(() => {
    collide(lattice, viscosity, gravity);
    setLattice({ ...lattice });
  }, [lattice, viscosity, gravity, setLattice]);
  const handleClickStream = useCallback(() => {
    stream(lattice);
    setLattice({ ...lattice });
  }, [lattice, setLattice]);

  const [selectedCell, setSelectedCell] = useState<number | undefined>();

  return (
    <div className={classNames.container}>
      <Lattice
        lattice={lattice}
        selectedCell={selectedCell}
        onChangeSelectedCell={setSelectedCell}
      />
      <div className={classNames.controllerPanel}>
        <input type="button" value="reset" onClick={handleClickReset} />
        <input type="button" value="collide" onClick={handleClickCollide} />
        <input type="button" value="stream" onClick={handleClickStream} />
        {selectedCell && (
          <>
            <div>index: {selectedCell}</div>
            <div>rho: {lattice.rho[selectedCell].toFixed(3)}</div>
            <div>ux: {lattice.ux[selectedCell].toFixed(3)}</div>
            <div>uy: {lattice.uy[selectedCell].toFixed(3)}</div>
          </>
        )}
      </div>
    </div>
  );
};
