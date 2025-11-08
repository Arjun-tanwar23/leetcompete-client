import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { serverURL } from "../App";

function Auth0Callback() {
  const { isLoading, error, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const { setUserData } = useUser();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const handleAuth0Callback = async () => {
      if (isLoading || processing) return;

      if (error) {
        console.error("Auth0 callback error:", error);
        toast.error("Authentication failed. Please try again.");
        navigate("/login");
        return;
      }

      if (isAuthenticated && user) {
        setProcessing(true);
        
        try {
          // Get Auth0 access token (optional, can work without it too)
          let token = null;
          try {
            token = await getAccessTokenSilently();
          } catch (tokenError) {
            console.log("Could not get access token, proceeding without it");
          }
          
          // Determine if this was a signup or login attempt
          const signupIntent = localStorage.getItem('auth0_signup_intent');
          const isSignupFlow = signupIntent === 'true';
          
          // Clean up the signup intent
          localStorage.removeItem('auth0_signup_intent');
          
          console.log(`🔄 Auth0 ${isSignupFlow ? 'SIGNUP' : 'LOGIN'} flow detected for:`, {
            email: user.email,
            name: user.name,
            auth0Id: user.sub
          });
          
          // Send user data to your backend for registration/login
          const response = await axios.post(
            `${serverURL}/auth/auth0-callback`,
            {
              auth0Id: user.sub,
              email: user.email,
              name: user.name,
              picture: user.picture,
              emailVerified: user.email_verified,
              isSignupFlow: isSignupFlow, // Let backend know if this was signup attempt
              provider: 'google-oauth2'
            },
            {
              headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );

          // Set user data in your context (same as regular login/signup)
          setUserData(response.data.user || response.data);
          
          // Show success message based on whether it was signup or login
          if (response.data.isNewUser) {
            toast.success(`Welcome to LeetCompete, ${response.data.user?.name || response.data.name}! Account created successfully.`);
            console.log("✅ New user registered in database:", response.data.user);
          } else {
            toast.success(`Welcome back, ${response.data.user?.name || response.data.name}!`);
            console.log("✅ Existing user logged in:", response.data.user);
          }
          
          // Navigate to home (same as regular flow)
          navigate("/");
          
        } catch (error) {
          console.error("Auth0 callback sync error:", error);
          
          if (error.response?.status === 403) {
            toast.error("Please complete signup first before logging in.");
            navigate("/signup");
          } else if (error.response?.status === 409) {
            toast.error("An account with this email already exists. Please try logging in.");
            navigate("/login");
          } else {
            toast.error(`Authentication failed: ${error.response?.data?.message || error.message}`);
            navigate("/login");
          }
        } finally {
          setProcessing(false);
        }
      }
    };

    handleAuth0Callback();
  }, [isLoading, error, isAuthenticated, user, getAccessTokenSilently, setUserData, navigate, processing]);

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-400 mb-4">Authentication Error</h2>
          <p className="text-zinc-300 mb-6">{error.message}</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <div className="text-center">
        <ClipLoader size={50} color="#ffffff" />
        <h2 className="text-xl font-bold text-white mt-6 mb-2">
          {processing ? "Setting up your account..." : "Completing authentication..."}
        </h2>
        <p className="text-zinc-300">
          {processing ? "Syncing your data with our servers..." : "Please wait while we verify your login..."}
        </p>
      </div>
    </div>
  );
}

export default Auth0Callback;