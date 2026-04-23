import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  MessageSquare,
  CreditCard,
  FileSpreadsheet,
  TrendingUp,
  BarChart3,
  Hash,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

import DashboardTab from "./admin/tabs/DashboardTab";
import UsersTab from "./admin/tabs/UsersTab";
import TransactionsTab from "./admin/tabs/TransactionsTab";
import ContactsTab from "./admin/tabs/ContactsTab";
import PostsTab from "./admin/tabs/PostsTab";
import InvestorsTab from "./admin/tabs/InvestorsTab";
import TechnologiesTab from "./admin/tabs/TechnologiesTab";
import PrototypeTab from "./admin/tabs/PrototypeTab";

export default function Admin() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Gate: redirect if not logged in or not admin
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    if (!user.is_admin) {
      toast.error("You do not have admin access.");
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-neutral-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // To prevent rendering if unauthenticated, although useEffect will redirect
  if (!user || !user.is_admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center group"
                onClick={() => window.scrollTo(0, 0)}
              >
                <div className="relative flex items-center h-16">
                  <img
                    src="/logo.svg"
                    alt="Assesme Logo"
                    className="h-10 w-auto object-contain"
                  />
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="btn-outline btn-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-neutral-200 overflow-x-auto">
            <nav className="-mb-px flex space-x-8 min-w-max pb-1">
              {[
                { id: "dashboard", icon: BarChart3, label: "Dashboard" },
                { id: "users", icon: Users, label: "Users & Reports" },
                {
                  id: "transactions",
                  icon: CreditCard,
                  label: "Token Purchases",
                },
                {
                  id: "contacts",
                  icon: MessageSquare,
                  label: "Contact Submissions",
                },
                { id: "blog", icon: FileText, label: "Blog Posts" },
                { id: "press", icon: FileText, label: "Press Releases" },
                { id: "investors", icon: TrendingUp, label: "Investors" },
                {
                  id: "technologies",
                  icon: FileSpreadsheet,
                  label: "Technologies",
                },
                { id: "prototype", icon: Hash, label: "Prototype Inquiries" },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                    }`}
                  >
                    <Icon className="h-5 w-5 inline mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {activeTab === "dashboard" && (
          <DashboardTab setActiveTab={setActiveTab} />
        )}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "transactions" && <TransactionsTab />}
        {activeTab === "contacts" && <ContactsTab />}
        {activeTab === "blog" && <PostsTab type="blog" />}
        {activeTab === "press" && <PostsTab type="press_release" />}
        {activeTab === "investors" && <InvestorsTab />}
        {activeTab === "technologies" && <TechnologiesTab />}
        {activeTab === "prototype" && <PrototypeTab />}
      </div>
    </div>
  );
}
