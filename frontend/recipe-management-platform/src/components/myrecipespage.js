import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  message,
  Popconfirm,
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api";

const MyRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const response = await fetchWithAuth(
          "http://localhost:5000/recipes/myrecipes"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, []);

  const handleEditClick = (recipe) => {
    setCurrentRecipe(recipe);
    form.setFieldsValue({
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      cookingTime: recipe.cookingTime,
      servings: recipe.servings,
      imageUrl: recipe.imageUrl,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetchWithAuth(
        `http://localhost:5000/recipes/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }
      message.success("Recipe deleted successfully!");
      setRecipes(recipes.filter((recipe) => recipe.id !== id));
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      const response = await fetchWithAuth(
        `http://localhost:5000/recipes/edit/${currentRecipe.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update recipe");
      }
      const updatedRecipe = await response.json();
      message.success("Recipe updated successfully!");
      setRecipes(
        recipes.map((recipe) =>
          recipe.id === updatedRecipe.recipe.id ? updatedRecipe.recipe : recipe
        )
      );
      setIsModalVisible(false);
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ingredients",
      dataIndex: "ingredients",
      key: "ingredients",
    },
    {
      title: "Instructions",
      dataIndex: "instructions",
      key: "instructions",
    },
    {
      title: "Cooking Time",
      dataIndex: "cookingTime",
      key: "cookingTime",
    },
    {
      title: "Servings",
      dataIndex: "servings",
      key: "servings",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <span>
          <Button onClick={() => handleEditClick(record)} type="link">
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this recipe?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2>My Recipes</h2>
      <Table
        columns={columns}
        dataSource={recipes}
        rowKey="id"
        loading={loading}
      />

      {/* Edit Recipe Modal */}
      <Modal
        title="Edit Recipe"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleEdit}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please input the recipe name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ingredients"
            label="Ingredients"
            rules={[
              { required: true, message: "Please input the ingredients!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="instructions"
            label="Instructions"
            rules={[
              { required: true, message: "Please input the instructions!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="cookingTime"
            label="Cooking Time"
            rules={[
              { required: true, message: "Please input the cooking time!" },
            ]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name="servings"
            label="Servings"
            rules={[
              {
                required: true,
                message: "Please input the number of servings!",
              },
            ]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="imageUrl" label="Image URL">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyRecipesPage;
