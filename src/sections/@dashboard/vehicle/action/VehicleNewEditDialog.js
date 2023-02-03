import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, MenuItem } from '@mui/material';
// components
import FormProvider, { RHFTextField, RHFSelect, RHFAutocomplete } from '../../../../components/hook-form';
// utils
import axiosInstance from 'src/utils/axios';
import { carRegex, carRegexMsg, requiredMsg } from 'src/utils/regex';

// ----------------------------------------------------------------------

VehicleNewEditDialog.propTypes = {
  currentRow: PropTypes.object,
  dialogStatus: PropTypes.string,
  changeDialogStatus: PropTypes.func,
  saveData: PropTypes.func,
  markList: PropTypes.array,
  companyList: PropTypes.array,
  driverList: PropTypes.array,
  vehicleTypeList: PropTypes.array,
};

const personalOrNot = [
  {
    value: 'Yes',
    name: 'Тийм',
  },
  {
    value: 'No',
    name: 'Үгүй',
  },
];

const handicapOrNot = [
  {
    value: 'Yes',
    name: 'Тийм',
  },
  {
    value: 'No',
    name: 'Үгүй',
  },
];

const statusList = [
  {
    value: 'Active',
    name: 'Идэвхитэй',
  },
  {
    value: 'Inactive',
    name: 'Идэвхигүй',
  },
];

const wheelTypeList = [
  {
    value: 'Right',
    name: 'Буруу талдаа',
  },
  {
    value: 'Left',
    name: 'Зөв талдаа',
  },
];

