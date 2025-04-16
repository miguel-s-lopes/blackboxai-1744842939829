import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/context/NotificationContext';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { isValidEmail, isStrongPassword } from '@/utils/helpers';

interface FormErrors {
  [key: string]: string;
}

const Register = () => {
  const { register } = useAuth();
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (formData: FormData): boolean => {
    const newErrors: FormErrors = {};
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const name = formData.get('name') as string;

    if (!name || name.length < 2) {
      newErrors['name'] = 'Name must be at least 2 characters long';
    }

    if (!email || !isValidEmail(email)) {
      newErrors['email'] = 'Please enter a valid email address';
    }

    if (!password || !isStrongPassword(password)) {
      newErrors['password'] =
        'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character';
    }

    if (password !== confirmPassword) {
      newErrors['confirmPassword'] = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    if (!validateForm(formData)) {
      setIsLoading(false);
      return;
    }

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      await register(email, password, name);
      addNotification({
        type: 'success',
        title: 'Registration successful',
        message: 'Your account has been created successfully.',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Registration failed',
        message: error instanceof Error ? error.message : 'An error occurred during registration.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <Card.Header className="space-y-1">
          <Card.Title className="text-2xl text-center">Create an account</Card.Title>
          <Card.Description className="text-center">
            Enter your details to create your account
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
                required
                disabled={isLoading}
                error={errors['name']}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                name="email"
                label="Email"
                placeholder="Enter your email"
                required
                disabled={isLoading}
                error={errors['email']}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                name="password"
                label="Password"
                placeholder="Create a password"
                required
                disabled={isLoading}
                error={errors['password']}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                required
                disabled={isLoading}
                error={errors['confirmPassword']}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              Create Account
            </Button>
          </form>
        </Card.Content>
        <Card.Footer className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
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

export default Register;
