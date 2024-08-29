import React, { useEffect, useState } from "react";
import { Layout, Card, Row, Col, Spin, message } from "antd";
import Navbar from "./navbar";
// import "./favoritespage.css";
import { fetchWithAuth } from "../api";

const { Content } = Layout;

const FavoritesPage = () => {
  const [vegRecipes, setVegRecipes] = useState([]);
  const [nonVegRecipes, setNonVegRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        const vegResponse = await fetchWithAuth(
          "http://localhost:5000/collections/veg"
        );
        const nonVegResponse = await fetchWithAuth(
          "http://localhost:5000/collections/nonveg"
        );

        if (!vegResponse.ok || !nonVegResponse.ok) {
          throw new Error("Failed to fetch collections");
        }

        const vegData = await vegResponse.json();
        const nonVegData = await nonVegResponse.json();

        const extractedVegRecipes = vegData.map((item) => item.recipe);
        const extractedNonVegRecipes = nonVegData.map((item) => item.recipe);

        setVegRecipes(extractedVegRecipes);
        setNonVegRecipes(extractedNonVegRecipes);
      } catch (error) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <Layout>
      <Navbar />
      <Content>
        <div className="site-layout-content">
          <h2>Favorites</h2>
          {loading ? (
            <Spin size="large" />
          ) : (
            <>
              <h3>Veg Collection</h3>
              <Row gutter={16}>
                {vegRecipes.length > 0 ? (
                  vegRecipes.map((recipe) => (
                    <Col span={8} key={recipe.id}>
                      <Card
                        title={recipe.name}
                        bordered={false}
                        cover={<img alt={recipe.name} src={recipe.imageUrl} />}
                      >
                        <p>Ingredients: {recipe.ingredients}</p>
                        <p>Cooking Time: {recipe.cookingTime} mins</p>
                        <p>Servings: {recipe.servings}</p>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <p>No Veg Recipes in your favorites.</p>
                )}
              </Row>
              <h3>Non-Veg Collection</h3>
              <Row gutter={16}>
                {nonVegRecipes.length > 0 ? (
                  nonVegRecipes.map((recipe) => (
                    <Col span={8} key={recipe.id}>
                      <Card
                        title={recipe.name}
                        bordered={false}
                        cover={<img alt={recipe.name} src={recipe.imageUrl} />}
                      >
                        <p>Ingredients: {recipe.ingredients}</p>
                        <p>Cooking Time: {recipe.cookingTime} mins</p>
                        <p>Servings: {recipe.servings}</p>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <p>No Non-Veg Recipes in your favorites.</p>
                )}
              </Row>
            </>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default FavoritesPage;
