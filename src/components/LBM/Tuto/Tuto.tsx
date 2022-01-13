import React, { useMemo, useState } from "react";
import { Cell } from "../Grid/Cell/Cell";
import { Distributions, equil } from "../physics/simulator/equil";

export const Tuto = (): JSX.Element => {
  const [distributions, setDistributions] = useState<Distributions>(
    equil(1, 0.1, 0),
  );
  const rho = useMemo(() => {
    return (
      distributions.nNW +
      distributions.nN +
      distributions.nNE +
      distributions.nW +
      distributions.n0 +
      distributions.nE +
      distributions.nSW +
      distributions.nS +
      distributions.nSE
    );
  }, [distributions]);

  const ux = useMemo(() => {
    return (
      (distributions.nE +
        distributions.nNE +
        distributions.nSE -
        distributions.nW -
        distributions.nNW -
        distributions.nSW) /
      rho
    );
  }, [distributions, rho]);

  const uy = useMemo(() => {
    return (
      (distributions.nN +
        distributions.nNW +
        distributions.nNE -
        distributions.nS -
        distributions.nSW -
        distributions.nSE) /
      rho
    );
  }, [distributions, rho]);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "300px", height: "300px" }}>
        <Cell distributions={distributions} />
      </div>
      <div style={{ margin: "10px" }}>
        <div>
          <label htmlFor="input-rho">rho</label>
          <input id="input-rho" value={rho.toFixed(3)} />
        </div>
        <div>
          <label htmlFor="input-ux">ux</label>
          <input id="input-ux" value={ux.toFixed(3)} />
        </div>
        <div>
          <label htmlFor="input-uy">uy</label>
          <input id="input-uy" value={uy.toFixed(3)} />
        </div>
      </div>
      <div style={{ margin: "10px" }}>
        <div>
          <label htmlFor="input-nNW">nNW</label>
          <input id="input-nNW" value={distributions.nNW.toFixed(3)} />
        </div>
        <div>
          <label htmlFor="input-nN">nN</label>
          <input id="input-nN" value={distributions.nN.toFixed(3)} />
        </div>
        <div>
          <label htmlFor="input-nNE">nNE</label>
          <input id="input-nNE" value={distributions.nNE.toFixed(3)} />
        </div>
        <div>
          <label htmlFor="input-nW">nW</label>
          <input id="input-nW" value={distributions.nW.toFixed(3)} />
        </div>
        <div>
          <label htmlFor="input-n0">n0</label>
          <input id="input-n0" value={distributions.n0.toFixed(3)} />
        </div>
        <div>
          <label htmlFor="input-nN">nE</label>
          <input id="input-nE" value={distributions.nE.toFixed(3)} />
        </div>
        <div>
          <label htmlFor="input-nSW">nSW</label>
          <input id="input-nSW" value={distributions.nSW.toFixed(3)} />
        </div>
        <div>
          <label htmlFor="input-nS">nS</label>
          <input id="input-nS" value={distributions.nS.toFixed(3)} />
        </div>
        <div>
          <label htmlFor="input-nSE">nSE</label>
          <input id="input-nSE" value={distributions.nSE.toFixed(3)} />
        </div>
      </div>
    </div>
  );
};
