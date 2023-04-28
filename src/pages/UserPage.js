import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Box,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Input,
  DialogActions,
  TextField,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import { useAuth } from '../context/AuthContext';
import { desctibeInstance, getFileAws, getFileAzure, restartInstance, stopInstance, terminateInstance, uploadFileAws, uploadFileAzure } from '../endpoints';
import AwsFilesDialog from '../components/dialogs/AwsFilesDialog';
import AzureFileDialog from '../components/dialogs/AzureFileDialog';
import DescribeDialog from '../components/dialogs/DescribeDialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'created', label: 'created', alignRight: false },
  { id: 'files', label: 'Files', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

const TABLE_HEAD_VM = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'instanceId', label: 'Instance Id', alignRight: false },
  { id: 'tier', label: 'Tier', alignRight: false },
  { id: 'launchTime', label: 'Launch Time', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  {id: 'zone', label: 'Zone', alignRight: false},
  { id: '' },
];


// ----------------------------------------------------------------------

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });

  return formatter.format(date);
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default function UserPage() {
  const {currentUser,getCurrentUser} = useAuth()
  const [tabValue, setTabValue] = useState(0);
  const [storage,setStorage] =useState(currentUser.s3Buckets)
  const [resourceProvider, setResourceProvider]=useState('AWS')
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadFileDialog,setUploadFileDialog]=useState(false)
  const [bucketName,setBucketName] = useState('')
  const [instance,setInstance]= useState('')
  const [awsFileDialog,setAwsFileDialog]=useState(false)
  const [azureFileDialog,setAzureFileDialog]=useState(false)

  const [vmOpen,setVmOpen]=useState(false)

  const [fileData,setFileData]=useState([]);
  const [describeDialogOpen, setDescribeDialogOpen] = useState(false);
  const [instanceDetail,setInstanceDetail]=useState({
    name:"",
    dns:"",
    keyName:"",
    key:""
  })

const handleDescribe = async () => {
  handleCloseMenu();
  const {data} = await desctibeInstance(instance);
  const currentInstance = currentUser.ec2Instances.find(x=>x.instanceId===instance);
  setInstanceDetail({
    name:currentInstance.instanceName,
    dns:data.data.data.Reservations[0].Instances[0].PublicDnsName,
    keyName:data.data.data.Reservations[0].Instances[0].KeyName,
    key:currentInstance.keyMaterial,
  })
  setDescribeDialogOpen(true);
};

