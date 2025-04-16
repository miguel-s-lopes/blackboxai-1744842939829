import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/context/NotificationContext';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { isValidEmail } from '@/utils/helpers';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSuccess(false);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    if (!email || !isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(email);
      setIsSuccess(true);
      addNotification({
        type: 'success',
        title: 'Reset link sent',
        message: 'Please check your email for password reset instructions.',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Reset failed',
        message: error instanceof Error ? error.message : 'Failed to send reset link.',
      });
      setError(error instanceof Error ? error.message : 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <Card.Header className="space-y-1">
          <Card.Title className="text-2xl text-center">Reset Password</Card.Title>
          <Card.Description className="text-center">
            Enter your email address and we'll send you a link to reset your password
          </Card.Description>
        </Card.Header>
        <Card.Content>
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="rounded-full bg-green-50 p-4 mx-auto w-fit">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">
                We've sent you an email with instructions to reset your password.
                Please check your inbox.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsSuccess(false)}
              >
                Try another email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="Enter your email address"
                  required
                  disabled={isLoading}
                  error={error}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                Send Reset Link
              </Button>
            </form>
          )}
        </Card.Content>
        <Card.Footer className="text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link
              to="/auth/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in
            </Link>
          </p>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default ForgotPassword;
