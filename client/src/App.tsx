import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import TrainerRoutes from './routes/TrainerRoutes';
import SocketInitializer from './components/socket/SocketInitializer';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';


function App() {
  return (
    <>
      <BrowserRouter>
        <SocketInitializer>
          <Routes>
            <Route path="/*" element={<UserRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/trainer/*" element={<TrainerRoutes/>} /> 
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </SocketInitializer>
      </BrowserRouter>
    </>
  );
}

export default App;