import PropTypes from 'prop-types';
// @mui
import { Tooltip, IconButton, Stack, InputAdornment, TextField } from '@mui/material';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

VehicleTableToolbar.propTypes = {
  onFilterModel: PropTypes.func,
  clearFilter: PropTypes.func,
  filterModel: PropTypes.object,
  setFilterModel: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function VehicleTableToolbar({ filterModel, setFilterModel, onFilterModel, clearFilter }) {
  // rendering ------------------------------------------------------------------------------------------------

  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ py: 1.5, px: 1.5 }}>
        <TextField
          label="Маркаар..."
          value={filterModel?.make}
          onChange={(e) => onFilterModel('make', e.target.value)}
          size="small"
          sx={{
            maxWidth: 200,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <IconButton
                sx={{ visibility: filterModel?.make ? 'visible' : 'hidden' }}
                onClick={() => {
                  setFilterModel({ ...filterModel, make: '' });
                }}
              >
                <Iconify icon={'ic:baseline-clear'} sx={{ color: 'text.disabled', width: 12, height: 12 }} />
              </IconButton>
            ),
          }}
        />

        <TextField
          label="Загвараар..."
          value={filterModel?.model}
          onChange={(e) => onFilterModel('model', e.target.value)}
          size="small"
          sx={{
            maxWidth: 200,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <IconButton
                sx={{ visibility: filterModel?.model ? 'visible' : 'hidden' }}
                onClick={() => {
                  setFilterModel({ ...filterModel, model: '' });
                }}
              >
                <Iconify icon={'ic:baseline-clear'} sx={{ color: 'text.disabled', width: 12, height: 12 }} />
              </IconButton>
            ),
          }}
        />

        <TextField
          label="Жолоочийн нэрээр..."
          value={filterModel?.driver_name}
          onChange={(e) => onFilterModel('driver_name', e.target.value)}
          size="small"
          sx={{
            maxWidth: 220,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <IconButton
                sx={{ visibility: filterModel?.driver_name ? 'visible' : 'hidden' }}
                onClick={() => {
                  setFilterModel({ ...filterModel, driver_name: '' });
                }}
              >
                <Iconify icon={'ic:baseline-clear'} sx={{ color: 'text.disabled', width: 12, height: 12 }} />
              </IconButton>
            ),
          }}
        />

        <TextField
          label="Дугаараар..."
          value={filterModel?.phone}
          onChange={(e) => onFilterModel('phone', e.target.value)}
          size="small"
          sx={{
            maxWidth: 180,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <IconButton
                sx={{ visibility: filterModel?.phone ? 'visible' : 'hidden' }}
                onClick={() => {
                  setFilterModel({ ...filterModel, phone: '' });
                }}
              >
                <Iconify icon={'ic:baseline-clear'} sx={{ color: 'text.disabled', width: 12, height: 12 }} />
              </IconButton>
            ),
          }}
        />

        <Tooltip title="Хайлт цэвэрлэх" sx={{ position: 'absolute', right: '10px' }}>
          <IconButton
            onClick={() => {
              clearFilter();
            }}
          >
            <Iconify icon={'ic:round-refresh'} />
          </IconButton>
        </Tooltip>
      </Stack>
    </>
  );
}
