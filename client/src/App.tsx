import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import TrainerRoutes from './routes/TrainerRoutes';
import SocketInitializer from './components/socket/SocketInitializer';


function App() {
  return (
    <>
      <BrowserRouter>
        <SocketInitializer>
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/trainer/*" element={<TrainerRoutes/>} /> 
        </Routes>
        </SocketInitializer>
      </BrowserRouter>
    </>
  );
}

export default App;