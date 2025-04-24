import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import ThreeDBackground from "@/components/ui/3d-background";

// Define schema for login form
const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Define schema for registration form
const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();
  
  // Set up login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Set up registration form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  // Handle login submission
  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      await loginMutation.mutateAsync(data);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      // Error will be handled by the mutation's onError callback
      console.error("Login error:", error);
    }
  };
  
  // Handle registration submission
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      await registerMutation.mutateAsync({
        username: data.username,
        password: data.password,
      });
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
    } catch (error) {
      // Error will be handled by the mutation's onError callback
      console.error("Registration error:", error);
    }
  };
  
  // Redirect if user is already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <ThreeDBackground />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Hero Section */}
            <div className="hidden md:block">
              <h1 className="text-4xl font-bold mb-6">Your Health Companion</h1>
              <p className="text-xl text-gray-300 mb-4">
                Join HealthAssist AI for personalized healthcare assistance and reliable medical information.
              </p>
              <div className="space-y-4 mt-8">
                <div className="flex items-start">
                  <div className="rounded-full bg-primary/10 p-2 mr-4">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">24/7 Health Assistance</h3>
                    <p className="text-gray-400">Access our AI healthcare chatbot anytime, anywhere.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="rounded-full bg-primary/10 p-2 mr-4">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Personalized Experience</h3>
                    <p className="text-gray-400">Get customized health guidance based on your profile.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="rounded-full bg-primary/10 p-2 mr-4">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Secure & Private</h3>
                    <p className="text-gray-400">Your health information is kept secure and confidential.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Auth Forms */}
            <Card className="glass border-none p-8 shadow-xl">
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
                  
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your username" 
                                {...field} 
                                className="bg-gray-800 border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                                className="bg-gray-800 border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <input 
                            id="remember-me" 
                            type="checkbox" 
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-700 rounded"
                          />
                          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                            Remember me
                          </label>
                        </div>
                        <a href="#" className="text-sm text-primary hover:text-primary/80">
                          Forgot password?
                        </a>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full mt-4"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                      Don't have an account? 
                      <Button variant="link" className="text-primary" onClick={() => setActiveTab("register")}>
                        Sign up
                      </Button>
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="register">
                  <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
                  
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Choose a username" 
                                {...field} 
                                className="bg-gray-800 border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                                className="bg-gray-800 border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                                className="bg-gray-800 border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full mt-4"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                      Already have an account? 
                      <Button variant="link" className="text-primary" onClick={() => setActiveTab("login")}>
                        Sign in
                      </Button>
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
