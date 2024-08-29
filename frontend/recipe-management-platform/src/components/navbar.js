import React, { useState } from "react";
import { Layout, Menu, Input, Button, Modal, Form, Select } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";

const { Header } = Layout;
const { Option } = Select;

const Navbar = ({ onSearch, onFilter }) => {
  const location = useLocation();
  const isRecipesPage = location.pathname === "/recipes";
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showFilterModal = () => {
    setIsFilterModalVisible(true);
  };

  const handleFilterSubmit = (values) => {
    onFilter(values); // Pass filter values back to RecipesPage
    setIsFilterModalVisible(false);
  };

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
