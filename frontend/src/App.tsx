
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Signin from './pages/Signin.tsx'
import Signup from './pages/Signup.tsx'
import Temp from './pages/Temp.tsx'
import AdminPage from './pages/AdminPage.tsx'
import UpdateTask from './pages/UpdateTask.tsx'
import Navigation from './pages/Navigation.tsx'
import { Stack } from '@fluentui/react'
import { useEffect, useState } from 'react'
import ChatBot from './pages/ChatBot.tsx'
import { useForceUpdate } from '@fluentui/react-hooks'


function App() {

     const [flag,setFlag] = useState<boolean>(false)
  const update = useForceUpdate();
  useEffect(()=>{
     const onResize = ()=> update();
  
     window.addEventListener('resize',onResize);
     return ()=> window.removeEventListener('resize',onResize);
  
  },[update])
  
  return (
    <>
      <Stack horizontal>
        <BrowserRouter>

            {flag && <Navigation />}
          <Routes>
            <Route path='/signin' element={<Signin />} />
            <Route path='/' element={<Signup />} />
            <Route path='/todo' element={<Temp setFlag={setFlag}/>} />
            <Route path='/adminPage' element={<AdminPage setFlag={setFlag}/>} />
            <Route path='/updateTask' element={<UpdateTask />} />
            <Route path='/chatbot' element={<ChatBot />} />
          </Routes>

        </BrowserRouter>
      </Stack>
    </>
  )
}

export default App
