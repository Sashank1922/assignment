import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

interface Address {
  id: number;
  city: string;
  state: string;
  country: string;
}

interface AddAddressDialogProps {
  open: boolean;
  onClose: () => void;
  onAddAddress: (address: Address) => void;
}

const AddAddressDialog: React.FC<AddAddressDialogProps> = ({ open, onClose, onAddAddress }) => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  const handleAdd = () => {
    const newAddress: Address = {
      id: Date.now(),
      city,
      state,
      country,
    };
    onAddAddress(newAddress);
    onClose();
    setCity('');
    setState('');
    setCountry('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Address</DialogTitle>
      <DialogContent>
        <TextField
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAddressDialog;
