import { Abonnement } from "./Abonnement";
import { Identité } from "./Identite";

export interface Demande {
  identité: Identité;
  abonnement: Abonnement;
}
