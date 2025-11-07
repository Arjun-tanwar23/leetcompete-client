import { Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import PageLoader from "./components/PageLoader";
import { BattleProvider } from "./context/BattleContext";
import ProtectedRoute from "./hooks/ProtectedRoutes.jsx";

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
export const serverURL = import.meta.env.VITE_SERVER_URL;

function App() {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <BattleProvider>
      {isNavigating && <PageLoader />}
      <ToastContainer pauseOnHover={false} theme="dark" />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
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
  );
}

export default App;
