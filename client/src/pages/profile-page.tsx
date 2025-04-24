import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  Camera, 
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThreeDBackground from "@/components/ui/3d-background";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Define schema for profile form
const profileSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
});

// Define schema for password change
const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: `${user?.username}@example.com` || "",
      phone: "",
      location: "",
    },
  });
  
  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Handle profile update
  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsUpdating(true);
    
    try {
      // In a real implementation, you would update the user's profile on the server
      console.log("Profile data:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      setIsEditingProfile(false);
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle password change
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsUpdating(true);
    
    try {
      // In a real implementation, you would update the user's password on the server
      console.log("Password data:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      
      passwordForm.reset();
      setIsChangingPassword(false);
    } catch (error) {
      toast({
        title: "Error changing password",
        description: "An error occurred while changing your password.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      // In a real implementation, you would delete the user's account on the server
      console.log("Deleting account");
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Account deleted",
        description: "Your account has been deleted.",
      });
      
      // Log out the user
      await logoutMutation.mutateAsync();
    } catch (error) {
      toast({
        title: "Error deleting account",
        description: "An error occurred while deleting your account.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <ThreeDBackground />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Your Profile</h1>
          
          <Card className="glass p-8 shadow-xl mb-8 border-none">
            <div className="flex flex-col sm:flex-row items-center mb-6">
              <div className="sm:mr-8 mb-4 sm:mb-0">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.username}&background=random&size=200`} />
                    <AvatarFallback>
                      {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute bottom-0 right-0 bg-gray-800 text-white border border-gray-700 h-8 w-8"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-semibold">{user?.username}</h2>
                <p className="text-gray-400">{`${user?.username}@example.com`}</p>
                <p className="text-sm text-gray-500 mt-1">Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            
            {isEditingProfile ? (
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="bg-gray-800 border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                {...field} 
                                className="bg-gray-800 border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (optional)</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="+1 (555) 123-4567" 
                                {...field} 
                                className="bg-gray-800 border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location (optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="City, Country" 
                                {...field} 
                                className="bg-gray-800 border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-6 flex space-x-3">
                      <Button 
                        type="submit" 
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditingProfile(false)}
                        disabled={isUpdating}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            ) : (
              <div className="border-t border-gray-700 pt-6 text-center sm:text-left">
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  onClick={() => setIsEditingProfile(true)}
                >
                  Edit Profile
                </Button>
              </div>
            )}
          </Card>
          
          <Card className="glass p-6 shadow-xl border-none">
            <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
            <div className="space-y-4">
              {isChangingPassword ? (
                <div className="py-4 border-b border-gray-700">
                  <h4 className="font-medium mb-4">Change Password</h4>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                {...field} 
                                className="bg-gray-800 border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                {...field} 
                                className="bg-gray-800 border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                {...field} 
                                className="bg-gray-800 border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex space-x-3">
                        <Button 
                          type="submit" 
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            "Update Password"
                          )}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsChangingPassword(false)}
                          disabled={isUpdating}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              ) : (
                <div className="flex items-center justify-between py-2 border-b border-gray-700">
                  <div>
                    <h4 className="font-medium">Change Password</h4>
                    <p className="text-sm text-gray-400">Update your password for security</p>
                  </div>
                  <Button 
                    variant="link" 
                    className="text-primary" 
                    onClick={() => setIsChangingPassword(true)}
                  >
                    Change
                  </Button>
                </div>
              )}
              
              <div className="flex items-center justify-between py-2 border-b border-gray-700">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-400">Receive updates and health tips</p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Delete Account</h4>
                  <p className="text-sm text-gray-400">Permanently remove your account and data</p>
                </div>
                <Button 
                  variant="link" 
                  className="text-red-500 hover:text-red-400"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
                
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
