import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureAppStore } from './redux/store';
import MainRoutes from './routes/main.route';
import adminRoute from './routes/admin.route';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { store, persistor } = configureAppStore();

  return (
    <Provider store={store}>
      <Routes>
        {React.Children.map(adminRoute, (route, index) => (
          React.cloneElement(route, { key: `admin-route-${index}` })
        ))}
        <Route key="main-routes" path="/*" element={<MainRoutes />} />
      </Routes>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Provider>
  );
}

export default App;
