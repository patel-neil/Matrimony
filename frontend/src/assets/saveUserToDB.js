import { useUser } from "@clerk/clerk-react";

const saveUserToDB = async () => {
  const { user } = useUser();

  if (!user) return;

  const userData = {
    id: user.id,
    username: user.username,
    email: user.primaryEmailAddress?.emailAddress,
    phoneNumber: user.primaryPhoneNumber?.phoneNumber,
    password: "dummy_password", // Not used, just a placeholder
    createdAt: user.createdAt,
  };

  try {
    const response = await fetch("http://localhost:5000/api/save-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log("User saved:", data);
  } catch (error) {
    console.error("Error saving user:", error);
  }
};
