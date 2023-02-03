import PropTypes from 'prop-types';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
// @mui
import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Box,
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

var columnList = [
  { code: 'bi.building_no', name: 'Байр' },
  { code: 'bi.position', name: 'Байршил' },
  { code: 'bi.descr', name: 'Тайлбар' },
  { code: 'bi.townname', name: 'Хотхон' },
  { code: 'bd.district_name', name: 'Дүүрэг' },
  { code: 'bs.subdistrict_name', name: 'Хороо' },
  { code: 'bt.name', name: 'Төрөл' },
];

AddressLocationTableToolbar.propTypes = {
  onFilter: PropTypes.func,
  refreshTable: PropTypes.func,
  refreshFilterArray: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function AddressLocationTableToolbar({ onFilter, refreshTable, refreshFilterArray, secondFieldRef }) {
  // search key word state
  const [chosenColumnObject, setChosenColumnObject] = useState(columnList[1]);

  // search textfield state
  const [searchFieldValue, setSearchFieldValue] = useState('');

  // filter array state
  const [filterArray, setFilterArray] = useState([]);

  // sending array to the parent component
  useEffect(() => {
    if (filterArray) {
      onFilter(filterArray);
    }
  }, [filterArray]);

  // handling search textfield value
  const handleSearchChange = (event) => {
    setSearchFieldValue(event.target.value);
  };

  // handling value when tap enter
  const handleTableSearchKeyDown = (event) => {
    switch (event.key) {
      case 'Enter': {
        event.preventDefault();
        event.stopPropagation();
        if (event.target.value.length > 0) {
          buildingFilterArrayFunc(event.target.value);
          setSearchFieldValue('');
        }
        break;
      }
      default:
    }
  };

  //handleSearchByTableColumn
  const buildingFilterArrayFunc = async (val) => {
    let value = val.toString().trim();
    if (!value) return;
    setFilterArray([
      ...filterArray,
      { filter: chosenColumnObject?.code, value: value, mnName: chosenColumnObject?.name },
    ]);
  };

  // clearing all values that are related to search
  const handleReset = () => {
    setChosenColumnObject(columnList[1]);
    setSearchFieldValue('');
    setFilterArray([]);
    refreshFilterArray();
    refreshTable();
  };

  console.log(chosenColumnObject);

  return (
    <Stack direction="row" spacing={1.5} sx={{ padding: 2, flexWrap: 'wrap' }} alignItems="center">
      <FormControl sx={{ minWidth: 180 }} size="small">
        <InputLabel>Хайлтын түлхүүр үг</InputLabel>
        <Select
          size="small"
          label="Хайлтын түлхүүр үг"
          value={chosenColumnObject}
          onChange={(e) => setChosenColumnObject(e.target.value)}
        >
          {columnList.map((column, index) => (
            <MenuItem key={index} value={column}>
              {column?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Хайх"
        size="small"
        sx={{ maxWidth: 220 }}
        value={searchFieldValue}
        onChange={handleSearchChange}
        inputRef={secondFieldRef}
        onKeyDown={(event) => handleTableSearchKeyDown(event)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="material-symbols:search" />
            </InputAdornment>
          ),
        }}
      />

      <IconButton onClick={handleReset}>
        <Iconify icon="material-symbols:refresh" height={20} width={20} />
      </IconButton>

      {filterArray.map((row, index) => (
        <Box sx={{ padding: '10px 0 10px 0 ' }}>
          <Chip variant="outlined" label={`${row.mnName} = ${row.value}`} />
        </Box>
      ))}
    </Stack>
  );
}
