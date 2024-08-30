// components/AdminPage.js
import React, { useState, useEffect } from "react";
import { Button, List, message, Modal, Avatar } from "antd";
import { fetchWithAuth } from "../api"; // Utility function for API calls with authentication

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Store selected recipe

  // Fetch users and recipes (admin view)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchWithAuth("http://localhost:5000/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        message.error(error.message);
      }
    };

    const fetchRecipes = async () => {
      try {
        const response = await fetchWithAuth("http://localhost:5000/recipes");
        if (!response.ok) throw new Error("Failed to fetch recipes");
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        message.error(error.message);
      }
    };

    fetchUsers();
    fetchRecipes();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await fetchWithAuth(`http://localhost:5000/admin/users/${userId}`, {
        method: "DELETE",
      });
      message.success("User deleted successfully");
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      message.error(error.message);
    }
  };

  const confirmDeleteRecipe = (recipe) => {
    setSelectedRecipe(recipe); // Set the selected recipe for confirmation
  };

  const handleDeleteRecipe = async () => {
    if (!selectedRecipe) return;
    try {
      await fetchWithAuth(
        `http://localhost:5000/admin/recipes/${selectedRecipe.id}`,
        {
          method: "DELETE",
        }
      );
      message.success("Recipe deleted successfully");
      setRecipes(recipes.filter((recipe) => recipe.id !== selectedRecipe.id));
      setSelectedRecipe(null); // Reset selected recipe
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div>
      <h2>Admin Actions</h2>
      <div>
        <h3>Manage Users</h3>
        <List
          bordered
          dataSource={users}
          renderItem={(user) => (
            <List.Item>
              {user.name}
              <Button
                onClick={() => handleDeleteUser(user.id)}
                type="danger"
                style={{ marginLeft: "auto" }}
              >
                Delete User
              </Button>
            </List.Item>
          )}
        />
      </div>
      <div>
        <h3>Manage Recipes</h3>
        <List
          bordered
          dataSource={recipes}
          renderItem={(recipe) => (
            <List.Item>
              <Avatar src={recipe.imageUrl} /> {/* Show recipe image */}
              {recipe.title}
              <Button
                onClick={() => confirmDeleteRecipe(recipe)} // Trigger confirmation modal
                type="danger"
                style={{ marginLeft: "auto" }}
              >
                Delete Recipe
              </Button>
            </List.Item>
          )}
        />
      </div>

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        visible={!!selectedRecipe} // Show modal if a recipe is selected
        onOk={handleDeleteRecipe} // Delete recipe on confirmation
        onCancel={() => setSelectedRecipe(null)} // Close modal without action
        okText="Delete"
        cancelText="Cancel"
      >
        {selectedRecipe && (
          <div>
            <p>
              Are you sure you want to delete the recipe{" "}
              <strong>{selectedRecipe.title}</strong>?
            </p>
            <img
              src={selectedRecipe.imageUrl}
              alt={selectedRecipe.title}
              style={{ width: "100%", height: "auto", borderRadius: 8 }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPage;
