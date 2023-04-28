import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { deployec2 } from '../../endpoints';
import { useAuth } from '../../context/AuthContext';

// The calculateOptimalProvider function should be imported here

const VmProviderDialog = ({openVm,setOpenVm}) => {
  const {setLoading } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [windowType,setWindowType]=useState("")
  const [instanceType,setInstanceType]=useState("")
  const [resouceProvider,setResourceProvider]=useState("")
  const [resourceName,setResourceName]=useState("")

  const handleClose = () => {
    setOpenVm(false)
  };
  function calculateOptimalVMProvider(os, instanceType) {
    const pricingData = [
      {
        instanceType: "General Purpose",
        os: "Linux",
        azure: 0.1670,
        aws: 0.1856,
      },
      {
        instanceType: "Compute Optimized",
        os: "Linux",
        azure: 0.1690,
        aws: 0.1700,
      },
      {
        instanceType: "Memory Optimized",
        os: "Linux",
        azure: 0.2660,
        aws: 0.2660,
      },
      {
        instanceType: "General Purpose",
        os: "Windows",
        azure: 0.5970,
        aws: 0.8560,
      },
      {
        instanceType: "Compute Optimized",
        os: "Windows",
        azure: 0.7260,
        aws: 0.8340,
      },
      {
        instanceType: "Memory Optimized",
        os: "Windows",
        azure: 0.8500,
        aws: 0.9520,
      },
    ];
  
    const matchingInstance = pricingData.find(
      (instance) => instance.os === os && instance.instanceType === instanceType
    );
  
    if (!matchingInstance) {
      return 'AWS';
    }
  
    return matchingInstance.azure <= matchingInstance.aws ? "Azure" : "AWS";
  }
  
  
  const handleSubmit = async () => {
    if(resouceProvider === '' || resourceName === ''){
      const optimalProvider = calculateOptimalVMProvider(windowType, instanceType);
      setResourceProvider(optimalProvider)
    }
    try{
      if(resouceProvider !== '' || resourceName !== ''){
        setLoading(true)
        await deployec2(resourceName)
        setLoading(false)
        handleClose()
        enqueueSnackbar('Virtual machine deployed successfully', { variant: 'success' })
      }
    }catch(err){
      enqueueSnackbar(err, { variant: 'error' })
      setLoading(false)
    }
  };

  return (
    <div>
      <Dialog open={openVm} onClose={handleClose}>
        <DialogTitle>Choose Optimal Cloud Provider</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the required parameters to find the optimal cloud provider for your virutal machine needs.
          </DialogContentText>
          <FormControl fullWidth sx={{marginTop:'5px'}}>
              <InputLabel>Operating System</InputLabel>
              <Select
                value={windowType}
                onChange={(e) => setWindowType(e.target.value)}
              >
                <MenuItem value="Linux">Linux</MenuItem>
                <MenuItem value="Windows">Windows</MenuItem>
              </Select>
            </FormControl>
          
          <FormControl fullWidth sx={{marginTop:'5px'}}>
              <InputLabel>Instance Type</InputLabel>
              <Select
                value={instanceType}
                onChange={(e) => setInstanceType(e.target.value)}
              >
                <MenuItem value="General Purpose">General Purpose</MenuItem>
                <MenuItem value="Compute Optimized">Compute Optimized</MenuItem>
                <MenuItem value="Memory Optimized">Memory Optimized</MenuItem>
              </Select>
            </FormControl>
          {
            resouceProvider !== '' ? 
            <FormControl fullWidth sx={{marginTop:'5px'}}>
          <InputLabel>Resource Provider</InputLabel>
              <Select
                value={resouceProvider}
                onChange={(e) => setResourceProvider(e.target.value)}
              >
                <MenuItem value="AWS">AWS</MenuItem>
                <MenuItem value="Azure">Azure</MenuItem>
              </Select>
          </FormControl> : null
          }
          {
            resouceProvider !== '' ?
            <TextField
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              value={resourceName}
              onChange={(e) => setResourceName(e.target.value)}
            /> : null
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{resouceProvider === '' || resourceName === '' ? 'Calulate' : 'Deploy' }</Button>
        </DialogActions>
      </Dialog>
      
    </div>
  );
};

export default VmProviderDialog;
