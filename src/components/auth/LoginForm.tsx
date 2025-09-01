import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

import { useAuth } from '@/hooks/useAuth';
import { loginSchema, LoginFormData } from '@/utils/validators';
import { formatValidationError } from '@/utils/formatters';

/**
 * Login form component with validation and error handling
 */
export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Watch for authentication state changes after login
  useEffect(() => {
    if (isAuthenticated && isLoginInProgress) {
      console.log('LoginForm: Authentication state changed to authenticated, navigating to dashboard...');
      setIsLoginInProgress(false);
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoginInProgress, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      setIsLoginInProgress(true);
      console.log('LoginForm: Starting login with credentials:', { email: data.email });
      
      await login(data);
      
      console.log('LoginForm: Login completed successfully, waiting for auth state update...');
      // Navigation will be handled by useEffect when isAuthenticated becomes true
      
    } catch (err) {
      console.error('LoginForm: Login failed with error:', err);
      setIsLoginInProgress(false);
      setError(formatValidationError(err));
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register('password')}
                className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? 'Hide password' : 'Show password'}
                </span>
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don&apos;t have an account? </span>
            <Link 
              to="/register" 
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