const handleCloseDescribeDialog = () => {
  setDescribeDialogOpen(false);
};

  useEffect(()=>{
    getCurrentUser()
  },[])
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }
    if(resourceProvider === 'AWS'){
      const formData = new FormData();
      formData.append('name', bucketName);
      formData.append('file', selectedFile);
      await uploadFileAws(formData)
    }
    if(resourceProvider === 'Azure'){
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', bucketName);
      await uploadFileAzure(formData)
    }
  };
  const handleTabValue = (event, newValue) => {
    setTabValue(newValue);
  };
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (e,name) => {
    setBucketName(name)
    setOpen(e.target);
  };
  const handleVmOpenMenu = (e,instance)=>{
    setInstance(instance)
    setVmOpen(e.target)
  }
  const handleVmClose = () =>{
    setVmOpen(null);
  }

  const handleCloseMenu = () => {
    setOpen(null);
  };

  useEffect(() => {
    if(resourceProvider === 'AWS') setStorage(currentUser.s3Buckets);
    if(resourceProvider === 'Azure') setStorage(currentUser.storageAccounts);
  },[resourceProvider])

  useEffect(()=>{
    setResourceProvider('AWS')
  },[tabValue])

  const handleGetFiles = (name) => {
    if(resourceProvider === 'AWS'){
      getFileAws(name).then((res)=>{
        setFileData(res.data)
        setAwsFileDialog(true)
      }).catch(()=>{
        setFileData([])
        setAwsFileDialog(false)
      })
    }
    if(resourceProvider === 'Azure'){
      getFileAzure(name).then((res)=>{
        setFileData(res.data)
        setAzureFileDialog(true)
      }).catch(()=>{
        setFileData([])
        setAzureFileDialog(false)
      })
    }
  }

  const updateInstance = async (command) =>{
    if(command === 'stop'){
      await stopInstance(instance)
    } else if(command === 'restart'){
      await restartInstance(instance)
    } else if (command === 'terminate'){
      await terminateInstance(instance)
    }
    await getCurrentUser()
  }
  
 



 

 




  return (
    <>
      <Helmet>
        <title> User | Cloud Convergence CCP </title>
      </Helmet>

      <Container>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabValue} aria-label="basic tabs example">
              <Tab label="Storage Space" {...a11yProps(0)} />
              <Tab label="Virutal Machines" {...a11yProps(1)} />
            </Tabs>
          </Box>
        </Box>

        <br/>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {
              tabValue === 0 ? 'Storage Space' : 'Virtual Machines'
            }
          </Typography>
        </Stack>

        {
          tabValue === 0 ?
          <Card>
          <UserListToolbar resourceProvider={resourceProvider} setResourceProvider={setResourceProvider} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  headLabel={TABLE_HEAD}
                />
                <TableBody>
                  {storage.map((row) => {
                    const { id, name, launchTime, status } = row;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" >
                        <TableCell padding="checkbox">
                          {}
                        </TableCell>

                        <TableCell align="left">{name}</TableCell>

                        <TableCell align="left">{formatDate(launchTime)}</TableCell>

                        <TableCell align="left">
                          <Label sx={{cursor:"pointer"}} onClick={()=>{handleGetFiles(name)}}>Get Files</Label>
                        </TableCell>
                        <TableCell align="left">
                          {status ? 'Active' : 'Deleted'}
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e)=>{handleOpenMenu(e,name)}}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

        </Card> : <Card>
          <UserListToolbar resourceProvider={resourceProvider} setResourceProvider={setResourceProvider} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  headLabel={TABLE_HEAD_VM}
                />
                <TableBody>
                  {currentUser.ec2Instances.map((row) => {
                    const { instanceId,tier ,instanceName,launchTime,zone,name, status } = row;

                    return (
                      <TableRow hover key={instanceId} tabIndex={-1} role="checkbox" >
                        <TableCell padding="checkbox">
                          {}
                        </TableCell>

                        <TableCell align="left">{instanceName}</TableCell>

                        <TableCell align="left">{instanceId}</TableCell>

                        <TableCell align="left">
                          <Label >{tier}</Label>
                        </TableCell>
                        <TableCell align="left">{formatDate(launchTime)}</TableCell>
                        <TableCell align="left">
                          {status}
                        </TableCell>
                        <TableCell align="left">
                          {zone}
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" disabled={status === 'terminated'} onClick={(e)=>{handleVmOpenMenu(e,instanceId)}}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

        </Card>
        }
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={()=>{setUploadFileDialog(true)}}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Upload file
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={()=>{setUploadFileDialog(true)}}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Upload file
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Popover
  open={Boolean(vmOpen)}
  anchorEl={vmOpen}
  onClose={handleVmClose}
  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
  PaperProps={{
    sx: {
      p: 1,
      width: 140,
      '& .MuiMenuItem-root': {
        px: 1,
        typography: 'body2',
        borderRadius: 0.75,
      },
    },
  }}
>
  
  <MenuItem onClick={handleDescribe}>
    <Icon icon={'eva:file-text-outline'} sx={{ mr: 2 }} />
    Describe
  </MenuItem>

  <MenuItem onClick={()=>{updateInstance('stop')}}>
    <Icon icon={'eva:stop-circle-outline'} sx={{ mr: 2 }} />
    Stop
  </MenuItem>

  <MenuItem onClick={()=>{updateInstance('restart')}}>
    <Icon icon={'eva:refresh-outline'} sx={{ mr: 2 }} />
    Restart
  </MenuItem>

  <MenuItem onClick={()=>{updateInstance('terminate')}}>
    <Icon icon={'eva:power-outline'} sx={{ mr: 2 }} />
    Terminate
  </MenuItem>

</Popover>

      <Dialog open={uploadFileDialog} onClose={() => {setUploadFileDialog(false)}}>
        <DialogTitle>Upload file</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select a file that you want to upload
          </DialogContentText>
          <TextField
            margin="dense"
            fullWidth
            value={bucketName}
          />
          <Input
            margin="dense"
            type="file"
            fullWidth
            onChange={handleFileChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {setUploadFileDialog(false)}}>Cancel</Button>
          <Button onClick={handleUpload}>Submit</Button>
        </DialogActions>
      </Dialog>
      <AwsFilesDialog data={fileData} open={awsFileDialog} setOpen={setAwsFileDialog}/>
      <AzureFileDialog data={fileData} open={azureFileDialog} setOpen={setAzureFileDialog}/>
      <DescribeDialog open={describeDialogOpen} onClose={handleCloseDescribeDialog} instanceDetail={instanceDetail}/>

    </>
  );
}
