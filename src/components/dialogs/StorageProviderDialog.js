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
import { deployStorageAccount,deloys3Bucket } from '../../endpoints';
import { useAuth } from '../../context/AuthContext';


// The calculateOptimalProvider function should be imported here

const StorageProviderDialog = ({openStorage,setOpenStorage}) => {
  const {setLoading } = useAuth();

  const [storageSize, setStorageSize] = useState('');
  const [accessFrequency, setAccessFrequency] = useState('');
  const [resouceProvider,setResourceProvider]=useState('')
  const [resourceName,setResourceName]=useState('')
  const [result, setResult] = useState('');

  

  const handleClose = () => {
    setOpenStorage(false)
  };
  function calculateOptimalProvider(storageSize, accessFrequency) {
    // Storage size in TB
    const storageInTB = storageSize / (1024 * 1024 * 1024);
  
    // Price calculation function
    const calculatePrice = (sizeInTB, priceTable) => {
      let price = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (const row of priceTable) {
        const [rangeStart, rangeEnd, perGBPrice] = row;
        const rangeSize = sizeInTB >= rangeEnd ? rangeEnd - rangeStart : sizeInTB - rangeStart;
        price += rangeSize * perGBPrice;
        if (sizeInTB <= rangeEnd) break;
      }
      return price;
    };
  
    // Pricing tables
    const azurePriceTable = [
      [0, 50, 0.208],
      [50, 500, 0.200],
    ];
    const awsPriceTable = [
      [0, 50, 0.230],
      [50, 500, 0.220],
    ];
  
    // Compute the optimal cloud provider based on the user's needs
    let optimalProvider;
    const azurePrice = calculatePrice(storageInTB, azurePriceTable);
    const awsPrice = calculatePrice(storageInTB, awsPriceTable);
  
    if (accessFrequency === "Infrequent Access") {
      optimalProvider = azurePrice >= 0.0125 ? "Azure" : "AWS";
    } else if (accessFrequency === "Archive Storage") {
      optimalProvider = azurePrice >= 0.0020 ? "Azure" : "AWS";
    } else {
      optimalProvider = azurePrice <= awsPrice ? "Azure" : "AWS";
    }
  
    return optimalProvider;
  }
  const handleSubmit = async () => {
    if(resouceProvider === '' || resourceName === ''){
      const optimalProvider = calculateOptimalProvider(storageSize, accessFrequency);
    setResourceProvider(optimalProvider)
    }
    if(resouceProvider !== '' && resourceName !== ''){
      setLoading(true)
      if(resouceProvider === 'AWS'){
        await deloys3Bucket(resourceName)
        handleClose()
      }
      if(resouceProvider === 'Azure'){
        await deployStorageAccount(resourceName)
        handleClose()
      }
      setLoading(false)
    }
    // setOpen(false);
  };

  return (
    <div>
      <Dialog open={openStorage} onClose={handleClose}>
        <DialogTitle>Choose Optimal Cloud Provider</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the required parameters to find the optimal cloud provider for your storage needs.
          </DialogContentText>
          <TextField
            margin="dense"
            label="Storage Size (GB)"
            type="number"
            fullWidth
            value={storageSize}
            onChange={(e) => setStorageSize(e.target.value)}
          />
          
          <FormControl fullWidth sx={{marginTop:'5px'}}>
              <InputLabel>Access Frequency</InputLabel>
              <Select
                value={accessFrequency}
                onChange={(e) => setAccessFrequency(e.target.value)}
              >
                <MenuItem value="Frequent Access">Frequent Access</MenuItem>
                <MenuItem value="Infrequent Access">Infrequent Access</MenuItem>
                <MenuItem value="Archive Storage">Archive Storage</MenuItem>
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

export default StorageProviderDialog;
