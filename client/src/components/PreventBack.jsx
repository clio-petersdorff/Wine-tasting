import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PreventBack = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Replace the current history state to prevent back navigation
    navigate(location.pathname, { replace: true });

    const blockBackNavigation = () => {
      window.history.pushState(null, "", window.location.pathname);
    };

    // Add a dummy history entry and listen for back navigation
    blockBackNavigation();
    window.addEventListener("popstate", blockBackNavigation);

    return () => {
      window.removeEventListener("popstate", blockBackNavigation);
    };
  }, [navigate, location]);

  return null; // No visual output
};

export default PreventBack;
