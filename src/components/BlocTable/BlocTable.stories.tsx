import React, { useState } from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { BlocTable, BlocTableProps } from ".";
import { Bloc } from "./types";
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
  return (
    <BlocTable
      {...args}
      blocList={blocList}
      onAddTypologie={(nomBloc, typologie) => {
        args.onAddTypologie(nomBloc, typologie);
        const newBlocList = produce(blocList, draft => {
          const bloc = draft.find(({ nom }) => nom === nomBloc);
          bloc?.typologieDeLotsList?.push(createTypologie(typologie));
        });
        setBlocList(newBlocList);
      }}
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
  }
];

export const Primary = Template.bind({});
Primary.args = {
  blocList
};
