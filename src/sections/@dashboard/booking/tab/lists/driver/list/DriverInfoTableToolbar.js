import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { Stack, InputAdornment, TextField, IconButton } from '@mui/material';
// components
import Iconify from 'src/components/iconify';

// ---------------------------------------------------------------------

DriverInfoTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  dense: PropTypes.bool,
};

// ---------------------------------------------------------------------

export default function DriverInfoTableToolbar({ filterName, onFilterName, dense }) {
  const [value, setValue] = useState('');
  useEffect(() => {
    if (!filterName || filterName === '') {
      setValue('');
    }
  }, [filterName]);
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ py: 1, px: 1, pr: '70%' }}>
      <TextField
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onFilterName(value);
          }
        }}
        placeholder="Хайх..."
        size={'small'}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <IconButton
              sx={{ visibility: value ? 'visible' : 'hidden' }}
              onClick={() => {
                onFilterName(''), setValue('');
              }}
            >
              <Iconify icon={'ic:baseline-clear'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </IconButton>
          ),
        }}
      />
    </Stack>
  );
}
