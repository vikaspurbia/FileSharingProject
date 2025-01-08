import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  firstName: string;
  lastName: string;
  age: string;
  contact: string;
  cityName: string;
}

const initialState: UserState = {
  firstName: '',
  lastName: '',
  age: '',
  contact: '',
  cityName: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserState>) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.age = action.payload.age;
      state.contact = action.payload.contact;
      state.cityName = action.payload.cityName;
    },
    resetUserData: (state) => {
      state.firstName = '';
      state.lastName = '';
      state.age = '';
      state.contact = '';
      state.cityName = '';
    },
  },
});

export const { setUserData, resetUserData } = userSlice.actions;

export default userSlice.reducer;
