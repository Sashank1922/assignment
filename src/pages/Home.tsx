

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  IconButton,
  MenuItem,
  Select,
  Typography,
  InputBase,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Add, Delete, Edit, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const HomePage = () => {
  const navigate = useNavigate();
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
          <IconButton onClick={() => handleEdit(params.row)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleView(params.row)}>
            <Visibility />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteClick(params.row.id)}>
            <Delete />
          </IconButton>
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
    setCurrentEdit({ ...row, employee: { ...row } });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (currentEdit) {
      await axios.put(`http://localhost:3001/employees/${currentEdit.id}`, {
        id: currentEdit.id,
        employee: { ...currentEdit.employee },
      });
      setEditDialogOpen(false);
      fetchData();
    }
  };

  const handleView = (row: any) => {
    navigate(`/viewEmployee/${row.id}`);
  };

  const handleDeleteSelected = async () => {
    try {
      if (selectedIds.length === 0) {
        console.error("No employees selected.");
        return;
      }

      await Promise.all(
        selectedIds.map(async (id: string) => {
          await axios.delete(`http://localhost:3001/employees/${id}`);
        })
      );

      fetchData();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting selected employees:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      const response = await axios.get("http://localhost:3001/employees");
      await Promise.all(
        response.data.map(async (emp: any) => {
          await axios.delete(`http://localhost:3001/employees/${emp.id}`);
        })
      );
      fetchData();
      setClearAllDialogOpen(false);
    } catch (error) {
      console.error("Error clearing all data:", error);
    }
  };

  const handleCheckboxChange = (ids: any[]) => {
    setSelectedIds(ids);
  };

  const clearFilters = () => {
    setSearchText("");
    setOrganizationFilter("");
  };

  return (
    <Box sx={{ width: "100vw", minHeight: "100vh", backgroundColor: "#f5f5f5", paddingBottom: "60px" }}>
      <Box sx={{ maxWidth: "1300px", margin: "0 auto", px: 2, py: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={4} align="center" color="blue">
          Employee Details
        </Typography>

        {/* Search & Filters */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Box sx={{ position: "relative", flexGrow: 1 }}>
            <SearchIcon sx={{ position: "absolute", top: 10, left: 10, color: "gray" }} />
            <InputBase
              placeholder="Search…"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{
                width: "100%",
                paddingLeft: 5,
                bgcolor: "white",
                borderRadius: 1,
                height: 40,
              }}
            />
          </Box>

          <Select
            displayEmpty
            size="small"
            sx={{ minWidth: 200 }}
            value={organizationFilter}
            onChange={(e) => setOrganizationFilter(e.target.value)}
          >
            <MenuItem value="">Filter by Organization</MenuItem>
            {uniqueOrganizations.map((org) => (
              <MenuItem key={org} value={org}>
                {org}
              </MenuItem>
            ))}
          </Select>

          <Button variant="contained" color="error" onClick={clearFilters}>
            Clear Filters
          </Button>

          <Button variant="outlined" color="error" onClick={() => setClearAllDialogOpen(true)}>
            Clear All
          </Button>

          <IconButton color="primary" onClick={() => navigate("/EmployeeForm")}>
            <Add />
          </IconButton>
        </Box>

        {/* Delete Selected */}
        <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={() => setDeleteDialogOpen(true)}
            disabled={selectedIds.length === 0}
          >
            Delete Selected
          </Button>
        </Box>

        {/* Table */}
        {filteredEmployees.length > 0 ? (
          <Paper sx={{ width: "100%", height: "calc(100vh - 300px)" }}>
            <DataGrid
              rows={filteredEmployees.map((emp) => ({
                ...emp?.employee,
                id: String(emp?.id),
              }))}
              columns={columns}
              checkboxSelection
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 15, 20]}
              onRowSelectionModelChange={(newSelection) => handleCheckboxChange(newSelection)}
              columnBuffer={columns.length}
              disableColumnVirtualization
              disableRowSelectionOnClick
              sx={{ 
                border: 0,
                '& .MuiDataGrid-virtualScroller': {
                  overflow: 'auto',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#1976d2',
                  color: 'black',
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  color: 'black',
                  fontWeight: 'bold',
                },
                '& .MuiDataGrid-iconButtonContainer': {
                  visibility: 'visible',
                  width: 'auto',
                },
                '& .MuiDataGrid-menuIcon': {
                  visibility: 'visible',
                },
                '& .MuiDataGrid-sortIcon': {
                  opacity: 1,
                },
              }}
            />
          </Paper>
        ) : (
          <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
            <Card sx={{ p: 5, backgroundColor: "#e3f2fd", boxShadow: 3 }}>
              <Typography variant="h6">Please add your employee details</Typography>
            </Card>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ position: "fixed", bottom: 0, width: "100%", textAlign: "center", py: 1, backgroundColor: "#1976d2", color: "white" }}>
        © 2025 Employee Management System
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} PaperProps={{
    sx: { width: "500px", maxWidth: "90%" },
  }}>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {currentEdit &&
            Object.keys(currentEdit.employee).map((key) => (
              <TextField
                key={key}
                label={key}
                value={currentEdit.employee[key]}
                onChange={(e) =>
                  setCurrentEdit({
                    ...currentEdit,
                    employee: { ...currentEdit.employee, [key]: e.target.value },
                  })
                }
              />
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Selected Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Selected Employees</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete the selected employees?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteSelected} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Single Delete Dialog */}
      <Dialog open={singleDeleteDialogOpen} onClose={() => setSingleDeleteDialogOpen(false)}>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this employee?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSingleDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear All Dialog */}
      <Dialog open={clearAllDialogOpen} onClose={() => setClearAllDialogOpen(false)}>
        <DialogTitle>Clear All Employees</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to clear all employees?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearAllDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClearAll} variant="contained" color="error">
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomePage;