import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';

const columns = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'type', headerName: 'Type', flex: 1 },
  { field: 'size', headerName: 'Size (KB)', flex: 1 },
  { field: 'uploadDate', headerName: 'Upload Date', flex: 1 },
  { field: 'link', headerName: 'Link', flex: 1, renderCell: (params) => <a href={params.value} target="_blank" rel="noopener noreferrer">Download</a> },
];



const AzureFileDialog
 = ({data,open, setOpen}) => {

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="file-data-dialog-title"
        PaperProps={{ style: { minHeight: '70vh', maxHeight: '70vh' } }}
      >
        <DialogTitle id="file-data-dialog-title">File Data</DialogTitle>
        <DialogContent>
        <div style={{ width: '100%', height: '60vh' }}>
            <DataGrid
              rows={data}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              getRowId={(row) => row.name}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AzureFileDialog
;
