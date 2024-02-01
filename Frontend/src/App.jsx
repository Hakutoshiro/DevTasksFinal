import {Route,Routes} from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import Layout from './Layout'
import RegisterPage from './pages/RegisterPage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import AccountPage from './pages/AccountPage'
import 'dotenv/config'
axios.defaults.withCredentials=false
axios.defaults.baseURL='https://devtasks-backend2.onrender.com'


export default function App(){
  
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/account/:subpages?' element={<AccountPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}