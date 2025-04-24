import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./hooks/use-auth";

import HomePage from "@/pages/home-page";
import AboutPage from "@/pages/about-page";
import ChatbotPage from "@/pages/chatbot-page";
import ContactPage from "@/pages/contact-page";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile-page";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";
import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/chatbot" component={ChatbotPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <TooltipProvider>
            <div className="flex flex-col min-h-screen dark">
              <Navbar />
              <div className="flex-grow">
                <Router />
              </div>
              <Footer />
              <Toaster />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
