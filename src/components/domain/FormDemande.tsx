import { TextField } from "../common/TextField";
import React, { useState } from "react";
import { Demande, validator } from "../../domain/demande";
import { Card, CardContent, Typography } from "@material-ui/core";
import { Button, DangerButton } from "../common/Button";

type ValidatorError<T> = {
  [key in keyof T]?: string | undefined;
};

export interface FormDemandeProps {
  onSubmit: (demande: Demande) => void;
}

export const FormDemande: React.FC<FormDemandeProps> = ({ onSubmit }) => {
  const initialFormData: Demande = {
    nomAbonné: "",
    mail: "",
    confirmMail: "",
    numTelephone: ""
  };
  const initialError: ValidatorError<Demande> = {};
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(initialError);

  const setFieldFormData = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [field]: value
      };
    });
  };

  const validateField = (field: keyof Demande) => (): boolean => {
    const validationError = validator[field](formData);
    setError(prevError => ({
      ...prevError,
      [field]: validationError
    }));
    return validationError === undefined;
  };

  const viderLesChamps = () => {
    setFormData(initialFormData);
    setError(initialError);
  };

  const validerLaDemande = () => {
    const fields = Object.keys(initialFormData) as Array<keyof Demande>;
    const validationResults = fields.map(field => validateField(field)());
    if (validationResults.includes(false)) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Mon identité
          </Typography>
          <div style={{ marginTop: "20px" }}>
            <TextField
              id="Nom abonné"
              label="Nom abonné"
              value={formData.nomAbonné}
              onChange={e => setFieldFormData("nomAbonné", e.target.value)}
              onBlur={validateField("nomAbonné")}
              helperText={error.nomAbonné}
              error={error.nomAbonné !== undefined}
              fullWidth
            />
          </div>
          <div style={{ marginTop: "20px" }}>
            <TextField
              id="mail"
              label="Mail"
              value={formData.mail}
              onChange={e => setFieldFormData("mail", e.target.value)}
              onBlur={validateField("mail")}
              helperText={error.mail}
              error={error.mail !== undefined}
              fullWidth
            />
          </div>
          <div style={{ marginTop: "20px" }}>
            <TextField
              id="confirmMail"
              label="Confirmer l'addresse mail"
              value={formData.confirmMail}
              onChange={e => setFieldFormData("confirmMail", e.target.value)}
              onBlur={validateField("confirmMail")}
              helperText={error.confirmMail}
              error={error.confirmMail !== undefined}
              fullWidth
            />
          </div>
          <div style={{ marginTop: "20px" }}>
            <TextField
              id="numTelephone"
              label="Numéro de téléphone"
              value={formData.numTelephone}
              onChange={e => setFieldFormData("numTelephone", e.target.value)}
              onBlur={validateField("numTelephone")}
              helperText={error.numTelephone}
              error={error.numTelephone !== undefined}
              fullWidth
            />
          </div>
        </CardContent>
      </Card>
      <div style={{ width: "100%", paddingTop: "10px" }}>
        <em>* données obligatoires</em>
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
    </>
  );
};
