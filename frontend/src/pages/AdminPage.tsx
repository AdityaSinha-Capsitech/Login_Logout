import { DefaultButton, mergeStyles, Stack } from '@fluentui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom';




const buttonClass = mergeStyles({
  display: 'flex',
  width:'20%', 
  // alignItems: 'flex-start',
  justifyContent: 'center',
  placeItems:'center'

});

const AdminPage = () => {
  const navigate = useNavigate();

      const handleLogout = ()=>{
    localStorage.removeItem('token');
    navigate(`/signin`);
  }

    return (
        <Stack>     
            <h1>Welcome to Admin Page!</h1>
             <DefaultButton iconProps={{ iconName: 'signout' }} className={buttonClass} text="Logout" onClick={handleLogout} />
        </Stack>
    )
}

export default AdminPage