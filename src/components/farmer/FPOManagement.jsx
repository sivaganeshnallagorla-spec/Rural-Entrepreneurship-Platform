import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const FPOManagement = () => {
  const [fpoName, setFpoName] = useState('');
  const [members, setMembers] = useState([]);
  const [inventory, setInventory] = useState([]);

  const addMember = (member) => {
    setMembers((prevMembers) => [...prevMembers, member]);
  };

  const addInventoryItem = (item) => {
    setInventory((prevInventory) => [...prevInventory, item]);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Farmer Producer Organization (FPO) Management
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="FPO Name"
          value={fpoName}
          onChange={(e) => setFpoName(e.target.value)}
        />
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Members
        </Typography>
        <List>
          {members.map((member, index) => (
            <ListItem key={index} disablePadding>
              <ListItemText primary={member} />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" onClick={() => addMember(prompt('Enter member name:'))}>
          Add Member
        </Button>
      </Box>
      <Box>
        <Typography variant="h6" gutterBottom>
          Inventory
        </Typography>
        <List>
          {inventory.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" onClick={() => addInventoryItem(prompt('Enter inventory item:'))}>
          Add Inventory Item
        </Button>
      </Box>
    </Box>
  );
};

export default FPOManagement;