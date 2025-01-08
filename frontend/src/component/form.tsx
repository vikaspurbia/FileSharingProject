import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Autocomplete,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setUserData } from "../store/createSlice";
import { z } from "zod";

// Zod schema for form validation
const userFormSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  age: z
    .string()
    .min(1, "Age is required")
    .regex(/^\d+$/, "Age must be a number")
    .refine((age) => parseInt(age) >= 18, "Age must be 18 or older"),
  contact: z
    .string()
    .min(1, "Contact is required")
    .min(10, "Contact must be 10 digits")
    .max(10, "Contact must be 10 digits")
    .regex(/^\d+$/, "Contact must be a valid number"),
  cityName: z.string().min(1, "City Name is required"),
});

const UserForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    contact: "",
    cityName: "",
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    age: "",
    contact: "",
    cityName: "",
  });

  const handleTextFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fix the city change handler to match the Autocomplete event type
  const handleCityChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    setFormData({ ...formData, cityName: newValue || "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset form errors before validation
    setFormErrors({
      firstName: "",
      lastName: "",
      age: "",
      contact: "",
      cityName: "",
    });

    // Validate form data with Zod schema
    const result = userFormSchema.safeParse(formData);
    if (!result.success) {
      // Handle Zod validation errors
      const errors = result.error.errors.reduce((acc, error) => {
        const key = error.path[0] as keyof typeof formErrors; // Cast to keyof FormErrors
        acc[key] = error.message;
        return acc;
      }, {} as typeof formErrors);

      setFormErrors(errors);
      return;
    }

    // If valid, dispatch action to store in Redux
    dispatch(setUserData(formData));

    // Store the form data in localStorage
    localStorage.setItem("userData", JSON.stringify(formData));
    console.log("Form submitted:", formData);

    setFormData({
      firstName: "",
      lastName: "",
      age: "",
      contact: "",
      cityName: "",
    });

    setFormErrors({
      firstName: "",
      lastName: "",
      age: "",
      contact: "",
      cityName: "",
    }); // Reset form errors after successful submission
  };

  const cityOptions = [
    "New York",
    "Delhi",
    "Mumbai",
    "Jaipur",
    "London",
    "Berlin",
    "Tokyo",
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <Paper elevation={3} style={{ padding: "20px", borderRadius: "8px" }}>
        <Typography variant="h5" gutterBottom align="center" sx={{marginBottom:2}}>
          FORM
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                name="firstName"
                value={formData.firstName}
                onChange={handleTextFieldChange}
                size="small"
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                name="lastName"
                value={formData.lastName}
                onChange={handleTextFieldChange}
                size="small"
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Age"
                variant="outlined"
                fullWidth
                name="age"
                value={formData.age}
                onChange={(e) => {
                  const { name, value } = e.target;
                  if (/^\d*$/.test(value)) {
                    handleTextFieldChange(e);
                  }
                }}
                type="number"
                size="small"
                error={!!formErrors.age}
                helperText={formErrors.age}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Contact"
                variant="outlined"
                fullWidth
                name="contact"
                value={formData.contact}
                onChange={(e) => {
                  const { name, value } = e.target;
                  if (/^\d*$/.test(value) && value.length <= 10) {
                    handleTextFieldChange(e);
                  }
                }}
                type="tel"
                size="small"
                error={!!formErrors.contact}
                helperText={formErrors.contact}
              />
            </Grid>

            <Grid item xs={12} sm={6} >
              <Autocomplete
                options={cityOptions}
                value={formData.cityName}
                onChange={handleCityChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select a city"
                    variant="outlined"
                    error={!!formErrors.cityName}
                    helperText={formErrors.cityName}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                size="large"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default UserForm;
