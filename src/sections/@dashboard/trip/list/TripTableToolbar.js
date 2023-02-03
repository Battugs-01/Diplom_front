import PropTypes from 'prop-types';
// @mui
import { Tooltip, IconButton, Stack, InputAdornment, TextField } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

AdminTableToolbar.propTypes = {
  onFilterModel: PropTypes.func,
  clearFilter: PropTypes.func,
  filterModel: PropTypes.object,
  setFilterModel: PropTypes.func,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  setFilterName: PropTypes.func,
  showSign: PropTypes.bool,
  onLessOrGreaterThan: PropTypes.func,
  distanceSign: PropTypes.bool,
  onLessOrGreaterThanDistance: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function AdminTableToolbar({
  filterName,
  filterModel,
  onFilterModel,
  setFilterModel,
  clearFilter,
  onFilterName,
  setFilterName,
  showSign,
  onLessOrGreaterThan,
  distanceSign,
  onLessOrGreaterThanDistance,
}) {
  // rendering ------------------------------------------------------------------------------------------------

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ py: 1.5, px: 1.5 }}>
      <TextField
        size="small"
        sx={{ maxWidth: 180 }}
        label="Хаягаар..."
        value={filterModel?.saddress}
        onChange={(e) => onFilterModel('saddress', e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <IconButton
              sx={{ visibility: filterModel?.saddress ? 'visible' : 'hidden' }}
              onClick={() => {
                setFilterModel({ ...filterModel, saddress: '' });
              }}
            >
              <Iconify icon={'ic:baseline-clear'} sx={{ color: 'text.disabled', width: 16, height: 16 }} />
            </IconButton>
          ),
        }}
      />

      <TextField
        size="small"
        sx={{ maxWidth: 180 }}
        label="Жолоочийн нэрээр..."
        value={filterName}
        onChange={onFilterName}
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

      <TextField
        size="small"
        sx={{ maxWidth: 180 }}
        label="Жолоочийн утсаар..."
        value={filterModel?.rdPhone}
        onChange={(e) => onFilterModel('rdPhone', e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <IconButton
              sx={{ visibility: filterModel?.rdPhone ? 'visible' : 'hidden' }}
              onClick={() => {
                setFilterModel({ ...filterModel, rdPhone: '' });
              }}
            >
              <Iconify icon={'ic:baseline-clear'} sx={{ color: 'text.disabled', width: 16, height: 16 }} />
            </IconButton>
          ),
        }}
      />

      <TextField
        size="small"
        sx={{ maxWidth: 180 }}
        label="Хэрэглэгчийн утсаар..."
        value={filterModel?.ruPhone}
        onChange={(e) => onFilterModel('ruPhone', e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <IconButton
              sx={{ visibility: filterModel?.ruPhone ? 'visible' : 'hidden' }}
              onClick={() => {
                setFilterModel({ ...filterModel, ruPhone: '' });
              }}
            >
              <Iconify icon={'ic:baseline-clear'} sx={{ color: 'text.disabled', width: 16, height: 16 }} />
            </IconButton>
          ),
        }}
      />

      <TextField
        size="small"
        sx={{ maxWidth: 160 }}
        label="АУД-аар..."
        value={filterModel?.licence_plate}
        onChange={(e) => onFilterModel('licence_plate', e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <IconButton
              sx={{ visibility: filterModel?.licence_plate ? 'visible' : 'hidden' }}
              onClick={() => {
                setFilterModel({ ...filterModel, licence_plate: '' });
              }}
            >
              <Iconify icon={'ic:baseline-clear'} sx={{ color: 'text.disabled', width: 16, height: 16 }} />
            </IconButton>
          ),
        }}
      />

      <TextField
        size="small"
        type="number"
        sx={{ maxWidth: 180 }}
        label="Нийт төлбөрөөр..."
        placeholder={showSign ? 'ихээр' : 'багаар'}
        value={filterModel?.trip_generate_fare}
        onChange={(e) => onFilterModel('trip_generate_fare', e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={onLessOrGreaterThan} edge="start">
                <Iconify
                  icon={
                    showSign
                      ? 'material-symbols:keyboard-arrow-up-rounded'
                      : 'material-symbols:keyboard-arrow-down-rounded'
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <IconButton
              sx={{ visibility: filterModel?.trip_generate_fare ? 'visible' : 'hidden' }}
              onClick={() => {
                setFilterModel({ ...filterModel, trip_generate_fare: '' });
              }}
            >
              <Iconify icon={'ic:baseline-clear'} sx={{ color: 'text.disabled', width: 16, height: 16 }} />
            </IconButton>
          ),
        }}
      />

      <TextField
        size="small"
        type="number"
        sx={{ maxWidth: 180 }}
        label="Км-ээр"
        placeholder={distanceSign ? 'ихээр' : 'багаар'}
        value={filterModel?.distance}
        onChange={(e) => onFilterModel('distance', e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={onLessOrGreaterThanDistance} edge="start">
                <Iconify
                  icon={
                    distanceSign
                      ? 'material-symbols:keyboard-arrow-up-rounded'
                      : 'material-symbols:keyboard-arrow-down-rounded'
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <IconButton
              sx={{ visibility: filterModel?.distance ? 'visible' : 'hidden' }}
              onClick={() => {
                setFilterModel({ ...filterModel, distance: '' });
              }}
            >
              <Iconify icon={'ic:baseline-clear'} sx={{ color: 'text.disabled', width: 16, height: 16 }} />
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
  );
}
