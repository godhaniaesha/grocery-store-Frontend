import { Route, Routes } from "react-router-dom";
import AdminRoute from "./routes/admin.route.js"
import UserRoutes from "./routes/user.route.js";
import { configureAppStore } from "./redux/store.js";
import { Provider } from "react-redux";

function App() {
  const { store, persistor } = configureAppStore();

  return (
    <>
      <Provider store={store}>
        {/* User Routes */}
        <Routes>
          {UserRoutes}  
        </Routes>  

        {/* Admin Routes */}
        <Routes>
          {AdminRoute}
        </Routes>
      </Provider>
    </>
  );
}

export default App;
