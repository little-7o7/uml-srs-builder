import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Package, User, Mail } from "lucide-react";
import { z } from "zod";

// Schema for input validation
const authSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100).optional(),
});

const usernameSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(50),
});

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  // Handle anonymous login with username
  const handleAnonymousLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      usernameSchema.parse({ username });
      
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInAnonymously({
        options: {
          data: {
            full_name: username.trim(),
          },
        },
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Update profile with username
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: username.trim(),
          email: `${username.toLowerCase().replace(/\s+/g, '')}@anonymous.local`,
        });
      }

      toast({
        title: `Welcome, ${username}!`,
        description: "You are now logged in",
      });
      
      navigate("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      authSchema.parse({ email, password });
      
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome back!",
        description: "Successfully logged in",
      });
      
      navigate("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      authSchema.parse({ email, password, fullName });
      
      setIsLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Account Created!",
        description: "You have been automatically logged in",
      });
      
      navigate("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <Card className="w-full max-w-md shadow-2xl border-border/50 backdrop-blur-sm bg-card/95 animate-in slide-in-from-bottom relative z-10">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg animate-in slide-in-from-top">
              <Package className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SIMS
          </CardTitle>
          <CardDescription className="text-base">Simple Inventory Management System</CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <Tabs defaultValue="quick" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="quick" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <User className="h-4 w-4 mr-1" />
                Quick
              </TabsTrigger>
              <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            {/* Quick anonymous login */}
            <TabsContent value="quick">
              <form onSubmit={handleAnonymousLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Your Name</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    maxLength={50}
                  />
                </div>
                <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
                  {isLoading ? "Entering..." : "Enter as Guest"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Quick access without email registration
                </p>
              </form>
            </TabsContent>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    maxLength={255}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    maxLength={100}
                  />
                </div>
                <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Log In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    maxLength={255}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    maxLength={100}
                  />
                </div>
                <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
        </CardContent>
      </Card>
    </div>
  );
}
