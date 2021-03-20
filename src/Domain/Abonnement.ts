export interface Abonnement {
  type: "hebdomadaire" | "mensuel" | "annuel" | "autre";
  nom: string;
  dateDeDebut: string;
  dateDeFin: string;
  gareDeDepart: string;
  gareDArrivee: string;
  prix: number;
}

const isValidDate = (date: string): boolean => {
  if (!date.match(/[0-9]{4}\/[0-9]{2}\/[0-9]{2}/)) {
    return false;
  }
  return true;
};

export const validateNomAbonnement = ({
  nom
}: Partial<Abonnement>): string | undefined => {
  if (!nom || nom.trim() === "") {
    return "Veuillez renseigner le nom de l'abonnement";
  }
  if (nom.length > 200) {
    return "Le nom ne peut pas faire plus de 200 caractères.";
  }
};

export const validateDateDeDebut = ({
  dateDeDebut,
  dateDeFin
}: Partial<Abonnement>): string | undefined => {
  if (!dateDeDebut || dateDeDebut.trim() === "") {
    return "Veuillez renseigner la date de début de l'abonnement";
  }
  if (!isValidDate(dateDeDebut)) {
    return "La date doit être au format AAAA/MM/JJ";
  }
  if (dateDeFin && dateDeFin < dateDeDebut) {
    return "La date de début doit être avant la date de fin";
  }
};

export const validateDateDeFin = ({
  dateDeDebut,
  dateDeFin
}: Partial<Abonnement>): string | undefined => {
  if (!dateDeFin || dateDeFin.trim() === "") {
    return "Veuillez renseigner la date de début de l'abonnement";
  }
  if (!isValidDate(dateDeFin)) {
    return "La date doit être au format AAAA/MM/JJ";
  }
  if (dateDeDebut && dateDeFin < dateDeDebut) {
    return "La date de fin doit être après la date de début";
  }
};
