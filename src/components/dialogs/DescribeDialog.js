import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { saveAs } from 'file-saver';

const downloadPemFile = (keyName,keyMaterial) => {
  

  // Create a Blob with the random text and the correct MIME type
  const blob = new Blob([keyMaterial], { type: 'application/x-pem-file' });

  // Use FileSaver to save the Blob as a .pem file
  saveAs(blob, `${keyName}.pem`);
};

const DescribeDialog = ({ open, onClose,instanceDetail }) => (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth >
      <DialogTitle>Connect to {instanceDetail.name} EC2 Instance</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Step 1: Download the PEM file
        </Typography>
        <Typography>Click the button below to download the private key (PEM file) for the selected EC2 instance.</Typography>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={()=>{downloadPemFile(instanceDetail.keyName,instanceDetail.key)}}>
            Download {instanceDetail.keyName}
          </Button>
        </Box>
        <br/>
        <Typography variant="h6" gutterBottom>
          Step 2: Set file permissions
        </Typography>
        <Typography>Open a terminal and run the following command to set the correct permissions for the downloaded PEM file:</Typography>
        <SyntaxHighlighter language="bash" style={docco} sx={{ borderRadius: 1, backgroundColor: 'background.paper', p: 1, mb: 2 }}>
          chmod 400 /path/to/your-key.pem
        </SyntaxHighlighter>

        <Typography variant="h6" gutterBottom>
          Step 3: Connect to the instance
        </Typography>
        <Typography>Use the following command to SSH into the EC2 instance:</Typography>
        <SyntaxHighlighter
        language="bash"
        style={docco}
        sx={{ borderRadius: 1, backgroundColor: 'background.paper', p: 1, mb: 2 }}
        children={`ssh -i /path/to/your-key.pem ec2-user@${instanceDetail.dns}`}
/>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
      {console.log(instanceDetail)}
    </Dialog>
  );

export default DescribeDialog;
