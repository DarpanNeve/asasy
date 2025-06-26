import { useState, useEffect } from "react";
import {
  Check,
  Crown,
  Zap,
  Users,
  Shield,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export default function Subscription() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
    fetchCurrentSubscription();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get("/plans");
      setPlans(response.data);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      toast.error("Failed to load subscription plans");
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const response = await api.get("/subscriptions/current");
      setCurrentSubscription(response.data);
    } catch (error) {
      // User might not have a subscription
      setCurrentSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    if (!user) {
      toast.error("Please log in to subscribe");
      return;
    }

    setProcessingPlan(planId);
    try {
      const response = await api.post("/subscriptions/create-order", {
        plan_id: planId,
      });

      const { order_id, amount, currency } = response.data;

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "Asasy",
        description: "Subscription Payment",
        order_id: order_id,
        handler: async function (response) {
          try {
            await api.post("/subscriptions/verify-payment", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Subscription activated successfully!");
            fetchCurrentSubscription();
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to create order");
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    try {
      await api.delete("/subscriptions/cancel");
      toast.success("Subscription cancelled successfully");
      fetchCurrentSubscription();
    } catch (error) {
      toast.error("Failed to cancel subscription");
    }
  };

  const getPlanIcon = (planName) => {
    switch (planName.toLowerCase()) {
      case "starter":
        return Zap;
      case "professional":
        return Crown;
      case "enterprise":
        return Users;
      default:
        return Shield;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
          Unlock the full potential of AI-powered technology assessment reports.
          Start with a free report and upgrade as you grow.
        </p>
      </div>

      {/* Current Subscription Status */}
      {currentSubscription && (
        <div className="card bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg mr-4">
                <CreditCard className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-900">
                  Current Plan: {currentSubscription.plan_name}
                </h3>
                <p className="text-primary-700">
                  {currentSubscription.status === "active"
                    ? `Active until ${new Date(
                        currentSubscription.active_until
                      ).toLocaleDateString()}`
                    : `Status: ${currentSubscription.status}`}
                </p>
              </div>
            </div>
            {currentSubscription.status === "active" && (
              <button
                onClick={handleCancelSubscription}
                className="btn bg-error-600 text-white hover:bg-error-700"
              >
                Cancel Subscription
              </button>
            )}
          </div>
        </div>
      )}

      {/* Free Usage Status */}
      {!currentSubscription && (
        <div className="card bg-warning-50 border-warning-200">
          <div className="flex items-center">
            <div className="p-3 bg-warning-100 rounded-lg mr-4">
              <Zap className="h-6 w-6 text-warning-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-warning-900">
                Free Plan
              </h3>
              <p className="text-warning-700">
                You have generated {user?.reports_generated || 0} out of 1 free
                report.
                {user?.reports_generated >= 1 &&
                  " Upgrade to generate unlimited reports."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const IconComponent = getPlanIcon(plan.name);
          const isCurrentPlan = currentSubscription?.plan_id === plan.id;
          const isProcessing = processingPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`card relative transition-all duration-200 ${
                plan.is_popular
                  ? "ring-2 ring-primary-500 scale-105"
                  : "hover:shadow-lg"
              } ${isCurrentPlan ? "bg-primary-50 border-primary-200" : ""}`}
            >
              {plan.is_popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-success-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-xl mb-6">
                  <IconComponent className="h-8 w-8 text-primary-600" />
                </div>

                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {plan.name}
                </h3>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-neutral-900">
                    ₹{(plan.price_inr / 100).toLocaleString()}
                  </span>
                  <span className="text-neutral-600">/month</span>
                </div>

                <p className="text-neutral-600 mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrentPlan || isProcessing}
                  className={`w-full ${
                    isCurrentPlan
                      ? "btn bg-neutral-300 text-neutral-500 cursor-not-allowed"
                      : plan.is_popular
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner mr-2" />
                      Processing...
                    </div>
                  ) : isCurrentPlan ? (
                    "Current Plan"
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-neutral-900 mb-2">
              Can I change my plan anytime?
            </h3>
            <p className="text-neutral-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes
              will be reflected in your next billing cycle.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-2">
              What happens to my reports if I cancel?
            </h3>
            <p className="text-neutral-600">
              Your existing reports will remain accessible even after
              cancellation. However, you won't be able to generate new reports
              without a subscription.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-2">
              Do you offer refunds?
            </h3>
            <p className="text-neutral-600">
              We offer a 30-day money-back guarantee for all paid plans. Contact
              our support team for assistance.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-2">
              Is there a free trial?
            </h3>
            <p className="text-neutral-600">
              Yes! Every new user gets one free report to try our service. No
              credit card required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
