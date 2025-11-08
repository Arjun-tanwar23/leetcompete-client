import { Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import PageLoader from "./components/PageLoader";
import { BattleProvider } from "./context/BattleContext";
import ProtectedRoute from "./hooks/ProtectedRoutes.jsx";
import { Auth0Provider } from "@auth0/auth0-react";

const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./components/profile/Profile"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const SelectProblemPage = lazy(() => import("./pages/SelectProblem"));
const ProblemScreen = lazy(() =>
  import("./components/problemPanel/ProblemScreen")
);
const JoinRoom = lazy(() => import("./pages/JoinRoom"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const History = lazy(() => import("./pages/History"));
const WaitingWindow = lazy(() => import("./pages/WaitingWindow.jsx"));
const NotFound = lazy(() => import("./pages/NotFound"));
const EditProfile = lazy(() => import("./components/profile/EditProfile.jsx"));
const Auth0Callback = lazy(() => import("./components/Auth0Callback"));
const LeaderBoard = lazy(() => import("./pages/LeaderBoard.jsx"));
export const serverURL = import.meta.env.VITE_SERVER_URL;

function App() {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  // Auth0 Configuration
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI;

  useEffect(() => {
    setIsNavigating(true);
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!domain || !clientId) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-bold mb-4">Configuration Error</h2>
          <p>Auth0 configuration is missing. Please check your .env file.</p>
        </div>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri || `${window.location.origin}/callback`,
        scope: "openid profile email",
      }}
    >
      <BattleProvider>
        {isNavigating && <PageLoader />}
        <ToastContainer pauseOnHover={false} theme="dark" />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/callback" element={<Auth0Callback />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            {/* protected routes */}
            <Route
              path="/battle"
              element={
                <ProtectedRoute>
                  <SelectProblemPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/join-room"
              element={
                <ProtectedRoute>
                  <JoinRoom />
                </ProtectedRoute>
              }
            />
            <Route
              path="/problem/:problemId"
              element={
                <ProtectedRoute>
                  <ProblemScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/waiting-window"
              element={
                <ProtectedRoute>
                  <WaitingWindow />
                </ProtectedRoute>
              }
            />
            <Route path="/leaderboard" element={<LeaderBoard />} />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BattleProvider>
    </Auth0Provider>
  );
}

export default App;
