import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Users,
  FileText,
  MessageSquare,
  CreditCard,
  FileSpreadsheet,
  TrendingUp,
  BarChart3,
  Hash,
  PanelLeftClose,
  PanelLeftOpen,
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

const ADMIN_TABS = [
  { id: "dashboard", icon: BarChart3, label: "Dashboard" },
  { id: "users", icon: Users, label: "Users & Reports" },
  { id: "transactions", icon: CreditCard, label: "Token Purchases" },
  { id: "contacts", icon: MessageSquare, label: "Contact Submissions" },
  { id: "blog", icon: FileText, label: "Blog Posts" },
  { id: "press", icon: FileText, label: "Press Releases" },
  { id: "investors", icon: TrendingUp, label: "Investors" },
  { id: "technologies", icon: FileSpreadsheet, label: "Technologies" },
  { id: "prototype", icon: Hash, label: "Prototype Inquiries" },
];

const TAB_COMPONENTS = {
  dashboard: DashboardTab,
  users: UsersTab,
  transactions: TransactionsTab,
  contacts: ContactsTab,
  blog: () => <PostsTab type="blog" />,
  press: () => <PostsTab type="press_release" />,
  investors: InvestorsTab,
  technologies: TechnologiesTab,
  prototype: PrototypeTab,
};

export default function Admin() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { tabId } = useParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("assesme_admin_sidebar_collapsed") === "1";
  });
  const activeTabId = tabId && TAB_COMPONENTS[tabId] ? tabId : "dashboard";
  const ActiveTab = TAB_COMPONENTS[activeTabId];
  const activeTab = useMemo(
    () => ADMIN_TABS.find((tab) => tab.id === activeTabId) || ADMIN_TABS[0],
    [activeTabId],
  );
  const navigateToTab = (nextTabId) => navigate(`/admin/${nextTabId}`);

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

  useEffect(() => {
    if (!tabId || !TAB_COMPONENTS[tabId]) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [tabId, navigate]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "assesme_admin_sidebar_collapsed",
        isSidebarCollapsed ? "1" : "0",
      );
    }
  }, [isSidebarCollapsed]);

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

  if (!user || !user.is_admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="px-4 sm:px-6 lg:px-8">
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

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside
          className={`hidden lg:flex shrink-0 bg-white border-r border-neutral-200 flex-col transition-all duration-200 ${
            isSidebarCollapsed ? "w-16" : "w-56"
          }`}
        >
          <div
            className={`py-4 border-b border-neutral-100 flex items-center ${
              isSidebarCollapsed ? "px-3 justify-center" : "px-4 justify-between"
            }`}
          >
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {ADMIN_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigateToTab(tab.id)}
                  title={isSidebarCollapsed ? tab.label : undefined}
                  className={`w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  } ${isSidebarCollapsed ? "flex justify-center" : "flex items-center gap-3"}`}
                >
                  <Icon className="h-4 w-4" />
                  {!isSidebarCollapsed && <span>{tab.label}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="p-4 sm:p-6 lg:p-8 space-y-4">
            <div className="lg:hidden bg-white rounded-xl border border-neutral-200 shadow-sm p-3">
              <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ADMIN_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = tab.id === activeTabId;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => navigateToTab(tab.id)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary-50 text-primary-700"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {activeTabId === "dashboard" ? (
              <ActiveTab onNavigateTab={navigateToTab} />
            ) : (
              <ActiveTab />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
