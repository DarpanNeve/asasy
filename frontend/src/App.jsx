import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppProvider>
            <Router>
              <div className="min-h-screen bg-neutral-50">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route
                    path="/profile-completion"
                    element={<ProfileCompletion />}
                  />
                  <Route path="/rttp" element={<RTTP />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route
                    path="/pricing"
                    element={
                      <div className="min-h-screen">
                        <Header />
                        <TokenPricingSection
                          compact={false}
                          showReportTypes={true}
                          showHeader={true}
                        />
                        <Footer />
                      </div>
                    }
                  />
                  <Route path="/admin" element={<Admin />} />

                  {/* Legal pages */}
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/press-releases" element={<PressReleases />} />
                  <Route path="/press-releases/:slug" element={<BlogPost />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/pricing-policy" element={<PricingPolicy />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />

                  {/* Protected routes */}

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Profile />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/login-pricing"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Pricing />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Reports />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>

                <Toaster
                  position="top-right"
                  toastOptions={{
                    className: "bg-white shadow-lg border",
                    duration: 4000,
                  }}
                />
              </div>
            </Router>
          </AppProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
