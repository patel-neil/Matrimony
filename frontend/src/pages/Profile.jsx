import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import Layout from "../Components/Layout";

const ProfilePage = () => {
  // ... existing code ...

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-10 px-4">
        // ... rest of the existing JSX ...
      </div>
    </Layout>
  );
};

export default ProfilePage; 