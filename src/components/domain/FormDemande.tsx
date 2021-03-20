import React, { useState } from "react";
import * as validateAbonnement from "../../Domain/Abonnement";
import { Abonnement } from "../../Domain/Abonnement";
import { Button, DangerButton } from "../common/Button";
import { FormArea } from "../common/Form/FormArea";
import { TextField } from "../common/Form/TextField";
import { Booking } from "../common/Icons/Booking";
import { User } from "../common/Icons/User";

type Validator<T> = {
  [key in keyof T]?: { message?: string; valid: boolean };
};

export interface FormDemandeProps {
  onSubmit: (abonnement: Abonnement) => void;
}
export const FormDemande: React.FC<FormDemandeProps> = ({ onSubmit }) => {
  const [abonnement, setAbonnement] = useState<Partial<Abonnement>>({});
  const [validator, setValidator] = useState<Validator<Abonnement>>({});

  const validateField = (
    field: keyof Abonnement,
    validate: (a: Partial<Abonnement>) => string | undefined
  ) => () => {
    const message = validate(abonnement);
    setValidator(v => ({
      ...v,
      [field]: { valid: message === undefined, message }
    }));
    return message;
  };

  const validateNom = validateField(
    "nom",
    validateAbonnement.validateNomAbonnement
  );
  const validateDateDeDebut = validateField(
    "dateDeDebut",
    validateAbonnement.validateDateDeDebut
  );
  const validateDateDeFin = validateField(
    "dateDeFin",
    validateAbonnement.validateDateDeFin
  );

  const viderLesChamps = () => {
    setAbonnement({});
    setValidator({});
  };

  const validerLaDemande = () => {
    const results = [validateNom(), validateDateDeDebut(), validateDateDeFin()];

    const nonEmptyResults = results.filter(r => r !== undefined) as string[];

    if (nonEmptyResults.length === 0) {
      onSubmit(abonnement as Abonnement);
    }
  };

  return (
    <div>
      <FormArea title="Votre identité" Icon={User}></FormArea>
      <FormArea title="Votre abonnement" Icon={Booking}>
        <TextField
          label="Nom de l'abonnement"
          variant="filled"
          fullWidth
          required
          value={abonnement.nom ?? ""}
          onBlur={validateNom}
          onChange={e => setAbonnement({ ...abonnement, nom: e.target.value })}
          error={validator.nom?.valid === false}
          helperText={validator.nom?.message}
        />
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
        <TextField
          label="Date de fin"
          variant="filled"
          fullWidth
          required
          value={abonnement.dateDeFin ?? ""}
          onBlur={e => {
            e.stopPropagation();
            validateDateDeFin();
          }}
          onChange={e =>
            setAbonnement({ ...abonnement, dateDeFin: e.target.value })
          }
          error={validator.dateDeFin?.valid === false}
          helperText={validator.dateDeFin?.message}
        />
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
    </div>
  );
};
