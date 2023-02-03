// @mui
import { Paper, Stack, TableBody, TableRow, TableCell } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

// ----------------------------------------------------------------------

export default function TableLoader({ ...other }) {
  return (
    <TableRow>
      <TableCell align="center" colSpan={13}>
        <Paper {...other}>
          <Stack justifyContent="center" alignItems="center" sx={{ height: 300 }}>
            <CircularProgress size={100} thickness={0.6} sx={{ padding: '5px' }} />
          </Stack>
        </Paper>
      </TableCell>
    </TableRow>
  );
}
