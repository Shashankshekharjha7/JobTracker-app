import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Video,
  BarChart3,
  Shield,
  Zap,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: Briefcase,
      title: "Job Application Tracking",
      description:
        "Organize and manage all your job applications in one centralized dashboard.",
    },
    {
      icon: Video,
      title: "AI-Powered Interviews",
      description:
        "Practice interviews with AI-generated questions tailored to your job descriptions.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description:
        "Track your progress with detailed analytics and performance metrics.",
    },
    {
      icon: Shield,
      title: "Resume Management",
      description:
        "Upload, organize, and manage multiple versions of your resume.",
    },
    {
      icon: Zap,
      title: "Smart Notifications",
      description:
        "Get reminders for follow-ups, interviews, and application deadlines.",
    },
    {
      icon: Users,
      title: "Interview Feedback",
      description:
        "Receive instant AI feedback on your answers with improvement suggestions.",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Create Your Account",
      description: "Sign up for free and set up your profile in seconds.",
    },
    {
      number: "2",
      title: "Add Job Applications",
      description:
        "Track applications by adding company details and job descriptions.",
    },
    {
      number: "3",
      title: "Practice Interviews",
      description:
        "Use AI-generated questions to prepare for real interviews.",
    },
    {
      number: "4",
      title: "Analyze Progress",
      description:
        "Monitor your job search with analytics and insights.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JobTrackr
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Your all-in-one platform for managing job applications and acing
            interviews with AI-powered preparation tools.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-none">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
                Why Choose JobTrackr?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      100% Free
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      No hidden fees or premium plans. All features included.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      AI-Powered
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Smart question generation and instant feedback.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Easy to Use
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Intuitive interface designed for job seekers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Secure & Private
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your data is encrypted and never shared.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of job seekers who are already using JobTrackr
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Start Tracking Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} JobTrackr. All Rights Reserved.
          </p>

          <p className="text-sm font-medium text-gray-800 dark:text-gray-300 mt-2">
            Developed by Shashank Shekhar Jha
          </p>
        </div>
        
      </div>
    </div>
  );
}