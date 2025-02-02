import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Chat from './pages/Chat';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Landing/>} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<SignIn />} />
       
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
