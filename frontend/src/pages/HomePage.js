import React from 'react';
import { useEffect, useState } from "react";
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import SignIn from '../components/signIn';
import SignUp from '../components/signUp';
import { useNavigate } from 'react-router-dom';
import NAVBAR from "../components/navbar"

const HomePage = () => {

  const [value, setValue] = useState('1');
  const navigate = useNavigate();
  
   useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    const { user, token } = userInfo ? JSON.parse(userInfo) : { user: null, token: null };
    
    if (user && token) {
      navigate('/todo');
    }
  }, [navigate]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
    <NAVBAR />
    <div display="flex" align= "center">
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 480, typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="sign in and sign up tabs" centered>
              <Tab label="Sign Up" value="1" />
              <Tab label="Sign In" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
          <SignUp />
          </TabPanel>
          <TabPanel value="2">
          <SignIn />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
    </div>
    </>
  );
}

export default HomePage;
