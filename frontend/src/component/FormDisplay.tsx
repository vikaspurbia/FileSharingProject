// src/component/FormDisplay.tsx

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const FormDisplay = () => {
  const formData = useSelector((state: RootState) => state.formData);

  return (
    <div>
      <h3>Form Data:</h3>
      <pre>{JSON.stringify(formData,null,2)}</pre>
    </div>
  );
};

export default FormDisplay;
