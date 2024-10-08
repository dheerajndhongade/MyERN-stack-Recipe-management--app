import React, { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Spin,
  message,
  Modal,
  Button,
  Input,
  Rate,
  List,
  Form,
} from "antd";
import Navbar from "./navbar";
import { fetchWithAuth } from "../api";

const { Content } = Layout;
const { Meta } = Card;
const { TextArea } = Input;

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetchWithAuth("http://localhost:5000/recipes");
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const data = await response.json();
        setRecipes(data);
        setFilteredRecipes(data);
      } catch (error) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const results = recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecipes(results);
  }, [searchQuery, recipes]);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleFilter = (filters) => {
    const { cookingTime, servings } = filters;

    const filtered = recipes.filter((recipe) => {
      let matchesCookingTime = true;
      let matchesServings = true;

      if (cookingTime) {
        matchesCookingTime = recipe.cookingTime <= parseInt(cookingTime, 10);
      }

      if (servings) {
        matchesServings = recipe.servings === parseInt(servings, 10);
      }

      return matchesCookingTime && matchesServings;
    });

    setFilteredRecipes(filtered);
  };

  const fetchReviews = async (recipeId) => {
    try {
      const response = await fetchWithAuth(
        `http://localhost:5000/recipes/${recipeId}/reviews`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    // Fetch follow status when component mounts or selectedRecipe changes
    const fetchFollowStatus = async () => {
      try {
        const response = await fetchWithAuth(
          `http://localhost:5000/users/${selectedRecipe.userId}/follow-status`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch follow status");
        }
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      } catch (error) {
        message.error(error.message);
      }
    };

    if (selectedRecipe) {
      fetchFollowStatus();
    }
  }, [selectedRecipe]);

  const handleFollow = async () => {
    console.log(selectedRecipe);
    try {
      const response = await fetchWithAuth(
        `http://localhost:5000/users/${selectedRecipe.userId}/follow`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to follow the user");
      }
      message.success("You are now following this user!");
      setIsFollowing(true);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetchWithAuth(
        `http://localhost:5000/users/${selectedRecipe.userId}/unfollow`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to unfollow the user");
      }
      message.success("You have unfollowed this user.");
      setIsFollowing(false);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleAddToCollection = async (collectionType) => {
    if (selectedRecipe) {
      try {
        const response = await fetchWithAuth(
          `http://localhost:5000/collections/${collectionType}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipeId: selectedRecipe.id }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to add to ${collectionType} Collection`);
        }

        message.success(`Recipe added to ${collectionType} Collection`);
        setIsModalVisible(false);
      } catch (error) {
        message.error(error.message);
      }
    } else {
      message.error("No recipe selected.");
    }
  };

  const handleCardClick = (recipe) => {
    if (recipe) {
      setSelectedRecipe(recipe);
      setIsModalVisible(true);
      fetchReviews(recipe.id); // Fetch reviews when expanding the card
    } else {
      message.error("Recipe data is not available.");
    }
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmitReview = async () => {
    if (!rating || !review) {
      message.error("Please provide both a rating and a review");
      return;
    }

    try {
      const response = await fetchWithAuth(
        `http://localhost:5000/recipes/${selectedRecipe.id}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating, review }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      message.success("Review submitted successfully");
      setRating(0);
      setReview("");
      fetchReviews(selectedRecipe.id);
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar onSearch={handleSearch} onFilter={handleFilter} />
      <Content style={{ padding: "20px" }}>
        <div className="site-layout-content" style={{ maxWidth: "100%" }}>
          <h2>All Recipes</h2>
          {loading ? (
            <Spin size="large" />
          ) : (
            <Row gutter={[16, 16]} justify="start">
              {filteredRecipes.map((recipe) => (
                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  key={recipe.id}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={recipe.name}
                        src={recipe.imageUrl}
                        style={{ height: 180, objectFit: "cover" }}
                      />
                    }
                    onClick={() => handleCardClick(recipe)}
                    style={{ width: "100%", maxWidth: 300 }}
                    bodyStyle={{ padding: "10px" }}
                  >
                    <Meta
                      title={recipe.name}
                      description={`Servings: ${recipe.servings}`}
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Content>

      {selectedRecipe && (
        <Modal
          title={selectedRecipe.name}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button
              key="veg"
              type="primary"
              onClick={() => handleAddToCollection("veg")}
            >
              Add to Veg Collection
            </Button>,
            <Button
              key="non-veg"
              type="primary"
              onClick={() => handleAddToCollection("nonveg")}
            >
              Add to Non-Veg Collection
            </Button>,
          ]}
        >
          <img
            src={selectedRecipe.imageUrl}
            alt={selectedRecipe.name}
            style={{ width: "100%", height: 200, objectFit: "cover" }}
          />
          <p>Ingredients: {selectedRecipe.ingredients}</p>
          <p>Cooking Time: {selectedRecipe.cookingTime} mins</p>
          <p>Servings: {selectedRecipe.servings}</p>
          <p>Description: {selectedRecipe.description}</p>

          <Button
            type="primary"
            onClick={isFollowing ? handleUnfollow : handleFollow}
            style={{ marginBottom: "10px" }}
          >
            {isFollowing ? "Unfollow User" : "Follow User"}
          </Button>

          <Form onFinish={handleSubmitReview}>
            <Form.Item label="Rate this recipe">
              <Rate onChange={handleRatingChange} value={rating} />
            </Form.Item>
            <Form.Item label="Leave a review">
              <TextArea rows={4} onChange={handleReviewChange} value={review} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit Review
              </Button>
            </Form.Item>
          </Form>

          <List
            itemLayout="horizontal"
            dataSource={reviews}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.user.name}
                  description={`Rating: ${item.rating} - ${item.review}`}
                />
              </List.Item>
            )}
          />
        </Modal>
      )}
    </Layout>
  );
};

export default RecipesPage;
