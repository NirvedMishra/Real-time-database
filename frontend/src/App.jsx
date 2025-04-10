import Homepage from './homepage'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './Dashboard';
import Registerpage from './register';
import {BrowserRouter,Route,Routes} from 'react-router-dom'
function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage></Homepage>}></Route>
        <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
        <Route path='/register' element={<Registerpage></Registerpage>}></Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
