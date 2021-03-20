export interface Identité {
  nom: string;
  prenom: string;
}

export const validateNom = ({ nom }: Partial<Identité>): string | undefined => {
  if (!nom || nom.trim() === "") {
    return "Veuillez renseigner votre nom";
  }
  if (nom.length > 200) {
    return "Le nom ne peut pas faire plus de 200 caractères.";
  }
};
