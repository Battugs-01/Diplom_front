import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, MenuItem } from '@mui/material';
// components
import FormProvider, { RHFTextField, RHFSelect } from '../../../../components/hook-form';
// utils
import axiosInstance from 'src/utils/axios';
import { requiredMsg } from 'src/utils/regex';

// ----------------------------------------------------------------------

AdminNewEditDialog.propTypes = {
  currentRow: PropTypes.object,
  dialogStatus: PropTypes.string,
  changeDialogStatus: PropTypes.func,
  saveData: PropTypes.func,
};

export default function AdminNewEditDialog({ currentRow, dialogStatus = 'create', changeDialogStatus, saveData }) {
  // dialog title const
  const textMap = {
    update: 'Засварлах',
    create: 'Бүртгэх',
    view: 'Харах',
  };

  // roles state
  const [roles, setRoles] = useState([]);

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
    getRoles();
  }, [dialogStatus, currentRow]);

  // fetching role array

  async function getRoles() {
    try {
      const data = [
        {
          role: 'Админ',
          company_id: '1',
          name: 'admin',
          status: 'Active',
        },
        { role: 'Систем Админ', company_id: '2', name: 'super_admin', status: 'Active' },
      ];
      setRoles(data);
    } catch (error) {
      console.log(error, 'errorerror');
    }
  }

  // validation schema
  const AdminSchema = Yup.object().shape({
    email: Yup.string().required(),
    phone: Yup.string().required(requiredMsg),
    name: Yup.string().required(requiredMsg),
    password: Yup.string().when('dialogStatus', {
      is: () => dialogStatus === 'create',
      then: Yup.string().required(requiredMsg),
      otherwise: Yup.string().notRequired(),
    }),
    role: Yup.string().required(requiredMsg),
  });

  // initial values
  const defaultValues = useMemo(
    () => ({
      id: currentRow?.id || undefined,
      name: currentRow?.name || '',
      phone: currentRow?.phone || '',
      email: currentRow?.email || '',
      password: currentRow?.password || undefined,
      companyID: 'a1406c45-b1ad-43aa-b9aa-655a38eb4d4b' || '',
    }),
    [currentRow]
  );

  // use form
  const methods = useForm({
    resolver: yupResolver(AdminSchema),
    defaultValues,
  });

  // extracting methods
  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty },
  } = methods;

  // all values
  const values = watch();

  // sending field values to parent func
  const onSubmit = async () => {
    saveData(values);
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
          <Stack spacing={2} sx={{ mt: 1 }}>
            <RHFTextField name="name" label="Нэр" size="small" disabled={dialogStatus === 'view'} />

            <RHFTextField name="phone" label="Утасны дугаар" size="small" disabled={dialogStatus === 'view'} />

            <RHFTextField name="email" label="Нэвтрэх нэр" size="small" disabled={dialogStatus === 'view'} />

            {dialogStatus === 'create' && (
              <RHFTextField
                name="password"
                label="Нууц үг"
                type="password"
                size="small"
                disabled={dialogStatus === 'view'}
              />
            )}

            <RHFSelect
              fullWidth
              name="role"
              label="Эрх"
              size="small"
              InputLabelProps={{ shrink: true }}
              SelectProps={{
                native: false,
                sx: { textTransform: 'capitalize' },
              }}
              disabled={dialogStatus === 'view'}
            >
              <MenuItem
                value=""
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                }}
              >
                Сонгох
              </MenuItem>
              {roles &&
                roles.map((option, index) => (
                  <MenuItem
                    key={index}
                    value={option.name}
                    sx={{
                      mx: 1,
                      my: 0.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                    }}
                  >
                    {option.role}
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
