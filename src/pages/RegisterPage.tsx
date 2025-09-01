import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthLayout } from '@/components/layout/Layout';

/**
 * Registration page component
 */
export function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
