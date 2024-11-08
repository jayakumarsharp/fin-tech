import React from "react";
import { FormControl, Button, Typography, TextField, Box } from '@mui/material'; // Import necessary Material-UI components
import Alert from '../common/Alert';

const Notes = ({ handleEdit, portfolio }) => {
  // const { formData, formErrors, formSuccess, handleChange, handleSubmit } = useForm(
  //   {
  //     notes: portfolio.notes,
  //   },
  //   handleEdit,
  //   "",
  // );
  
  const { notes } = formData;

  return (
    <form onSubmit={handleSubmit}>
    <FormControl fullWidth sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>Notes</Typography>
      <TextField
        multiline
        rows={3}
        placeholder="Notes"
        name="notes"
        value={notes}
        onChange={handleChange}
        variant="outlined"
        fullWidth
      />
    </FormControl>
    {formErrors.length > 0 && (
      <Box mb={3}>
        <Alert type="danger" messages={formErrors} />
      </Box>
    )}
    {formSuccess && (
      <Box mb={3}>
        <Alert type="success" messages={["Updated successfully."]} />
      </Box>
    )}
    <Button type="submit" variant="contained" color="primary">
      Save Notes
    </Button>
  </form>
  );
}



export default Notes;