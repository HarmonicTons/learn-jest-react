import React, { useCallback, useMemo, useState } from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { BlocTable, BlocTableProps } from ".";
import { Bloc, TypologieDeLots } from "./types";
import { produce } from "immer";

const createTypologie = (nom: string) => ({
  nom,
  nombreDeLots: 0,
  pourcentage: 0,
  smabParLogement: 0,
  puTtcLotsPrincipaux: 0,
  puTtcLotsAnnexes: 0,
  prixMoyenTtcParM2: 0,
  caHt: 0,
  tauxTva: 20,
  modeTva: "T",
  caTtc: 0,
  caracteristiques: {
    gamme: "",
    prixMaitrise: ""
  }
});

export default {
  title: "BlocTable",
  component: BlocTable
} as Meta;

const Template: Story<BlocTableProps> = args => {
  const [blocList, setBlocList] = useState(args.blocList ?? []);
  const onAddTypologie = useCallback(
    (nomBloc: string, typologie: string) => {
      args.onAddTypologie(nomBloc, typologie);
      setBlocList(blocList => {
        const newBlocList = produce(blocList, draft => {
          const bloc = draft.find(({ nom }) => nom === nomBloc);
          bloc?.typologieDeLotsList?.push(createTypologie(typologie));
        });
        return newBlocList;
      });
    },
    [setBlocList, args]
  );
  const onChangeCell = useCallback(
    (
      nomBloc: string,
      nomTypologie: string,
      key: keyof TypologieDeLots,
      value: any
    ) => {
      setBlocList(blocList => {
        const newBlocList = produce(blocList, draft => {
          const bloc = draft.find(({ nom }) => nom === nomBloc);
          const typologie = bloc?.typologieDeLotsList?.find(
            ({ nom }) => nom === nomTypologie
          );
          Object.assign(typologie, { [key]: value });
        });
        return newBlocList;
      });
    },
    [setBlocList]
  );

  return (
    <BlocTable
      {...args}
      blocList={blocList}
      onAddTypologie={onAddTypologie}
      onChangeCell={onChangeCell}
    />
  );
};

// mock data
const blocList: Bloc[] = [
  {
    nom: "Accession N°1",
    nombreDeLots: 10,
    pourcentage: 100,
    smabParLogement: 30,
    puTtcLotsPrincipaux: 0,
    puTtcLotsAnnexes: 0,
    prixMoyenTtcParM2: 4,
    caHt: 0,
    tauxTva: 20,
    modeTva: undefined,
    caTtc: undefined,
    typologieDeLotsList: [
      {
        nom: "T1",
        nombreDeLots: 10,
        pourcentage: 0,
        smabParLogement: 30,
        puTtcLotsPrincipaux: 100,
        puTtcLotsAnnexes: 0,
        prixMoyenTtcParM2: 0,
        caHt: 0,
        tauxTva: 20,
        modeTva: "T",
        caTtc: 0,
        caracteristiques: {
          gamme: "White",
          prixMaitrise: "Oui"
        }
      },
      {
        nom: "T2",
        nombreDeLots: 0,
        pourcentage: 0,
        smabParLogement: 0,
        puTtcLotsPrincipaux: 0,
        puTtcLotsAnnexes: 0,
        prixMoyenTtcParM2: 0,
        caHt: 0,
        tauxTva: 20,
        modeTva: "T",
        caTtc: 0,
        caracteristiques: {
          gamme: "Black",
          prixMaitrise: "Non"
        }
      }
    ]
  },
  {
    nom: "Accession N°2",
    nombreDeLots: 0,
    pourcentage: 100,
    smabParLogement: 0,
    puTtcLotsPrincipaux: 0,
    puTtcLotsAnnexes: 0,
    prixMoyenTtcParM2: 0,
    caHt: 0,
    tauxTva: 20,
    modeTva: undefined,
    caTtc: undefined,
    typologieDeLotsList: []
  },
  {
    nom: "Individuel",
    nombreDeLots: 0,
    pourcentage: 0,
    smabParLogement: 0,
    puTtcLotsPrincipaux: 0,
    puTtcLotsAnnexes: 0,
    prixMoyenTtcParM2: 0,
    caHt: 0,
    tauxTva: 20,
    modeTva: undefined,
    caTtc: undefined,
    typologieDeLotsList: [
      {
        nom: "Terrain",
        nombreDeLots: 0,
        pourcentage: 0,
        smabParLogement: 0,
        puTtcLotsPrincipaux: 0,
        puTtcLotsAnnexes: 0,
        prixMoyenTtcParM2: 0,
        caHt: 0,
        tauxTva: 20,
        modeTva: "T",
        caTtc: 0
      },
      {
        nom: "Autres",
        nombreDeLots: 0,
        pourcentage: 0,
        smabParLogement: 0,
        puTtcLotsPrincipaux: 0,
        puTtcLotsAnnexes: 0,
        prixMoyenTtcParM2: 0,
        caHt: 0,
        tauxTva: 20,
        modeTva: "T",
        caTtc: 0
      }
    ]
  }
];

export const Primary = Template.bind({});
Primary.args = {
  blocList
};
