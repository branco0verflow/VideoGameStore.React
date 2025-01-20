import React from "react";
import { Button, TextField } from "@mui/material";

const Calendario = ({ selectedDate, handleManana, handleSeleccionarDia }) => {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <Button variant="contained" color="primary" onClick={handleManana}>
        Mañana
      </Button>
      <TextField
        type="date"
        value={selectedDate}
        onChange={handleSeleccionarDia}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </div>
  );
};

export default Calendario;
