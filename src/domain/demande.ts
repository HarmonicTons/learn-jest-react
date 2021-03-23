export interface Demande {
  nomAbonné: string;
  mail: string;
  confirmMail: string;
  numTelephone: string;
}

const validateNom = ({ nomAbonné }: Demande): string | undefined => {
  if (nomAbonné.trim() === "") {
    return "Veuillez renseigner un nom.";
  }
  if (!nomAbonné.match(/^[a-zA-Zàâèéêëöùúûüç \\'-]+$/)) {
    return "Le nom contient un caractère interdit.";
  }
  if (nomAbonné.length > 50) {
    return "Le nom doit faire moins de 50 caractères.";
  }
};

const validateMail = ({ mail }: Demande): string | undefined => {
  if (mail.length === 0) {
    return "Veuillez renseigner un mail";
  }
};

const validateConfirmMail = ({
  mail,
  confirmMail
}: Demande): string | undefined => {
  if (mail !== confirmMail) {
    return "Les mails sont différents";
  }
};

const validateNumTelephone = ({
  numTelephone
}: Demande): string | undefined => {
  if (numTelephone.length === 0) {
    return "Veuillez renseigner un numéro de téléphone";
  }
};

export const validator = {
  nomAbonné: validateNom,
  mail: validateMail,
  confirmMail: validateConfirmMail,
  numTelephone: validateNumTelephone
};
