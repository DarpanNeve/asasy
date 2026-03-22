import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ProfileCompletion from "./pages/ProfileCompletion";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import Pricing from "./pages/Pricing";
import Home from "./pages/Home";
import RTTP from "./pages/RTTP";
import Admin from "./pages/Admin";
import Contact from "./pages/Contact";
import PressReleases from "./pages/PressReleases";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Terms from "./pages/Terms";
import PricingPolicy from "./pages/PricingPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import "./index.css";
import TokenPricingSection from "./components/TokenPricingSection";
import Header from "./components/Header";
import Footer from "./components/Footer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter(
  [
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/profile-completion", element: <ProfileCompletion /> },
    { path: "/rttp", element: <RTTP /> },
    { path: "/contact", element: <Contact /> },
    { path: "/about", element: <About /> },
    {
      path: "/pricing",
      element: (
        <div className="min-h-screen">
          <Header />
          <TokenPricingSection
            compact={false}
            showReportTypes={true}
            showHeader={true}
          />
          <Footer />
        </div>
      ),
    },
    { path: "/admin", element: <Admin /> },
    { path: "/careers", element: <Careers /> },
    { path: "/blog", element: <Blog /> },
    { path: "/blog/:slug", element: <BlogPost /> },
    { path: "/press-releases", element: <PressReleases /> },
    { path: "/press-releases/:slug", element: <BlogPost /> },
    { path: "/privacy", element: <Privacy /> },
    { path: "/terms", element: <Terms /> },
    { path: "/pricing-policy", element: <PricingPolicy /> },
    { path: "/refund-policy", element: <RefundPolicy /> },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/login-pricing",
      element: (
        <ProtectedRoute>
          <Layout>
            <Pricing />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/reports",
      element: (
        <ProtectedRoute>
          <Layout>
            <Reports />
          </Layout>
        </ProtectedRoute>
      ),
    },
  ],
  {
    future: {
      // opt-in to future flags
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppProvider>
            <div className="min-h-screen bg-neutral-50">
              <RouterProvider router={router} />
              <Toaster
                position="top-right"
                toastOptions={{
                  className: "bg-white shadow-lg border",
                  duration: 4000,
                }}
              />
            </div>
          </AppProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;