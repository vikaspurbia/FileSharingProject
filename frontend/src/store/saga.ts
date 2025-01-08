import { takeLatest, put } from 'redux-saga/effects';
import { setUserData } from './createSlice';

function* saveUserDataToLocalStorage(action: ReturnType<typeof setUserData>) {
  try {
    const { payload } = action;
    localStorage.setItem('userData', JSON.stringify(payload)); // Save to local storage
  } catch (error) {
    console.error('Failed to save user data to localStorage', error);
  }
}

export function* watchUserActions() {
  yield takeLatest(setUserData.type, saveUserDataToLocalStorage);
}
