import React from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { Box } from '@mui/material';

const TodoBox = ({ note, setNote, isFirst, onEdit, noteKey}) => {
  const handleChange = (event) => {
    if (onEdit) {
      onEdit(noteKey, event.target.value);
    }
    else{
      setNote(event.target.value);
    }
    
  };


  return (
    <Box sx={{ width: '100%', maxWidth: isFirst? {xs:480, sm:700, md:800} : 480, margin: '0 auto', marginTop: isFirst ? 10 : 0 , marginBottom: isFirst ? 10 : 0,
    ml: isFirst ? { xs: 0, sm: 0, md: 0 } : { xs: 0, sm: 0, md: 10, lg:12 }
    }}>
      <TextareaAutosize
        minRows={1}
        placeholder="Type your todo here..."
        value={note} // Use value instead of defaultValue for controlled component
        onChange={handleChange} // Add onChange handler
        style={{
          width: '100%',
          padding: '8px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          boxSizing: 'border-box'
        }}
      />
    </Box>
  );
}

export default TodoBox;
