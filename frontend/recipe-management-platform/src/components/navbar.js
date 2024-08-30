import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Input,
  Button,
  Modal,
  Form,
  Select,
  Dropdown,
  Avatar,
  message,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api"; // Utility function for API calls with authentication
import "./navbar.css";

const { Header } = Layout;
const { Option } = Select;

const Navbar = ({ onSearch, onFilter }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRecipesPage = location.pathname === "/recipes";
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [followingUsers, setFollowingUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Fetch the list of users the current user is following
    const fetchFollowingUsers = async () => {
      try {
        const response = await fetchWithAuth(
          `http://localhost:5000/users/following`
        );
        if (!response.ok) throw new Error("Failed to fetch following users");
        const data = await response.json();
        setFollowingUsers(data);
      } catch (error) {
        message.error(error.message);
      }
    };

    // Fetch admin status
    const fetchAdminStatus = async () => {
      try {
        const response = await fetchWithAuth(
          `http://localhost:5000/users/admin-status`
        );
        if (!response.ok) throw new Error("Failed to fetch user status");
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        message.error(error.message);
      }
    };

    fetchFollowingUsers();
    fetchAdminStatus();
  }, []);

  const showFilterModal = () => {
    setIsFilterModalVisible(true);
  };

  const handleFilterSubmit = (values) => {
    onFilter(values); // Pass filter values back to RecipesPage
    setIsFilterModalVisible(false);
  };

  // Handle clicking on a user to view their recipes
  const handleUserClick = (userId) => {
    navigate(`/users/${userId}/recipes`);
  };

  // Dropdown menu for the following users
  const followingMenu = (
    <Menu>
      {followingUsers.map((user) => (
        <Menu.Item key={user.id} onClick={() => handleUserClick(user.id)}>
          <Avatar icon={<UserOutlined />} /> {user.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  // Dropdown menu for profile and admin settings
  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      {isAdmin && (
        <Menu.Item key="admin-settings">
          <Link to="/admin-settings">Admin Settings</Link>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Header>
      <Menu mode="horizontal" defaultSelectedKeys={["/recipes"]}>
        <Menu.Item key="/recipes">
          <Link to="/recipes">Recipes</Link>
        </Menu.Item>
        <Menu.Item key="/recipes/add">
          <Link to="/recipes/addrecipe">Add Recipe</Link>
        </Menu.Item>
        <Menu.Item key="/recipes/my">
          <Link to="/recipes/myrecipes">My Recipes</Link>
        </Menu.Item>
        <Menu.Item key="/recipes/favourites">
          <Link to="/recipes/favourites">Favourites</Link>
        </Menu.Item>

        <Menu.Item key="/user/following">
          <Dropdown overlay={followingMenu} placement="bottomRight">
            <Button>
              Following <UserOutlined />
            </Button>
          </Dropdown>
        </Menu.Item>

        {isRecipesPage && (
          <Menu.Item key="search" style={{ marginLeft: "auto" }}>
            <Input
              placeholder="Search recipes"
              style={{ width: 200, marginRight: 10 }}
              suffix={<SearchOutlined />}
              onChange={(e) => onSearch(e.target.value)}
            />
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={showFilterModal}
            />
          </Menu.Item>
        )}

        <Menu.Item key="user-menu" style={{ marginLeft: "auto" }}>
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Button icon={<UserOutlined />} />
          </Dropdown>
        </Menu.Item>
      </Menu>

      <Modal
        title="Filter Recipes"
        visible={isFilterModalVisible}
        onCancel={() => setIsFilterModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleFilterSubmit}>
          <Form.Item name="cookingTime" label="Preparation Time (mins)">
            <Select placeholder="Select preparation time">
              <Option value="2">Up to 2 mins</Option>
              <Option value="8">Up to 8 mins</Option>
              <Option value="15">Up to 15 mins</Option>
            </Select>
          </Form.Item>
          <Form.Item name="servings" label="Servings">
            <Select placeholder="Select servings">
              <Option value="1">1 Serving</Option>
              <Option value="2">2 Servings</Option>
              <Option value="4">4 Servings</Option>
              <Option value="6">6 Servings</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Header>
  );
};

export default Navbar;
