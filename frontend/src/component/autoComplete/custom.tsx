import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

interface CustomBoxProps {
  films: { label: string; year: number }[];
  styling?: object;
}

const CustomBox: React.FC<CustomBoxProps> = ({ films, styling }) => {
  const [inputValue, setInputValue] = React.useState('');

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<{}>, newInputValue: string) => {
    setInputValue(newInputValue); // Update state with the new input value
    console.log('Input value changed to:', newInputValue);
  };

  return (
    <Autocomplete
      disablePortal
      options={films}
      sx={{ width: 300, ...styling }}
      inputValue={inputValue} // Control the input value
      onInputChange={handleInputChange} // Use inputChange handler
      renderInput={(params) => <TextField {...params} label="Movie" />}
      renderOption={(props, option) => (
        <li {...props}>
          {option.label} ({option.year})  {/* Custom display */}
        </li>
      )}
    />
  );
};

export default CustomBox;
