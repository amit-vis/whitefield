import './App.css';
import { AdminForm } from './components/adminform/adminform';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminSignin } from './components/adminsignin/adminloginform';
import { Provider } from "react-redux";
import { store } from './redux/store';
import { Dashboard } from './components/dashboard/dashboard';
import { CreateEmployee } from './components/employeesection/createemployee';
import { EmployeeTable } from './components/employeesection/employeetable';
import { EditEmployee } from './components/employeesection/editemployee';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<AdminSignin />} />
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/admin-signup' element={<AdminForm />} />
            <Route path='/create-emp' element={<CreateEmployee/>}/>
            <Route path='/emp-table' element={<EmployeeTable/>}/>
            <Route path='/edit-emp/:id' element={<EditEmployee/>} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
