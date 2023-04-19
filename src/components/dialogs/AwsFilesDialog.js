import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';

const columns = [
  { field: 'Key', headerName: 'Key', flex: 1 },
  { field: 'LastModified', headerName: 'Last Modified', flex: 1 },
  { field: 'ETag', headerName: 'ETag', flex: 1 },
  { field: 'ChecksumAlgorithm', headerName: 'Checksum Algorithm', flex: 1 },
  { field: 'Size', headerName: 'Size', flex: 1 },
  { field: 'StorageClass', headerName: 'Storage Class', flex: 1 },
  { field: 'Url', headerName: 'Link', flex: 1, renderCell: (params) => <a href={params.value} target="_blank" rel="noopener noreferrer">Download</a> },
];

// const data = [
//   {
//     "id": 1,
//     "Key": "Firefox_wallpaper.png",
//     "LastModified": "2023-03-23T11:02:49.000Z",
//     "ETag": "\"26e44afd3680b59cc7142c6f949a711a\"",
//     "ChecksumAlgorithm": [],
//     "Size": 2807594,
//     "StorageClass": "STANDARD"
//   }
// ];

const AwsFileDialog = ({data,open,setOpen}) => {

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
              getRowId={(row) => row.Key}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AwsFileDialog;
