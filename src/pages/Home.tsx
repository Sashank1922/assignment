import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);
  const [organizationFilter, setOrganizationFilter] = useState("");
  const [uniqueOrganizations, setUniqueOrganizations] = useState<string[]>([]);
  const [singleDeleteDialogOpen, setSingleDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5, minWidth: 60 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 120 },
    { field: "email", headerName: "Email", flex: 1.2, minWidth: 180 },
    { field: "organization", headerName: "Organization", flex: 1, minWidth: 150 },
    { field: "number", headerName: "Number", flex: 1, minWidth: 130 },
    { field: "gender", headerName: "Gender", flex: 0.7, minWidth: 100 },
    { field: "company", headerName: "Company", flex: 1, minWidth: 130 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={() => handleEdit(params.row)}><Edit /></IconButton>
          <IconButton onClick={() => handleView(params.row)}><Visibility /></IconButton>
          <IconButton color="error" onClick={() => handleDeleteClick(params.row.id)}><Delete /></IconButton>
        </Box>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/employees");
      setEmployees(response.data);
      setFilteredEmployees(response.data);

      const orgs = Array.from(
        new Set(response.data.map((emp: any) => emp?.employee?.organization).filter(Boolean))
      );
      setUniqueOrganizations(orgs);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let data = [...employees];
    if (searchText) {
      const lowercased = searchText.toLowerCase();
      data = data.filter((emp) =>
        Object.values(emp?.employee || {}).some((val: any) =>
          String(val).toLowerCase().includes(lowercased)
        )
      );
    }

    if (organizationFilter) {
      data = data.filter((emp) => emp?.employee?.organization === organizationFilter);
    }

    setFilteredEmployees(data);
  }, [searchText, employees, organizationFilter]);

  const handleDeleteClick = (id: string) => {
    setEmployeeToDelete(id);
    setSingleDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (employeeToDelete) {
      await axios.delete(`http://localhost:3001/employees/${employeeToDelete}`);
      fetchData();
      setSingleDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleEdit = (row: any) => {
    setCurrentEdit({ ...row });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (currentEdit) {
      await axios.put(`http://localhost:3001/employees/${currentEdit.id}`, {
        id: currentEdit.id,
        employee: { ...currentEdit },
      });
      setEditDialogOpen(false);
      fetchData();
    }
  };

  const handleView = (row: any) => {
    navigate(`/viewEmployee/${row.id}`);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    await Promise.all(
      selectedIds.map(async (id: string) => {
        await axios.delete(`http://localhost:3001/employees/${id}`);
      })
    );
    fetchData();
    setDeleteDialogOpen(false);
  };

  const handleClearAll = async () => {
    const response = await axios.get("http://localhost:3001/employees");
    await Promise.all(
      response.data.map(async (emp: any) => {
        await axios.delete(`http://localhost:3001/employees/${emp.id}`);
      })
    );
    fetchData();
    setClearAllDialogOpen(false);
  };

  const handleCheckboxChange = (ids: any[]) => {
    setSelectedIds(ids);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Employee Records
      </Typography>

      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <TextField
          label="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          displayEmpty
          value={organizationFilter}
          onChange={(e) => setOrganizationFilter(e.target.value)}
        >
          <MenuItem value="">All Organizations</MenuItem>
          {uniqueOrganizations.map((org) => (
            <MenuItem key={org} value={org}>
              {org}
            </MenuItem>
          ))}
        </Select>
        <Button variant="outlined" color="error" onClick={() => setDeleteDialogOpen(true)}>
          Delete Selected
        </Button>
        <Button variant="outlined" color="error" onClick={() => setClearAllDialogOpen(true)}>
          Clear All
        </Button>
      </Box>

      <DataGrid
        rows={filteredEmployees.map((emp) => ({ ...emp.employee }))}
        columns={columns}
        checkboxSelection
        pageSizeOptions={[10, 20, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onRowSelectionModelChange={handleCheckboxChange}
        loading={loading}
        autoHeight
      />

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          {currentEdit && (
            <>
              <TextField
                margin="dense"
                label="Name"
                fullWidth
                value={currentEdit.name}
                onChange={(e) => setCurrentEdit({ ...currentEdit, name: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Email"
                fullWidth
                value={currentEdit.email}
                onChange={(e) => setCurrentEdit({ ...currentEdit, email: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Organization"
                fullWidth
                value={currentEdit.organization}
                onChange={(e) => setCurrentEdit({ ...currentEdit, organization: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Number"
                fullWidth
                value={currentEdit.number}
                onChange={(e) => setCurrentEdit({ ...currentEdit, number: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Gender"
                fullWidth
                value={currentEdit.gender}
                onChange={(e) => setCurrentEdit({ ...currentEdit, gender: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Company"
                fullWidth
                value={currentEdit.company}
                onChange={(e) => setCurrentEdit({ ...currentEdit, company: e.target.value })}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Selected Confirmation */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete selected employees?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteSelected} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Clear All Confirmation */}
      <Dialog open={clearAllDialogOpen} onClose={() => setClearAllDialogOpen(false)}>
        <DialogTitle>Confirm Clear All</DialogTitle>
        <DialogContent>This will delete all employees. Continue?</DialogContent>
        <DialogActions>
          <Button onClick={() => setClearAllDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClearAll} color="error">Clear All</Button>
        </DialogActions>
      </Dialog>

      {/* Single Delete Confirmation */}
      <Dialog open={singleDeleteDialogOpen} onClose={() => setSingleDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this employee?</DialogContent>
        <DialogActions>
          <Button onClick={() => setSingleDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
