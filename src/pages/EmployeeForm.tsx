
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { employeeValidationSchema } from '../utils/validationSchema';
import { EmployeeDetails, Address, MainEmployeeDetails } from '../types';
import AddressTable from './AddressTable';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const steps = ['Personal Information', 'Contact Details', 'Organization', 'Addresses'];

const EmployeeForm: React.FC = () => {
  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [formSaved, setFormSaved] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik<EmployeeDetails>({
    initialValues: {
      id: '',
      name: '',
      email: '',
      organization: '',
      number: '',
      gender: '',
      company: '',
    },
    validationSchema: toFormikValidationSchema(employeeValidationSchema),
    validateOnBlur: true,
    onSubmit: (values) => {
      setEmployee(values);
      setFormSaved(true);
      setActiveStep(3); // Move to addresses step
    },
  });

  const handleNext = () => {
    // Set gender as touched only when moving to next step
    if (activeStep === 1 && !formik.touched.gender) {
      formik.setFieldTouched('gender', true);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinalSubmit = async () => {
    if (!employee || addresses.length === 0) {
      alert("Please fill the employee form and add at least one address before submitting.");
      return;
    }

    const finalData: MainEmployeeDetails = { employee, address: addresses };

    try {
      await axios.post('http://localhost:3001/employees', finalData);
      setSubmissionSuccess(true);
      setEmployee(null);
      setAddresses([]);
      setFormSaved(false);
      setActiveStep(0);
      formik.resetForm();
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Submission failed!');
    }
  };

  const handleDialogClose = () => {
    setSubmissionSuccess(false);
    navigate('/'); // Navigate to homepage
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Full Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              variant="outlined"
              size="medium"
            />
            <TextField
              fullWidth
              id="id"
              name="id"
              label="Employee ID"
              value={formik.values.id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.id && Boolean(formik.errors.id)}
              helperText={formik.touched.id && formik.errors.id}
              variant="outlined"
              size="medium"
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              variant="outlined"
              size="medium"
            />
            <TextField
              fullWidth
              id="number"
              name="number"
              label="Phone Number"
              value={formik.values.number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.number && Boolean(formik.errors.number)}
              helperText={formik.touched.number && formik.errors.number}
              variant="outlined"
              size="medium"
            />
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Gender
              </Typography>
              <RadioGroup
                name="gender"
                value={formik.values.gender}
                onChange={(e) => {
                  formik.setFieldValue('gender', e.target.value);
                }}
                onBlur={formik.handleBlur}
                row
              >
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
              </RadioGroup>
              {formik.touched.gender && formik.errors.gender && (
                <Typography variant="body2" color="error">
                  {formik.errors.gender}
                </Typography>
              )}
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              id="organization"
              name="organization"
              label="Organization"
              value={formik.values.organization}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.organization && Boolean(formik.errors.organization)}
              helperText={formik.touched.organization && formik.errors.organization}
              variant="outlined"
              size="medium"
            />
            <TextField
              fullWidth
              id="company"
              name="company"
              label="Company"
              value={formik.values.company}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.company && Boolean(formik.errors.company)}
              helperText={formik.touched.company && formik.errors.company}
              variant="outlined"
              size="medium"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={!formik.isValid || !formik.dirty}
              sx={{ mt: 2 }}
            >
              Save Employee Details
            </Button>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <AddressTable setAddresses={setAddresses} />
            <Button
              onClick={handleFinalSubmit}
              variant="contained"
              color="success"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
            >
              Submit All Data
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth={false} sx={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f5f7fa',
      py: 4
    }}>
      <Box sx={{
        maxWidth: 800,
        width: '100%',
        margin: '0 auto',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Card sx={{
          flexGrow: 1,
          boxShadow: 3,
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{
              fontWeight: 'bold',
              color: '#1976d2',
              mb: 4
            }}>
              Employee Registration
            </Typography>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Divider sx={{ mb: 4 }} />

            <form onSubmit={formik.handleSubmit}>
              {renderStepContent(activeStep)}
            </form>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                size="large"
              >
                Back
              </Button>
              {activeStep < 2 && (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  size="large"
                  disabled={
                    (activeStep === 0 && (!formik.values.name || !formik.values.id)) ||
                    (activeStep === 1 && (!formik.values.email || !formik.values.number || !formik.values.gender))
                  }
                >
                  Next
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Dialog for submission success */}
      <Dialog open={submissionSuccess} onClose={handleDialogClose}>
        <DialogTitle>Submission Successful</DialogTitle>
        <DialogContent>
          <Typography>
            Your employee details and addresses were submitted successfully.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="contained" color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmployeeForm;