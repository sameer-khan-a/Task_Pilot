import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import BoardPage from './components/BoardPage';
import BoardSelector from './components/BoardSelector';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Routes>
        {/* Public route: Login page */}
        <Route path='/Login' element={<Login />} />

        {/* Public route: Registration page */}
        <Route path='/Register' element={<Register />} />

        {/* Protected route: BoardSelector page (home/dashboard) */}
        {/* Only accessible if user is authenticated (token exists) */}
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <BoardSelector />
            </ProtectedRoute>
          }
        />

        {/* Protected route: Specific Board page by ID */}
        {/* User must be authenticated */}
        <Route
          path='/boards/:boardId'
          element={
            <ProtectedRoute>
              <BoardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
