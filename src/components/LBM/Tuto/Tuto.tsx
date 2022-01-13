import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Cell } from "./components/Cell/Cell";
import { Distributions, equil } from "../physics/simulator/equil";
import { Slider } from "./components/Slider/Slider";
import "./style.css";

const calculateRho = (distributions: Distributions): number => {
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
};

const calculateUx = (distributions: Distributions, rho: number): number => {
  return (
    (distributions.nE +
      distributions.nNE +
      distributions.nSE -
      distributions.nW -
      distributions.nNW -
      distributions.nSW) /
    rho
  );
};

const calculateUy = (distributions: Distributions, rho: number): number => {
  return (
    (distributions.nN +
      distributions.nNW +
      distributions.nNE -
      distributions.nS -
      distributions.nSW -
      distributions.nSE) /
    rho
  );
};

const toFixedNumber = (n: number): number => Number(n.toFixed(3));

export const Tuto = (): JSX.Element => {
  const [nNW, setNW] = useState(0);
  const [nN, setN] = useState(0);
  const [nNE, setNE] = useState(0);
  const [nW, setW] = useState(0);
  const [n0, set0] = useState(0);
  const [nE, setE] = useState(0);
  const [nSW, setSW] = useState(0);
  const [nS, setS] = useState(0);
  const [nSE, setSE] = useState(0);

  const setEquil = useCallback((rho, ux, uy) => {
    const { n0, nE, nN, nNE, nNW, nS, nSE, nSW, nW } = equil(rho, ux, uy);
    setNW(toFixedNumber(nNW));
    setN(toFixedNumber(nN));
    setNE(toFixedNumber(nNE));
    setW(toFixedNumber(nW));
    set0(toFixedNumber(n0));
    setE(toFixedNumber(nE));
    setSW(toFixedNumber(nSW));
    setS(toFixedNumber(nS));
    setSE(toFixedNumber(nSE));
  }, []);

  useEffect(() => {
    setEquil(1, 0.1, 0);
  }, [setEquil]);

  const distributions = useMemo<Distributions>(
    () => ({
      n0,
      nE,
      nN,
      nNE,
      nNW,
      nS,
      nSE,
      nSW,
      nW,
    }),
    [n0, nE, nN, nNE, nNW, nS, nSE, nSW, nW],
  );

  const rho = useMemo(() => calculateRho(distributions), [distributions]);

  const ux = useMemo(() => calculateUx(distributions, rho), [
    distributions,
    rho,
  ]);

  const uy = useMemo(() => calculateUy(distributions, rho), [
    distributions,
    rho,
  ]);

  const handleChange = useCallback(
    (key: string) => (value: number) => {
      switch (key) {
        case "nNW":
          setNW(value);
          break;
        case "nN":
          setN(value);
          break;
        case "nNE":
          setNE(value);
          break;
        case "nW":
          setW(value);
          break;
        case "n0":
          set0(value);
          break;
        case "nE":
          setE(value);
          break;
        case "nSW":
          setSW(value);
          break;
        case "nS":
          setS(value);
          break;
        case "nSE":
          setSE(value);
          break;
      }
    },
    [],
  );

  const handleClick = useCallback(() => {
    setEquil(rho, ux, uy);
  }, [setEquil, rho, ux, uy]);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "300px", height: "300px" }}>
        <Cell distributions={distributions} />
      </div>
      <div style={{ margin: "10px" }}>
        <div>
          <label htmlFor="input-rho">rho</label>
          <input id="input-rho" value={rho.toFixed(3)} readOnly />
        </div>
        <div>
          <label htmlFor="input-ux">ux</label>
          <input id="input-ux" value={ux.toFixed(3)} readOnly />
        </div>
        <div>
          <label htmlFor="input-uy">uy</label>
          <input id="input-uy" value={uy.toFixed(3)} readOnly />
        </div>
        <input type="button" value="Equilibrate" onClick={handleClick} />
      </div>
      <div style={{ margin: "10px" }}>
        {Object.entries(distributions).map(([key, val]) => (
          <Slider
            value={val}
            label={key}
            key={key}
            onChange={handleChange(key)}
          />
        ))}
      </div>
    </div>
  );
};
