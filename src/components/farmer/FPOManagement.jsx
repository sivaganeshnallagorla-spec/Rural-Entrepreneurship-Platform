import React, { useState } from 'react';

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
    <div>
      <h3>Farmer Producer Organization (FPO) Management</h3>
      <div>
        <label>
          FPO Name:
          <input
            type="text"
            value={fpoName}
            onChange={(e) => setFpoName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <h4>Members</h4>
        <ul>
          {members.map((member, index) => (
            <li key={index}>{member}</li>
          ))}
        </ul>
        <button onClick={() => addMember(prompt('Enter member name:'))}>
          Add Member
        </button>
      </div>
      <div>
        <h4>Inventory</h4>
        <ul>
          {inventory.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <button onClick={() => addInventoryItem(prompt('Enter inventory item:'))}>
          Add Inventory Item
        </button>
      </div>
    </div>
  );
};

export default FPOManagement;