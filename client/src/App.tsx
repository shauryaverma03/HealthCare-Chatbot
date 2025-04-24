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
import ChatHistoryPage from "@/pages/chat-history-page";
import ContactPage from "@/pages/contact-page";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile-page";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";
import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";

// Router for the application
function AppRouter() {
  return (
    <Switch>
      <Route path="/">
        <>
          <Navbar />
          <div className="flex-grow">
            <HomePage />
          </div>
          <Footer />
        </>
      </Route>
      <Route path="/about">
        <>
          <Navbar />
          <div className="flex-grow">
            <AboutPage />
          </div>
          <Footer />
        </>
      </Route>
      <Route path="/chatbot">
        <>
          <Navbar />
          <div className="flex-grow">
            <ChatbotPage />
          </div>
          <Footer />
        </>
      </Route>
      <Route path="/chat-history">
        <>
          <Navbar />
          <div className="flex-grow">
            <ProtectedRoute path="/chat-history" component={ChatHistoryPage} />
          </div>
          <Footer />
        </>
      </Route>
      <Route path="/contact">
        <>
          <Navbar />
          <div className="flex-grow">
            <ContactPage />
          </div>
          <Footer />
        </>
      </Route>
      <Route path="/auth">
        <>
          <Navbar />
          <div className="flex-grow">
            <AuthPage />
          </div>
          <Footer />
        </>
      </Route>
      <Route path="/profile">
        <>
          <Navbar />
          <div className="flex-grow">
            <ProtectedRoute path="/profile" component={ProfilePage} />
          </div>
          <Footer />
        </>
      </Route>
      <Route>
        <>
          <Navbar />
          <div className="flex-grow">
            <NotFound />
          </div>
          <Footer />
        </>
      </Route>
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
              <AppRouter />
              <Toaster />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
