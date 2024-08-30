import React from "react";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import { Layout } from "antd";
import Navbar from "./components/navbar";
import Signup from "./components/signup";
import Login from "./components/login";
import RecipesPage from "./components/recipespage";
import AddRecipe from "./components/addrecipe";
import MyRecipesPage from "./components/myrecipespage";
import FavoritesPage from "./components/favouritespage";
import UserRecipe from "./components/userrecipe";
import AdminPage from "./components/adminpage";
import ProfilePage from "./components/profilepage";

const { Header, Content } = Layout;

function App() {
  const location = useLocation();
  const noNavbarPaths = ["/login", "/signup"]; // Paths where the navbar should not be shown

  return (
    <Layout className="app-layout">
      {!noNavbarPaths.includes(location.pathname) && ( // Conditionally render Navbar
        <Header
          style={{ padding: 0, position: "fixed", width: "100%", zIndex: 1 }}
        >
          <Navbar />
        </Header>
      )}
      <Content style={{ padding: "100px 50px", marginTop: 64 }}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/addrecipe" element={<AddRecipe />} />
          <Route path="/recipes/myrecipes" element={<MyRecipesPage />} />
          <Route path="/recipes/favourites" element={<FavoritesPage />} />
          <Route path="/users/:userId/recipes" element={<UserRecipe />} />
          <Route path="/admin-settings" element={<AdminPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;
