import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Container, Stack, Typography } from '@mui/material';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
import PRODUCTS from '../_mock/products';
import StorageProviderDialog from '../components/dialogs/StorageProviderDialog';
import VmProviderDialog from '../components/dialogs/VMProviderDialog';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);
  const [openStorage,setOpenStorage]=useState(false);
  const [openVm,setOpenVm]=useState(false)
  console.log('test')

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  const handleDialog = (type) =>{
    if(type==='storage') setOpenStorage(true)
    if(type==='vm') setOpenVm(true)
  }
  return (
    <>
      <Helmet>
        <title> Dashboard: Products | Minimal UI </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Services
        </Typography>
        <ProductList products={PRODUCTS} handleDialog={handleDialog} />
      </Container>
      <StorageProviderDialog openStorage={openStorage} setOpenStorage={setOpenStorage}/>
      <VmProviderDialog openVm={openVm} setOpenVm={setOpenVm}/>
    </>
  );
}
