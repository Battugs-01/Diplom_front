import PropTypes from 'prop-types';
// @mui
import { Tooltip, IconButton, Stack, InputAdornment, TextField } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

AdminTableToolbar.propTypes = {
  onFilterName: PropTypes.func,
  clearFilter: PropTypes.func,
  filterName: PropTypes.string,
  setFilterName: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function AdminTableToolbar({ filterName, setFilterName, onFilterName, clearFilter }) {
  // rendering ------------------------------------------------------------------------------------------------

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.5, px: 1.5 }}>
      <TextField
        value={filterName}
        onChange={onFilterName}
        placeholder="Хайх..."
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <IconButton
              sx={{ visibility: filterName ? 'visible' : 'hidden' }}
              onClick={() => {
                setFilterName('');
              }}
            >
              <Iconify icon={'ic:baseline-clear'} sx={{ color: 'text.disabled', width: 16, height: 16 }} />
            </IconButton>
          ),
        }}
      />

      <Tooltip title="Хайлт цэвэрлэх">
        <IconButton
          onClick={() => {
            clearFilter();
          }}
        >
          <Iconify icon={'ic:round-refresh'} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
