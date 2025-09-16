import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./components/ThemeProvider";
import { Toaster } from "sonner";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import CourseList from "./pages/CourseList";
import CourseDetail from "./pages/CourseDetail";
import CartPage from "./pages/CartPage";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <Router>
            <Toaster richColors position="bottom-right" />
            <Navbar />
            <Routes>
              <Route
                path="/signup"
                element={
                  <>
                    <Register />
                  </>
                }
              />
              <Route
                path="/login"
                element={
                  <>
                    <Login />
                  </>
                }
              />
              <Route
                path="/"
                element={
                  <>
                    <Home />
                  </>
                }
              />
              {/* Products */}
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} />

              {/* Courses */}
              <Route path="/courses" element={<CourseList />} />
              <Route path="/courses/:id" element={<CourseDetail />} />

              {/* Cart & Checkout */}
              <Route path="/cart" element={<CartPage />} />


            </Routes>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
