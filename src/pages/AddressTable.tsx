
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField, Typography, Box, Checkbox, IconButton, InputAdornment,
  TablePagination, Paper, styled
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Address } from '../types/index';

interface AddressTableProps {
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '& .MuiTableCell-root': {
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
}));

const AddressTable: React.FC<AddressTableProps> = ({ setAddresses }) => {
  const [localAddresses, setLocalAddresses] = useState<Address[]>([]);
  const [selectedAddresses, setSelectedAddresses] = useState<Set<string>>(new Set());
  const [searchText, setSearchText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const syncToParent = (updated: Address[]) => {
    setLocalAddresses(updated);
    setAddresses(updated);
  };

  const handleOpenDialog = (address?: Address) => {
    setEditAddress(address || { id: Date.now().toString(), street: '', city: '', state: '', zip: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSaveAddress = () => {
    if (!editAddress) return;
    const updatedAddresses = localAddresses.some(a => a.id === editAddress.id)
      ? localAddresses.map(addr => (addr.id === editAddress.id ? editAddress : addr))
      : [...localAddresses, editAddress];

    syncToParent(updatedAddresses);
    setSearchText('');
    handleCloseDialog();
  };

  const handleDeleteAddress = (id: string) => {
    const updated = localAddresses.filter(addr => addr.id !== id);
    syncToParent(updated);
    setSelectedAddresses(prev => {
      const updatedSet = new Set(prev);
      updatedSet.delete(id);
      return updatedSet;
    });
  };

  const handleSelectRow = (id: string) => {
    const updated = new Set(selectedAddresses);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setSelectedAddresses(updated);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedAddresses(new Set(filtered.map(addr => addr.id)));
    } else {
      setSelectedAddresses(new Set());
    }
  };

  const handleOpenBulkDelete = () => setOpenBulkDeleteDialog(true);
  const handleCancelBulkDelete = () => setOpenBulkDeleteDialog(false);
  const handleConfirmBulkDelete = () => {
    const updated = localAddresses.filter(addr => !selectedAddresses.has(addr.id));
    syncToParent(updated);
    setSelectedAddresses(new Set());
    setOpenBulkDeleteDialog(false);
  };

  const filtered = localAddresses.filter((addr) =>
    ['street', 'city', 'state', 'zip'].some((key) =>
      addr[key as keyof Address].toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Address Management
        </Typography>
        
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            label="Search Address"
            variant="outlined"
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleOpenDialog()}
            sx={{ minWidth: 120 }}
          >
            Add Address
          </Button>
          <IconButton
            color="error"
            onClick={handleOpenBulkDelete}
            disabled={selectedAddresses.size === 0}
            sx={{ 
              backgroundColor: selectedAddresses.size > 0 ? 'error.light' : 'transparent',
              '&:hover': {
                backgroundColor: selectedAddresses.size > 0 ? 'error.main' : 'action.hover',
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ width: 60 }}>
                <Checkbox
                  checked={selectedAddresses.size === filtered.length && filtered.length > 0}
                  onChange={handleSelectAll}
                  indeterminate={
                    selectedAddresses.size > 0 &&
                    selectedAddresses.size < filtered.length
                  }
                  color="default"
                />
              </TableCell>
              <TableCell>Street</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>ZIP</TableCell>
              <TableCell align="center" sx={{ width: 150 }}>Actions</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((address) => (
              <StyledTableRow key={address.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAddresses.has(address.id)}
                    onChange={() => handleSelectRow(address.id)}
                    color="primary"
                  />
                </TableCell>
                <TableCell>{address.street}</TableCell>
                <TableCell>{address.city}</TableCell>
                <TableCell>{address.state}</TableCell>
                <TableCell>{address.zip}</TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center" gap={1}>
                    <IconButton 
                      onClick={() => handleOpenDialog(address)} 
                      color="primary"
                      size="small"
                      sx={{ backgroundColor: 'primary.light', '&:hover': { backgroundColor: 'primary.main', color: 'white' } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteAddress(address.id)} 
                      color="error"
                      size="small"
                      sx={{ backgroundColor: 'error.light', '&:hover': { backgroundColor: 'error.main', color: 'white' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value.toString(), 10));
          setPage(0);
        }}
        sx={{
          '& .MuiTablePagination-toolbar': {
            padding: 1,
            justifyContent: 'flex-end',
          },
          '& .MuiTablePagination-selectLabel': {
            marginBottom: 0,
          },
          '& .MuiTablePagination-displayedRows': {
            marginBottom: 0,
          }
        }}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          {editAddress?.id ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
            {['street', 'city', 'state', 'zip'].map((field) => (
              <TextField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                fullWidth
                margin="normal"
                variant="outlined"
                value={editAddress?.[field as keyof Address] || ''}
                onChange={(e) =>
                  setEditAddress((prev) => ({ ...prev!, [field]: e.target.value }))
                }
                sx={{ gridColumn: field === 'street' ? 'span 2' : 'span 1' }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSaveAddress} variant="contained" color="primary" sx={{ ml: 2 }}>
            Save Address
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openBulkDeleteDialog} onClose={handleCancelBulkDelete} maxWidth="xs">
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
          Confirm Bulk Delete
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography>
            Are you sure you want to delete {selectedAddresses.size} selected address(es)?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCancelBulkDelete} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmBulkDelete} 
            variant="contained" 
            color="error"
            sx={{ ml: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AddressTable;