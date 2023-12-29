import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom'
import Login from './pages/login'
import Dashboard from './pages/dashboard'


import { useSelector } from 'react-redux'
import Sepet from './pages/sepet';

const PrivateRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth)

  return <>{isAuth ? <Outlet /> : <Navigate to='/login' />}</>
}

const RestrictedRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth)

  return <>{!isAuth ? <Outlet /> : <Navigate to='/dashboard' />}</>
}

function App() {
  return (
    <BrowserRouter>
    <Routes>
     

      <Route element={<PrivateRoutes />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/sepetim' element={<Sepet />} />
      </Route>

      <Route element={<RestrictedRoutes />}>
        
        <Route path='/login' element={<Login />} />
      </Route>
    </Routes>
  </BrowserRouter>  );
}

export default App;
