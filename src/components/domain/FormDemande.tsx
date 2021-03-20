import React, { useState } from "react";
import * as validateIdentité from "../../Domain/Identite";
import * as validateAbonnement from "../../Domain/Abonnement";
import { Abonnement } from "../../Domain/Abonnement";
import { Identité } from "../../Domain/Identite";
import { Button, DangerButton } from "../common/Button";
import { FormArea } from "../common/Form/FormArea";
import { TextField } from "../common/Form/TextField";
import { Booking } from "../common/Icons/Booking";
import { User } from "../common/Icons/User";

type Validator = {
  [key in string]?: { message?: string; valid: boolean };
};

interface Demande {
  abonnement: Partial<Abonnement>;
  identité: Partial<Identité>;
}

export interface FormDemandeProps {
  onSubmit: (demande: Demande) => void;
}
export const FormDemande: React.FC<FormDemandeProps> = ({ onSubmit }) => {
  const [demande, setDemande] = useState<Demande>({
    abonnement: {},
    identité: {}
  });
  const [validator, setValidator] = useState<Validator>({});

  const validateField = (
    field: string,
    validate: (d: Demande) => string | undefined
  ) => () => {
    const message = validate(demande);
    setValidator(v => ({
      ...v,
      [field]: { valid: message === undefined, message }
    }));
    return message;
  };

  const validate = {
    identité: {
      nom: validateField("identité.nom", d =>
        validateIdentité.validateNom(d.identité)
      )
    },
    abonnement: {
      nom: validateField("abonnement.nom", d =>
        validateAbonnement.validateNomAbonnement(d.abonnement)
      ),
      dateDeDebut: validateField("abonnement.dateDeDebut", d =>
        validateAbonnement.validateDateDeDebut(d.abonnement)
      ),
      dateDeFin: validateField("abonnement.dateDeFin", d =>
        validateAbonnement.validateDateDeFin(d.abonnement)
      )
    }
  };

  const viderLesChamps = () => {
    setDemande({ identité: {}, abonnement: {} });
    setValidator({});
  };

  const validerLaDemande = () => {
    const results = [
      validate.identité.nom(),
      validate.abonnement.nom(),
      validate.abonnement.dateDeDebut(),
      validate.abonnement.dateDeFin()
    ];

    const nonEmptyResults = results.filter(r => r !== undefined) as string[];

    if (nonEmptyResults.length === 0) {
      onSubmit(demande);
    }
  };

  return (
    <div>
      <FormArea title="Votre identité" Icon={User}>
        <TextField
          label="Nom"
          variant="filled"
          fullWidth
          required
          value={demande.identité.nom ?? ""}
          onBlur={validate.identité.nom}
          onChange={e =>
            setDemande({
              ...demande,
              abonnement: { ...demande.abonnement, nom: e.target.value }
            })
          }
          error={validator["identité.nom"]?.valid === false}
          helperText={validator["identité.nom"]?.message}
        />
      </FormArea>
      <FormArea title="Votre abonnement" Icon={Booking}>
        <TextField
          label="Nom de l'abonnement"
          variant="filled"
          fullWidth
          required
          value={demande.abonnement.nom ?? ""}
          onBlur={validate.abonnement.nom}
          onChange={e =>
            setDemande({
              ...demande,
              abonnement: { ...demande.abonnement, nom: e.target.value }
            })
          }
          error={validator["abonnement.nom"]?.valid === false}
          helperText={validator["abonnement.nom"]?.message}
        />
        <TextField
          label="Date de début"
          variant="filled"
          fullWidth
          required
          value={demande.abonnement.dateDeDebut ?? ""}
          onBlur={validate.abonnement.dateDeDebut}
          onChange={e =>
            setDemande({
              ...demande,
              abonnement: { ...demande.abonnement, dateDeDebut: e.target.value }
            })
          }
          error={validator["abonnement.dateDeDebut"]?.valid === false}
          helperText={validator["abonnement.dateDeDebut"]?.message}
        />
        <TextField
          label="Date de fin"
          variant="filled"
          fullWidth
          required
          value={demande.abonnement.dateDeFin ?? ""}
          onBlur={validate.abonnement.dateDeFin}
          onChange={e =>
            setDemande({
              ...demande,
              abonnement: { ...demande.abonnement, dateDeFin: e.target.value }
            })
          }
          error={validator["abonnement.dateDeFin"]?.valid === false}
          helperText={validator["abonnement.dateDeFin"]?.message}
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
