import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, Button } from '@mui/material';
// component
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function UserListToolbar({ resourceProvider, setResourceProvider }) {
  const isAws = resourceProvider === 'AWS';
  const isAzure = resourceProvider === 'Azure';
  const style = { textDecoration: 'none', backgroundColor: 'rgba(32, 101, 209, 0.08)' };
  return (
    <StyledRoot
      sx={{
        justifyContent: 'flex-start',
      }}
    >
      <Button
        fullWidth
        onClick={() => {
          setResourceProvider('AWS');
        }}
        sx={isAws ? style : null}
      >
        {' '}
        AWS{' '}
      </Button>
      <Button
        fullWidth
        onClick={() => {
          setResourceProvider('Azure');
        }}
        sx={isAzure ? style : null}
      >
        {' '}
        Azure{' '}
      </Button>
    </StyledRoot>
  );
}
