
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import './App.css'
import Signin from './pages/Signin.tsx'
import Signup from './pages/Signup.tsx'
import Temp from './pages/Temp.tsx'
import AdminPage from './pages/AdminPage.tsx'


function App() {

  return (
    <>

     <BrowserRouter>
         <Routes>
           <Route path='/signin' element={<Signin/>}/>
           <Route path='/' element={<Signup/>}/>
           <Route path='/todo' element={<Temp/>}/>
           <Route path='/adminPage' element={<AdminPage/>}/>
         </Routes>
      </BrowserRouter>
       
    </>
  )
}

export default App
