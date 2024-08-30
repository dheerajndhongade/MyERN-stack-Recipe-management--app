// components/ProfilePage.js
import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { fetchWithAuth } from "../api"; // Utility function for authenticated API calls

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetchWithAuth(
          "http://localhost:5000/users/profile"
        );
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setUser(data);
        form.setFieldsValue(data); // Populate form with user data
      } catch (error) {
        message.error(error.message);
      }
    };

    fetchUserProfile();
  }, [form]);

  // Handle profile update
  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(
        "http://localhost:5000/users/profile",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");
      const updatedUser = await response.json();
      setUser(updatedUser.user);
      message.success("Profile updated successfully");
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // Show nothing while loading

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "20px" }}>
      <h2>Profile</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdateProfile}
        initialValues={user}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfilePage;
