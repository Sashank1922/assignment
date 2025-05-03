import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from '@mui/material';
import { useFormik } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import axios from 'axios';
import { Address } from '../types/';


interface EditAddressDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  data: Address;
}

const schema = z.object({
  name: z.string().min(1, 'Required'),
  address: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
});

const EditAddressDialog: React.FC<EditAddressDialogProps> = ({ open, onClose, onSuccess, data }) => {
  const formik = useFormik({
    initialValues: { name: data.name, address: data.address, city: data.city },
    enableReinitialize: true,
    validationSchema: toFormikValidationSchema(schema),
    onSubmit: async (values) => {
      await axios.put(`/api/addresses/${data.id}`, values);
      onSuccess();
    },
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Address</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              // helperText={formik.touched.name && formik.errors.name}
              helperText={formik.touched.name && typeof formik.errors.name === 'string' ? formik.errors.name : ''}
            />
            <TextField
              label="Address"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              error={formik.touched.address && Boolean(formik.errors.address)}
              // helperText={formik.touched.address && formik.errors.address}
              helperText={formik.touched.address && typeof formik.errors.address === 'string' ? formik.errors.address : ''}

            />
            <TextField
              label="City"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              error={formik.touched.city && Boolean(formik.errors.city)}
              // helperText={formik.touched.city && formik.errors.city}
              helperText={formik.touched.city && typeof formik.errors.city === 'string' ? formik.errors.city : ''}

            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditAddressDialog;
