import { useState } from 'react'
import { onLogin } from '../api/auth'
import Layout from '../components/layout'
import { useDispatch } from 'react-redux'
import { authenticateUser } from '../redux/slices/authSlice'

const Login = () => {
  const [values, setValues] = useState({
    kullaniciadi: '',
    sifre: '',
  })
  const [error, setError] = useState(false)

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const dispatch = useDispatch()
  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      await onLogin(values)
      dispatch(authenticateUser())

      localStorage.setItem('isAuth', 'true')
    } catch (error) {
      console.log(error.response.data.errors[0].msg)
      setError(error.response.data.errors[0].msg)
    }
  }

  return (
    <Layout>
      <form onSubmit={(e) => onSubmit(e)} className='container mt-3'>
        <h1>Login</h1>

        <div className='mb-3'>
          <label htmlFor='kullaniciadi' className='form-label'>
          kullaniciadi
          </label>
          <input
            onChange={(e) => onChange(e)}
            type='text'
            className='form-control'
            id='kullaniciadi'
            name='kullaniciadi'
            value={values.kullaniciadi}
            placeholder='kullanıcı adınız'
            required
          />
        </div>

        <div className='mb-3'>
          <label htmlFor='sifre' className='form-label'>
          sifre
          </label>
          <input
            onChange={(e) => onChange(e)}
            type='password'
            value={values.sifre}
            className='form-control'
            id='sifre'
            name='sifre'
            placeholder='sifre'
            required
          />
        </div>

        <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>

        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
    </Layout>
  )
}

export default Login