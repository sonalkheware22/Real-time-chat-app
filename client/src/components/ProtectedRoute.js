import { useEffect } from "react";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login"); // Redirect to login if user is not logged in
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return children; // Render children if authenticated
}

export default ProtectedRoute;
