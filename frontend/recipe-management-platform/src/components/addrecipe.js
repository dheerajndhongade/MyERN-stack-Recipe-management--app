import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api";
import "./addrecipe.css";

const { TextArea } = Input;

const AddRecipe = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(
        "http://localhost:5000/recipes/addrecipe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            ingredients: values.ingredients
              .split("\n")
              .map((ingredient) => ingredient.trim()), // Example to split ingredients by new lines
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create recipe");
      }

      message.success("Recipe created successfully!");
      navigate("/recipespage"); // Redirect to the recipes list page
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-recipe-container">
      <h2>Add Recipe</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="add-recipe-form"
      >
        <Form.Item
          name="name"
          label="Recipe Name"
          rules={[{ required: true, message: "Please enter the recipe name" }]}
        >
          <Input placeholder="Enter recipe name" />
        </Form.Item>

        <Form.Item
          name="ingredients"
          label="Ingredients"
          rules={[{ required: true, message: "Please enter the ingredients" }]}
        >
          <TextArea rows={4} placeholder="List the ingredients" />
        </Form.Item>

        <Form.Item
          name="instructions"
          label="Instructions"
          rules={[{ required: true, message: "Please enter the instructions" }]}
        >
          <TextArea rows={6} placeholder="Enter cooking instructions" />
        </Form.Item>

        <Form.Item
          name="cookingTime"
          label="Cooking Time"
          rules={[{ required: true, message: "Please enter the cooking time" }]}
        >
          <Input placeholder="e.g., 30 minutes" />
        </Form.Item>

        <Form.Item
          name="servings"
          label="Servings"
          rules={[
            { required: true, message: "Please enter the number of servings" },
          ]}
        >
          <Input placeholder="e.g., 4 servings" />
        </Form.Item>

        <Form.Item
          name="imageUrl"
          label="Image URL"
          rules={[{ required: true, message: "Please provide an image URL" }]}
        >
          <Input placeholder="Enter image URL" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Recipe
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddRecipe;
