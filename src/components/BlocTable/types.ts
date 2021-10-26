type Common = {
  nom: string;
  nombreDeLots?: number;
  pourcentage?: number;
  smabParLogement?: number;
  puTtcLotsPrincipaux?: number;
  puTtcLotsAnnexes?: number;
  prixMoyenTtcParM2?: number;
  caHt?: number;
  tauxTva?: number;
  modeTva?: string;
  caTtc?: number;
};

export type TypologieDeLots = Common & {
  caracteristiques?: {
    gamme: string;
    prixMaitrise: string;
  };
};

export type Bloc = Common & {
  typologieDeLotsList: TypologieDeLots[];
};