export default function VehicleNewEditDialog({
  currentRow,
  dialogStatus = 'create',
  changeDialogStatus,
  saveData,
  markList,
  companyList,
  driverList,
  vehicleTypeList,
}) {
  // dialog title const
  const textMap = {
    update: 'Засварлах',
    create: 'Бүртгэх',
    view: 'Харах',
  };

  // roles state
  const [modelList, setModelList] = useState([]);

  // whether dialog open or not state
  const [dialogFormVisible, setDialogFormVisible] = useState(false);

  // checking which dialog need to open
  useEffect(() => {
    if (dialogStatus === 'create' || dialogStatus === 'update' || dialogStatus === 'view') {
      setDialogFormVisible(true);
    } else {
      setDialogFormVisible(false);
    }
    reset(defaultValues);
  }, [dialogStatus, currentRow]);

  // setting specific objects on fields when status either update and view
  useEffect(() => {
    if (dialogStatus === 'update' || dialogStatus === 'view') {
      findMarkObjectById(currentRow?.make_id);
      findDriverObjectById(currentRow?.driver_id);
      findCompanyObjectById(currentRow?.company_id);
    }
  }, [currentRow]);

  // validation schema
  const DriverVehicleSchema = Yup.object().shape({
    make_id: Yup.object().shape({
      make: Yup.string().required(),
    }),
    model_id: Yup.object().shape({
      title: Yup.string().required(),
    }),
    company_id: Yup.object().shape({
      company: Yup.string().required(),
    }),
    driver_id: Yup.object().shape({
      name: Yup.string().required(),
    }),
    colour: Yup.string().required(requiredMsg),
    licence_plate: Yup.string().required(requiredMsg).matches(carRegex, carRegexMsg),
  });

  // initial values
  const defaultValues = useMemo(
    () => ({
      driver_vehicle_id: currentRow?.driver_vehicle_id || null,
      driver_id: {},
      make_id: {},
      model_id: currentRow?.model || {},
      company_id: {},
      year: currentRow?.year || '0',
      colour: currentRow?.colour || '',
      licence_plate: currentRow?.licence_plate || '',
      wheel_type: currentRow?.wheel_type || 'Left',
      vehicle_velongs_to_provider: currentRow?.vehicle_velongs_to_provider || 'Yes',
      handi_cap_accessibility: currentRow?.handi_cap_accessibility || 'No',
      car_type: currentRow?.car_type || '1',
      status: currentRow?.status || 'Active',
      car_go: 'Yes',
      car_x: 'Yes',
      type: 'Ride',
      user_type: 'Driver',
      app_type: 'UberX',
      rental_car_type: currentRow?.car_type || '1',
    }),
    [currentRow]
  );

  // use form
  const methods = useForm({
    resolver: yupResolver(DriverVehicleSchema),
    defaultValues,
  });

  // extracting methods
  const {
    reset,
    watch,
    setValue,
    handleSubmit,

    formState: { isSubmitting, isDirty },
  } = methods;

  // all values
  const values = watch();

  // sending field values to parent func
  const onSubmit = async () => {
    saveData(values);
  };

  // fetching model list
  const getModelList = useCallback(async () => {
    try {
      await axiosInstance
        .post('/model/list', { make_id: values?.make_id?.make_id || null })
        .then((response) => {
          setModelList(response?.data?.data?.rows || []);
        })
        .catch((error) => {
          enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : `Алдаа гарлаа`, {
            variant: 'warning',
          });
        });
    } catch (error) {
      enqueueSnackbar('Алдаа гарлаа', { variant: 'error' });
      console.error(error);
    }
  }, [values?.make_id?.make_id]);

  // if values make filled with object then call model list
  useEffect(() => {
    if (values?.make_id?.make_id) {
      getModelList();
    }
  }, [getModelList, values?.make_id?.make_id]);

  // finding specific object when update or view on company field
  const findMarkObjectById = async (id) => {
    const selectedOption = await markList.find((option) => option.make_id === id);
    setValue('make_id', selectedOption);
  };

  // finding specific object when update or view on company field
  const findCompanyObjectById = async (id) => {
    const selectedOption = await companyList.find((option) => option.company_id === id);
    setValue('company_id', selectedOption);
  };

  // finding specific object when update or view on company field
  const findDriverObjectById = async (id) => {
    const selectedOption = await driverList.find((option) => option.driver_id === id);
    setValue('driver_id', selectedOption);
  };

  // handling dialog close
  const handleClose = () => {
    setDialogFormVisible(false);
    changeDialogStatus('');
    reset(defaultValues);
  };

  // rendering --------------------------------------------------------------------------------------------------

  return (
    <Dialog open={dialogFormVisible} onClose={handleClose} sx={{ p: 5 }} maxWidth="sm" fullWidth>
      <DialogTitle>{textMap[dialogStatus]}</DialogTitle>
      <DialogContent dividers>
        <FormProvider methods={methods}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <RHFAutocomplete
              name="make_id"
              label="Марк"
              ChipProps={{ size: 'small' }}
              options={markList}
              disabled={dialogStatus === 'view'}
              getOptionLabel={(option) => (option && option.make ? option.make : '')}
            />

            {values?.make_id?.make_id && (
              <RHFAutocomplete
                name="model_id"
                label="Модел"
                options={modelList}
                disabled={dialogStatus === 'view'}
                getOptionLabel={(option) => (option && option.title ? option.title : '')}
                ChipProps={{ size: 'small' }}
              />
            )}

            <RHFTextField name="year" label="Үйлдвэрлэсэн он" size="small" disabled={dialogStatus === 'view'} />

            <RHFTextField name="colour" size="small" label="Өнгө" disabled={dialogStatus === 'view'} />

            <RHFTextField
              name="licence_plate"
              label="Улсын дугаар"
              size="small"
              placeholder="12-34УБВ"
              disabled={dialogStatus === 'view'}
            />

            <RHFAutocomplete
              name="company_id"
              label="Компани"
              options={companyList}
              disabled={dialogStatus === 'view'}
              getOptionLabel={(option) => (option && option.company ? option.company : '')}
              ChipProps={{ size: 'small' }}
            />

            <RHFAutocomplete
              name="driver_id"
              label="Жолооч"
              options={driverList}
              disabled={dialogStatus === 'view'}
              getOptionLabel={(option) => (option && option.name ? option.name : '')}
              ChipProps={{ size: 'small' }}
            />

            <RHFSelect
              fullWidth
              name="car_type"
              label="Машины ажиллах үйлчлигээний төрлүүд"
              size="small"
              disabled={dialogStatus === 'view'}
              InputLabelProps={{ shrink: true }}
              SelectProps={{
                native: false,
                sx: { textTransform: 'capitalize' },
              }}
            >
              {vehicleTypeList.map((option, index) => (
                <MenuItem
                  key={index}
                  disabled={option?.status !== 'Active'}
                  value={option.vehicle_type_id}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                  }}
                >
                  {option.vehicle_type_mn}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect
              fullWidth
              name="handi_cap_accessibility"
              label="Хөгжлийн бэрхшээлтэй хүнд зориулсан эсэх ?"
              size="small"
              disabled={dialogStatus === 'view'}
              InputLabelProps={{ shrink: true }}
              SelectProps={{
                native: false,
                sx: { textTransform: 'capitalize' },
              }}
            >
              {handicapOrNot.map((option, index) => (
                <MenuItem
                  key={index}
                  value={option.value}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                  }}
                >
                  {option.name}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect
              fullWidth
              name="vehicle_velongs_to_provider"
              label="Тээврийн хэрэгсэл нь жолоочийн хувийн эсэх?"
              size="small"
              disabled={dialogStatus === 'view'}
              InputLabelProps={{ shrink: true }}
              SelectProps={{
                native: false,
                sx: { textTransform: 'capitalize' },
              }}
            >
              {personalOrNot.map((option, index) => (
                <MenuItem
                  key={index}
                  value={option.value}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                  }}
                >
                  {option.name}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect
              fullWidth
              name="wheel_type"
              label="Аль талдаа үрүүлтэй ?"
              size="small"
              disabled={dialogStatus === 'view'}
              InputLabelProps={{ shrink: true }}
              SelectProps={{
                native: false,
                sx: { textTransform: 'capitalize' },
              }}
            >
              {wheelTypeList.map((option, index) => (
                <MenuItem
                  key={index}
                  value={option.value}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                  }}
                >
                  {option.name}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect
              fullWidth
              name="status"
              label="Төлөв"
              size="small"
              disabled={dialogStatus === 'view'}
              InputLabelProps={{ shrink: true }}
              SelectProps={{
                native: false,
                sx: { textTransform: 'capitalize' },
              }}
            >
              {statusList.map((option, index) => (
                <MenuItem
                  key={index}
                  value={option.value}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                  }}
                >
                  {option.name}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        {dialogStatus !== 'view' && (
          <LoadingButton
            variant="contained"
            disabled={!isDirty}
            loading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            Хадгалах
          </LoadingButton>
        )}
        <Button variant="outlined" color="inherit" onClick={handleClose}>
          Хаах
        </Button>
      </DialogActions>
    </Dialog>
  );
}
