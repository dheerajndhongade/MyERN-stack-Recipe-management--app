// components/UserRecipes.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, List, message } from "antd";
import { fetchWithAuth } from "../api"; // Assume fetchWithAuth is a utility function for API calls with authentication

const UserRecipes = () => {
  const { userId } = useParams();
  const [recipes, setRecipes] = useState([]);

  // Fetch recipes by the selected user
  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const response = await fetchWithAuth(
          `http://localhost:5000/users/${userId}/recipes`
        );
        if (!response.ok) throw new Error("Failed to fetch user recipes");
        const data = await response.json();
        console.log(data);
        setRecipes(data);
      } catch (error) {
        message.error(error.message);
      }
    };

    fetchUserRecipes();
  }, [userId]);

  return (
    <div>
      <h2>User's Recipes</h2>
      <List
        grid={{ gutter: 16, column: 3 }} // Adjust column to make cards bigger
        dataSource={recipes}
        renderItem={(recipe) => (
          <List.Item>
            <Card
              hoverable
              cover={
                <img
                  alt={recipe.title}
                  src={recipe.imageUrl} // Assuming 'image' contains the URL of the recipe image
                  style={{ height: 150, objectFit: "cover" }} // Set image size and fit
                />
              }
              title={recipe.title}
            >
              <p>
                <strong>Description:</strong> {recipe.description}
              </p>
              <p>
                <strong>Cooking Time:</strong> {recipe.cookingTime} mins
              </p>
              <p>
                <strong>Servings:</strong> {recipe.servings}
              </p>
              {/* Add more details as needed */}
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default UserRecipes;
