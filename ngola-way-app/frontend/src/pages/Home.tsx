import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

const Home = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();

  const handleWelcome = () => {
    addNotification({
      type: 'success',
      title: 'Welcome!',
      message: `Hello ${user?.name || 'there'}, welcome to Ngola Way!`,
    });
  };

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Welcome to Ngola Way
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
          Your trusted platform for seamless transportation and logistics solutions.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button onClick={handleWelcome}>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <Card.Header>
            <Card.Title>Fast Delivery</Card.Title>
            <Card.Description>
              Get your packages delivered quickly and efficiently.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="text-gray-600 dark:text-gray-400">
              Our network of drivers ensures timely delivery of your packages across the city.
            </p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Real-time Tracking</Card.Title>
            <Card.Description>
              Track your deliveries in real-time.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="text-gray-600 dark:text-gray-400">
              Know exactly where your package is with our advanced tracking system.
            </p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Secure Payments</Card.Title>
            <Card.Description>
              Safe and secure payment options.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="text-gray-600 dark:text-gray-400">
              Multiple payment options with secure transaction processing.
            </p>
          </Card.Content>
        </Card>
      </section>

      <section className="rounded-lg bg-gray-50 dark:bg-gray-800 p-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Join thousands of satisfied customers who trust Ngola Way for their delivery needs.
          </p>
          <div className="mt-8">
            <Button size="lg" fullWidth>
              Create Your First Delivery
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
