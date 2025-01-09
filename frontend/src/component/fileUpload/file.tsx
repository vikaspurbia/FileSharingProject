// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Autocomplete, TextField, Button, Select, MenuItem, Paper } from '@mui/material';

// interface UploadResponse {
//   fileName: string;
// }

// const ShareFile = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [shareType, setShareType] = useState<string>('individually');
//   const [emails, setEmails] = useState<string[]>([]);
//   const [role, setRole] = useState<string>('user');
//   const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]); // State for email suggestions

//   // Fetch email suggestions from the server
//   useEffect(() => {
//     const fetchEmailSuggestions = async () => {
//       try {
//         const response = await axios.get<string[]>('http://localhost:5000/api/users/emails');
//         setEmailSuggestions(response.data);
//       } catch (error) {
//         console.error('Error fetching email suggestions:', error);
//       }
//     };

//     fetchEmailSuggestions();
//   }, []);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) setFile(e.target.files[0]);
//   };

//   const handleShare = async () => {
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       // Upload the file
//       const uploadResponse = await axios.post<UploadResponse>('http://localhost:5000/api/files/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       const fileName = uploadResponse.data.fileName;
//       const shareData = { fileName, shareType, emails, role };

//       // Share the file
//       await axios.post('http://localhost:5000/api/files/share-file', shareData);

//       alert('File shared successfully!');
//     } catch (error) {
//       console.error('Error sharing file:', error);
//       alert('Error sharing file');
//     }
//   };

//   return (
//     <Paper elevation={3} style={{ padding: '16px', maxWidth: '400px', margin: 'auto' }}>
//       <h1 style={{ fontSize: '1.5rem', textAlign: 'center' }}>Share File</h1>
      
//       <input type="file" onChange={handleFileChange} style={{ width: '100%' }} />

//       <Select
//         value={shareType}
//         onChange={(e) => setShareType(e.target.value)}
//         fullWidth
//         style={{ marginTop: '16px' }}
//       >
//         <MenuItem value="individually">Email</MenuItem>
//         <MenuItem value="role-based">Role</MenuItem>
  
//       </Select>

//       {shareType !== 'role-based' && (
//         <Autocomplete
//           multiple
//           options={emailSuggestions}
//           onChange={(event: any, value: string[]) => setEmails(value)}
//           renderInput={(params) => (
//             <TextField {...params} variant="outlined" label="Enter Email" placeholder="Emails" style={{ marginTop: '16px' }} />
//           )}
//         />
//       )}

//       {shareType === 'role-based' && (
//         <Select
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//           fullWidth
//           style={{ marginTop: '16px' }}
//         >
//           <MenuItem value="user">User</MenuItem>
//           <MenuItem value="admin">Admin</MenuItem>
//         </Select>
//       )}

//       <Button 
//         variant="contained" 
//         color="primary" 
//         onClick={handleShare} 
//         style={{ marginTop: '16px', width: '100%' }}
//       >
//         Share File
//       </Button>
//     </Paper>
//   );
// };

// export default ShareFile;








import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Autocomplete, TextField, Button, Select, MenuItem, Paper } from '@mui/material';

interface UploadResponse {
  fileName: string;
}

const ShareFile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [shareType, setShareType] = useState<string>('individually');
  const [emails, setEmails] = useState<string[]>([]);
  const [role, setRole] = useState<string>('user');
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]); // State for email suggestions
  const [loadingEmails, setLoadingEmails] = useState<boolean>(false); // To handle loading state for emails
  const [searchQuery, setSearchQuery] = useState<string>(''); // Track search query for fetching emails
  const [inputValue, setInputValue] = useState<string>(''); // Track the input value in Autocomplete

  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch a small initial set of email suggestions
  useEffect(() => {
    const fetchInitialEmailSuggestions = async () => {
      try {
        const response = await axios.get<string[]>('http://localhost:5000/api/users/emails');
        setEmailSuggestions(response.data.slice(0, 20)); // Show only the first 20 emails initially
      } catch (error) {
        console.error('Error fetching initial email suggestions:', error);
      }
    };

    fetchInitialEmailSuggestions();
  }, []);

  // Fetch emails based on the search query
  const fetchEmailsOnSearch = async (query: string) => {
    if (query.length < 3) return; // Avoid fetching if query is too short

    setLoadingEmails(true);

    try {
      const response = await axios.get<string[]>('http://localhost:5000/api/users/emails', {
        params: { query }, // Send query as a search parameter
      });
      setEmailSuggestions(response.data); // Update email suggestions based on the search query
    } catch (error) {
      console.error('Error fetching email suggestions:', error);
    } finally {
      setLoadingEmails(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleShare = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Upload the file
      const uploadResponse = await axios.post<UploadResponse>('http://localhost:5000/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const fileName = uploadResponse.data.fileName;
      const shareData = { fileName, shareType, emails, role };

      // Share the file
      await axios.post('http://localhost:5000/api/files/share-file', shareData);

      alert('File shared successfully!');

      // Reset the fields after sharing the file
      setFile(null);
      setEmails([]); // Clear emails array
      setRole('user');
      setSearchQuery(''); // Clear the search query
      setShareType('individually');
      setInputValue(''); // Reset input value for Autocomplete

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error sharing file:', error);
      alert('Error sharing file');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '16px', maxWidth: '400px', margin: 'auto' }}>
      <h1 style={{ fontSize: '1.5rem', textAlign: 'center' }}>Share File</h1>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ width: '100%' }}
      />

      <Select
        value={shareType}
        onChange={(e) => setShareType(e.target.value)}
        fullWidth
        style={{ marginTop: '16px' }}
      >
        <MenuItem value="individually">Email</MenuItem>
        <MenuItem value="role-based">Role</MenuItem>
      </Select>

      {shareType !== 'role-based' && (
        <Autocomplete
          multiple
          options={emailSuggestions}
          loading={loadingEmails}
          value={emails} // Bind to the emails state to control input value
          onInputChange={(_, newInputValue) => {
            setInputValue(newInputValue); // Set the value for the input part of Autocomplete
            setSearchQuery(newInputValue);
            fetchEmailsOnSearch(newInputValue); // Fetch emails based on the user's input
          }}
          onChange={(event: any, value: string[]) => setEmails(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Enter Email"
              placeholder="Emails"
              style={{ marginTop: '16px' }}
              value={inputValue} // Bind the input field to the inputValue state
            />
          )}
        />
      )}

      {shareType === 'role-based' && (
        <Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
          style={{ marginTop: '16px' }}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleShare}
        style={{ marginTop: '16px', width: '100%' }}
      >
        Share File
      </Button>
    </Paper>
  );
};

export default ShareFile;
