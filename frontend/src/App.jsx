import Homepage from './homepage'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './Dashboard';
import Registerpage from './register';
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import AuthProvider from './Auth/AuthProvider';
import LoginRoute from './Auth/LoginRoute';
import PrivateRoute from './Auth/PrivateRoute';
function App() {
  return (
    <>

      <BrowserRouter>
      <AuthProvider>
      <Routes>
        <Route path='/' element={<LoginRoute><Homepage></Homepage></LoginRoute>}></Route>
        <Route path='/dashboard' element={<PrivateRoute><Dashboard></Dashboard></PrivateRoute>}></Route>
        <Route path='/register' element={<LoginRoute><Registerpage></Registerpage></LoginRoute>}></Route>
      </Routes>
      </AuthProvider>
      </BrowserRouter>
      
    </>
  )
}

export default App
