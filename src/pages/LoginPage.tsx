import { LoginForm } from '@/components/auth/LoginForm';
import { AuthLayout } from '@/components/layout/Layout';

/**
 * Login page component
 */
export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
