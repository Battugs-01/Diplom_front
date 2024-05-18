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
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ py: 1.5, px: 1.5 }}></Stack>
  );
}
