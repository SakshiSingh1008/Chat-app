import './App.css';
import Dashboard from './modules/Dashboard';
import Form from './modules/form';
import { Routes, Route, Navigate ,useLocation} from 'react-router-dom';

const ProtectedRoute = ({ children, auth = false }) => {
  const isLoggedIn = localStorage.getItem("user:token") !== null;
  const location = useLocation(); // Get current location for redirecting

  console.log("isLoggedIn:", isLoggedIn);
  console.log("auth required for this route:", auth);
  console.log("current path:", location.pathname);

  if (!isLoggedIn && auth) {
    console.log("Redirecting to sign-in");
    return <Navigate to='/users/sign-in' state={{ from: location }} />;
  }

  if (isLoggedIn && ['/users/sign-in', '/users/sign-up'].includes(location.pathname)) {
    console.log("Redirecting to dashboard");
    return <Navigate to='/' />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <ProtectedRoute auth={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/users/sign-in'
        element={
          <ProtectedRoute>
            <Form isSignInPage={true} />
          </ProtectedRoute>
        }
      />
      <Route
        path='/users/sign-up'
        element={
          <ProtectedRoute>
            <Form isSignInPage={false} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
