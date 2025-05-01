import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureAppStore } from './redux/store'; // ✅ add this line
import MainRoutes from './routes/main.route';

function App() {
  const { store, persistor } = configureAppStore();

  return (
    <Provider store={store}>
    
        <MainRoutes />
     
    </Provider>
  );
}

export default App;
