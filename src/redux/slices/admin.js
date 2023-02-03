import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  admins: [],
  isOpenModal: false,
  selectedAdminId: null,
  selectedRange: null,
};

const slice = createSlice({
  name: 'Admin',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET ADMINS
    getAdminSuccess(state, action) {
      state.isLoading = false;
      state.admins = action.payload;
    },

    // CREATE ADMIN
    createAdminSuccess(state, action) {
      const newAdmin = action.payload;
      state.isLoading = false;
      state.admins = [...state.admins, newAdmin];
    },

    // UPDATE ADMIN
    updateAdminSuccess(state, action) {
      const Admin = action.payload;
      const updateAdmin = state.admins.map((_Admin) => {
        if (_Admin.id === Admin.id) {
          return Admin;
        }
        return _Admin;
      });

      state.isLoading = false;
      state.admins = updateAdmin;
    },

    // DELETE ADMIN
    deleteAdminSuccess(state, action) {
      const { AdminId } = action.payload;
      const deleteAdmin = state.admins.filter((Admin) => Admin.id !== AdminId);
      state.admins = deleteAdmin;
    },

    // SELECT ADMIN
    selectAdmin(state, action) {
      const AdminId = action.payload;
      state.isOpenModal = true;
      state.selectedAdminId = AdminId;
    },

    // SELECT RANGE
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.isOpenModal = true;
      state.selectedRange = { start, end };
    },

    // OPEN MODAL
    openModal(state) {
      state.isOpenModal = true;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
      state.selectedAdminId = null;
      state.selectedRange = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectAdmin } = slice.actions;

// ----------------------------------------------------------------------

export function getAdmins(params) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/admin/list', params);
      let resp = { data: response?.data?.data?.rows || [], count: response?.data?.data?.count || 0 };
      dispatch(slice.actions.getAdminSuccess(resp));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createAdmin(newAdmin) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/admin/create', newAdmin);
      dispatch(slice.actions.createAdminSuccess(response.data.Admin));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateAdmin(AdminId, updateAdmin) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/admin/update', {
        AdminId,
        updateAdmin,
      });
      dispatch(slice.actions.updateAdminSuccess(response.data.Admin));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteAdmin(AdminId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/admin/delete', { AdminId });
      dispatch(slice.actions.deleteAdminSuccess({ AdminId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function selectRange(start, end) {
  return async () => {
    dispatch(
      slice.actions.selectRange({
        start: start.getTime(),
        end: end.getTime(),
      })
    );
  };
}
