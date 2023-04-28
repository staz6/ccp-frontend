import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { useAuth } from '../../../context/AuthContext';

// ----------------------------------------------------------------------

export default function SignInForm() {
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [name,setName]=useState('');
  const [username,setUsername]=useState('')
  const [organization,setOrganization]=useState("")
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error) {
      const errorTimeout = setTimeout(() => {
        setError(null);
      }, 5000); // Remove error message after 5 seconds

      return () => clearTimeout(errorTimeout); // Clean up the timeout when the component unmounts
    }
    return undefined;
  }, [error]);

  const handleClick = async () => {
    try {
      const result = await signUp(name,email, password,organization,username);
      console.log(result)
    } catch (err) {
      setError('Invalid request');
    }
  };
  console.log(error)
  return (
    <>
      <Typography
        variant="body2"
        sx={{
          color: 'red',
          fontSize: '0.9rem', // Increase text size
          paddingBottom: '1rem', // Add padding to the bottom
        }}
      >
        {error}
      </Typography>
      <Stack spacing={3}>
      <TextField
          name="username"
          label="Username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />

      <TextField
          name="name"
          label="Full name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />

        <TextField
          name="email"
          label="Email address"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

<TextField
          name="organization"
          label="Organization Name"
          onChange={(e) => {
            setOrganization(e.target.value);
          }}
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 2 }}>
        {/* <Checkbox name="remember" label="Remember me" /> */}
        {/* <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link> */}
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Sign In
      </LoadingButton>
    </>
  );
}
