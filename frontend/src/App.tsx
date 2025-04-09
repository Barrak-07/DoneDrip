import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 🔐 Route guards
import PrivateRoute from './HOC/PrivateRoute';
import PublicRoute from './HOC/PublicRoute';

// 🧠 Contexts
import AuthProvider from './context/auth/AuthProvider';
import TodoProvider from './context/todo/TodoProvider';

// 🌐 Pages
import Landing from './components/common/Landing';
import Login from './components/User/Login';
import Signup from './components/User/Signup';
import TodoLayout from './components/Todo/TodoLayout';
import Page404 from './components/Page404';

function App() {
  return (
    <AuthProvider>
      <TodoProvider>
        <Router>
          <Routes>
            {/* 🌟 Public Landing Page */}
            <Route path="/" element={<Landing />} />

            {/* 🔓 Public Auth Routes */}
            <Route element={<PublicRoute />}>
              <Route path="/user/signin" element={<Login />} />
              <Route path="/user/signup" element={<Signup />} />
            </Route>

            {/* 🔐 Protected Todo Dashboard */}
            <Route element={<PrivateRoute />}>
              <Route path="/todos" element={<TodoLayout />} />
            </Route>

            {/* ❌ Catch-all */}
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Router>
      </TodoProvider>
    </AuthProvider>
  );
}

export default App;
