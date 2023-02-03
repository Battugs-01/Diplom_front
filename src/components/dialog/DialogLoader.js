// @mui
import { Stack } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

// ----------------------------------------------------------------------

export default function DialogLoader() {
  return (
    <Stack justifyContent="center" alignItems="center" sx={{ height: 500 }}>
      <CircularProgress size={100} thickness={0.5} sx={{ padding: '5px' }} />
    </Stack>
  );
}
