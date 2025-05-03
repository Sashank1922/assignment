

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Avatar,
  Divider,
  Chip,
  Grid,
  Paper,
  Container,
  useTheme
} from '@mui/material';
import {
  Home as AddressIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Business as OrganizationIcon,
  ArrowBack as BackIcon,
  Person as PersonIcon,
  Transgender as GenderIcon,
  Work as DepartmentIcon
} from '@mui/icons-material';
import axios from 'axios';
import { motion } from 'framer-motion';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';


const ViewEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([]);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/employees/${id}`);
        setEmployee(response.data);
        setAddresses(response.data.address || []);
      } catch (error) {
        console.error('Error fetching employee:', error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'background.default'
      }}>
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} sx={{ mb: 3, color: 'primary.main' }} />
          <Typography variant="h6" color="text.primary">
            Loading Employee Details...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!employee) {
    return (
      <Box sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'background.default'
      }}>
        <Typography variant="h6" color="error">
          Employee not found
        </Typography>
      </Box>
    );
  }

  return (
    <Container  maxWidth={false} sx={{
      width: '99vw',
      minHeight: '100vh',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      
      background: theme.palette.mode === 'light'
        ? 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
        : 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)'
    }}>
<Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3,mb:4, mr: 3 }}>
  <Button
    startIcon={<BackIcon />}
    onClick={() => navigate('/')}
    variant="contained"
    sx={{
      bgcolor: 'primary.main',
      color: '#fff',
      fontWeight: 'bold',
      borderRadius: 2,
      px: 2,
      py: 1,
      
      boxShadow: 3,
      '&:hover': {
        bgcolor: 'primary.dark',
        boxShadow: 5,
      },
    }}
  >
    Back to Employees
  </Button>
</Box>

      {/* Employee Card */}
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <Box sx={{
          height: 180,
          background: 'linear-gradient(to right, #1976d2, #42a5f5)',
          position: 'relative'
        }}>
          <Avatar sx={{
            width: 120,
            height: 120,
            position: 'absolute',
            bottom: -60,
            left: { xs: 'calc(50% - 60px)', md: 60 },
            border: '5px solid white',
            bgcolor: 'white',
            color: 'primary.main',
            fontWeight: 700,
            fontSize: 42
          }}>
            {employee.employee?.name?.charAt(0).toUpperCase()}
          </Avatar>
        </Box>

        <CardContent sx={{ mt: 8, px: { xs: 2, sm: 4 }, pt: 2,boxShadow:40 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            {employee.employee?.name}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2 ,height:'70%',boxShadow: 3, '&:hover': { boxShadow: 6 }}}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2,width:'50vh' }}>
                  <EmailIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Email</Typography>
                    <Typography variant="body1">{employee.employee?.email}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' , mb:2,width:'50vh'}}>
                  <PhoneIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Phone</Typography>
                    <Typography variant="body1">{employee.employee?.number}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
  <Paper sx={{ p: 3, borderRadius: 2, height: '70%',width:'50vh',boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
    {/* Organization */}
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%' }}>
      <OrganizationIcon color="primary" sx={{ mr: 2 }} />
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Organization</Typography>
        <Typography variant="body1">{employee.employee?.organization}</Typography>
      </Box>
    </Box>

    {/* Gender */}
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%' }}>
      <GenderIcon color="primary" sx={{ mr: 2 }} />
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Gender</Typography>
        <Typography variant="body1">{employee.employee?.gender}</Typography>
      </Box>
    </Box>

    {/* Company */}
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <BusinessOutlinedIcon color="primary" sx={{ mr: 2 }} />
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Company</Typography>
        <Typography variant="body1">{employee.employee?.company}</Typography>
      </Box>
    </Box>
  </Paper>
</Grid>

          </Grid>
        </CardContent>
      </Card>

      {/* Address Section */}
      <Box mt={6} mb={4}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 700,color:'black' }}>
          Addresses ({addresses.length})
        </Typography>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3
        }}>
          {addresses.length > 0 ? (
            addresses.map((address, idx) => (
              <Paper key={idx} sx={{
                p: 3,
                width: { xs: '100%', sm: '48%', md: '30%' },
                borderRadius: 2,
                borderLeft: '5px solid',
                borderColor: 'primary.main',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-6px)', boxShadow: 6 }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AddressIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Address {idx + 1}</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Street</Typography>
                <Typography variant="body1" gutterBottom>{address.street}</Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>City</Typography>
                    <Typography variant="body2">{address.city}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>State</Typography>
                    <Typography variant="body2">{address.state}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Zip</Typography>
                    <Typography variant="body2">{address.zip}</Typography>
                  </Box>
                </Box>
              </Paper>
            ))
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'action.hover', borderRadius: 2 }}>
              <Typography>No addresses available for this employee.</Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ViewEmployee;
