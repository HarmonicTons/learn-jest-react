import React, { useState, useEffect } from "react";
import MtButton from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core";
import { FormArea } from "./FormArea/FormArea";
import MtTextField from "@material-ui/core/TextField";

const Button = withStyles({
  root: {
    textTransform: "none",
    backgroundColor: "#0088ce",
    fontWeight: 500,
    fontSize: "1em",
    fontFamily: "Avenir",
    padding: "5px 10px 5px 10px",
    borderRadius: "5px",
    "&:hover": {
      backgroundColor: "#0074af"
    }
  }
})(MtButton);

const DangerButton = withStyles({
  root: {
    textTransform: "none",
    backgroundColor: "#dc3545",
    fontWeight: 500,
    fontSize: "1em",
    fontFamily: "Avenir",
    padding: "5px 10px 5px 10px",
    borderRadius: "5px",
    "&:hover": {
      backgroundColor: "#c82333"
    }
  }
})(MtButton);

const TextField = withStyles({
  root: {
    "& .MuiFormLabel-root.Mui-focused": {
      color: "#0088ce"
    },
    "& .MuiFilledInput-root": {
      borderRadius: "5px"
    },
    "& .MuiFilledInput-underline:after": {
      border: "none"
    },
    "& .MuiFilledInput-underline:before": {
      borderBottom: "none"
    }
  }
})(MtTextField);

interface Abonnement {
  type: "hebdomadaire" | "mensuel" | "annuel" | "autre";
  nom: string;
  dateDeDebut: string;
  dateDeFin: string;
  gareDeDepart: string;
  gareDArrivee: string;
  prix: number;
}

type Validator<T> = {
  [key in keyof T]?: { message?: string; valid: boolean };
};

const isValidDate = (date: string): boolean => {
  if (!date.match(/[0-9]{4}\/[0-9]{2}\/[0-9]{2}/)) {
    return false;
  }
  return true;
};

export const Form: React.FC = () => {
  const [abonnement, setAbonnement] = useState<Partial<Abonnement>>({});
  const [validator, setValidator] = useState<Validator<Abonnement>>({});

  const validateNom = () => {
    const { nom } = abonnement;
    let message: string;
    if (!nom || nom.trim() === "") {
      message = "Veuillez renseigner le nom de l'abonnement";
    } else if (nom.length > 200) {
      message = "Le nom ne peut pas faire plus de 200 caractères.";
    }
    setValidator(v => ({
      ...v,
      nom: { valid: message === undefined, message }
    }));
  };

  const validateDateDeDebut = () => {
    const { dateDeDebut, dateDeFin } = abonnement;
    let message: string;
    if (!dateDeDebut || dateDeDebut.trim() === "") {
      message = "Veuillez renseigner la date de début de l'abonnement";
    } else if (!isValidDate(dateDeDebut)) {
      message = "La date doit être au format AAAA/MM/JJ";
    } else if (dateDeFin && dateDeFin < dateDeDebut) {
      message = "La date de fin doit être après la date de début";
    }
    setValidator(v => ({
      ...v,
      dateDeDebut: { valid: message === undefined, message }
    }));
  };

  const validateDateDeFin = () => {
    const { dateDeFin, dateDeDebut } = abonnement;
    let message: string;
    if (!dateDeFin || dateDeFin.trim() === "") {
      message = "Veuillez renseigner la date de fin de l'abonnement";
    } else if (!isValidDate(dateDeFin)) {
      message = "La date doit être au format AAAA/MM/JJ";
    } else if (dateDeDebut && dateDeFin < dateDeDebut) {
      message = "La date de fin doit être après la date de début";
    }
    setValidator(v => ({
      ...v,
      dateDeFin: { valid: message === undefined, message }
    }));
  };

  const viderLesChamps = () => {
    setAbonnement({});
    setValidator({});
  };

  const validerLaDemande = () => {
    validateNom();
    validateDateDeDebut();
    validateDateDeFin();

    console.log(validator);
  };

  return (
    <form>
      <FormArea title="Votre identité">
        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Nom de l'abonnement"
            variant="filled"
            fullWidth
            required
            value={abonnement.nom ?? ""}
            onBlur={() => validateNom()}
            onChange={e =>
              setAbonnement({ ...abonnement, nom: e.target.value })
            }
            error={validator.nom?.valid === false}
            helperText={validator.nom?.message}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Date de début"
            variant="filled"
            fullWidth
            required
            value={abonnement.dateDeDebut ?? ""}
            onBlur={() => validateDateDeDebut()}
            onChange={e =>
              setAbonnement({ ...abonnement, dateDeDebut: e.target.value })
            }
            error={validator.dateDeDebut?.valid === false}
            helperText={validator.dateDeDebut?.message}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Date de fin"
            variant="filled"
            fullWidth
            required
            value={abonnement.dateDeFin ?? ""}
            onBlur={() => validateDateDeFin()}
            onChange={e =>
              setAbonnement({ ...abonnement, dateDeFin: e.target.value })
            }
            error={validator.dateDeFin?.valid === false}
            helperText={validator.dateDeFin?.message}
          />
        </div>
      </FormArea>
      <div style={{ width: "100%", padding: "10px" }}>
        <div>* données obligatoires</div>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <DangerButton
            variant="contained"
            color="primary"
            onClick={viderLesChamps}
          >
            Vider les champs
          </DangerButton>
          <div style={{ width: "15px" }} />
          <Button
            variant="contained"
            color="primary"
            onClick={validerLaDemande}
          >
            Valider la demande
          </Button>
        </div>
      </div>
    </form>
  );
};
