import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchProtectedInfo, onLogout, fetchSepetCount } from '../api/auth'
import { unauthenticateUser } from '../redux/slices/authSlice'


const Navbar = () => {
  const { isAuth,userId } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [protectedData, setProtectedData] = useState(null)

  const logout = async () => {
    try {
      await onLogout()

      dispatch(unauthenticateUser())
      localStorage.removeItem('isAuth')
    } catch (error) {
      console.log(error.response)
    }
  }
  const protectedInfo = async () => {
    try {
      const { data } = await fetchProtectedInfo()

      setProtectedData(data.info)

      setLoading(false)
    } catch (error) {
      logout()
    }
  }

  
  return (
    <nav className='navbar navbar-light bg-light'>
      <div className='container'>
        <div>
         
        </div>

        {isAuth ? (
          <div>
            <NavLink to='/dashboard' className='mx-3'>
              <span>Ürünler</span>
            </NavLink>
            <NavLink to='/'>
            <span className='mx-3'>Siparişler</span>
          </NavLink>
          <NavLink to='/'>
            <span className='mx-3'>Cari</span>
          </NavLink>
          <NavLink to='/'>
            <span className='mx-3'>Bakiye Ödeme</span>
          </NavLink>
          <NavLink to='/sepetim'>
          <span className='mx-3'>Sepetim </span>
        </NavLink>
          <button onClick={() => logout()} className='btn btn-primary'>
          Çıkış Yap
        </button>
          </div>
        ) : (
          <div>
            <NavLink to='/login'>
              <span>Login</span>
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar