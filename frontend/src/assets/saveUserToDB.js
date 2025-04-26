import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

const useSaveUserToDB = () => {
  const { user } = useUser();

  useEffect(() => {
    const saveUserToDB = async () => {
      if (!user) return;

      const userData = {
        clerkId: user.id,
        username: user.username,
        email: user.primaryEmailAddress?.emailAddress,
        phoneNumber: user.primaryPhoneNumber?.phoneNumber,
        createdAt: user.createdAt,
      };

      try {
        const response = await fetch("http://localhost:5000/api/users/save-user", {
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

    saveUserToDB();
  }, [user]);
};

export default useSaveUserToDB;
