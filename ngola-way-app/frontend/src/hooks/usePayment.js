import { useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export default function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, supabase } = useAuth();
  const { showError, showSuccess } = useNotification();

  // Initialize payment for a ride
  const initializeRidePayment = useCallback(async (rideDetails) => {
    try {
      setLoading(true);
      setError(null);

      // Create a payment intent through Supabase function
      const { data, error: paymentError } = await supabase.functions.invoke('create-ride-payment', {
        body: {
          userId: user.id,
          rideDetails,
        },
      });

      if (paymentError) throw paymentError;

      const stripe = await stripePromise;
      const { error: stripeError } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: rideDetails.paymentMethod,
          billing_details: {
            email: user.email,
          },
        },
      });

      if (stripeError) {
        throw stripeError;
      }

      showSuccess('Payment processed successfully');
      return true;
    } catch (err) {
      setError(err.message);
      showError('Payment failed: ' + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, supabase, showSuccess, showError]);

  // Initialize payment for a stay
  const initializeStayPayment = useCallback(async (bookingDetails) => {
    try {
      setLoading(true);
      setError(null);

      // Create a payment intent through Supabase function
      const { data, error: paymentError } = await supabase.functions.invoke('create-stay-payment', {
        body: {
          userId: user.id,
          bookingDetails,
        },
      });

      if (paymentError) throw paymentError;

      const stripe = await stripePromise;
      const { error: stripeError } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: bookingDetails.paymentMethod,
          billing_details: {
            email: user.email,
          },
        },
      });

      if (stripeError) {
        throw stripeError;
      }

      showSuccess('Payment processed successfully');
      return true;
    } catch (err) {
      setError(err.message);
      showError('Payment failed: ' + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, supabase, showSuccess, showError]);

  // Save payment method for future use
  const savePaymentMethod = useCallback(async (paymentMethod) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('payment_methods')
        .insert([
          {
            user_id: user.id,
            stripe_payment_method_id: paymentMethod.id,
            last4: paymentMethod.card.last4,
            brand: paymentMethod.card.brand,
            exp_month: paymentMethod.card.exp_month,
            exp_year: paymentMethod.card.exp_year,
          },
        ]);

      if (error) throw error;

      showSuccess('Payment method saved successfully');
      return data;
    } catch (err) {
      setError(err.message);
      showError('Failed to save payment method: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, supabase, showSuccess, showError]);

  // Get saved payment methods
  const getSavedPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    } catch (err) {
      setError(err.message);
      showError('Failed to fetch payment methods: ' + err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, supabase, showError]);

  // Delete saved payment method
  const deletePaymentMethod = useCallback(async (paymentMethodId) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('stripe_payment_method_id', paymentMethodId);

      if (error) throw error;

      showSuccess('Payment method deleted successfully');
      return true;
    } catch (err) {
      setError(err.message);
      showError('Failed to delete payment method: ' + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [supabase, showSuccess, showError]);

  // Calculate price for a ride
  const calculateRidePrice = useCallback((distance, duration, surge = 1) => {
    const basePrice = 5; // Base fare
    const perKmRate = 2; // Rate per kilometer
    const perMinRate = 0.5; // Rate per minute
    
    const distancePrice = distance * perKmRate;
    const durationPrice = (duration / 60) * perMinRate; // Convert duration to minutes
    
    const totalPrice = (basePrice + distancePrice + durationPrice) * surge;
    return Math.round(totalPrice * 100) / 100; // Round to 2 decimal places
  }, []);

  // Calculate price for a stay
  const calculateStayPrice = useCallback((nightlyRate, nights, guests) => {
    const basePrice = nightlyRate * nights;
    const cleaningFee = 30;
    const serviceFee = basePrice * 0.12; // 12% service fee
    
    const totalPrice = basePrice + cleaningFee + serviceFee;
    return {
      basePrice,
      cleaningFee,
      serviceFee,
      totalPrice: Math.round(totalPrice * 100) / 100,
    };
  }, []);

  return {
    loading,
    error,
    initializeRidePayment,
    initializeStayPayment,
    savePaymentMethod,
    getSavedPaymentMethods,
    deletePaymentMethod,
    calculateRidePrice,
    calculateStayPrice,
  };
}

/* Example usage:
const MyComponent = () => {
  const {
    loading,
    error,
    initializeRidePayment,
    getSavedPaymentMethods,
    calculateRidePrice,
  } = usePayment();

  const handlePayment = async () => {
    const price = calculateRidePrice(5, 15); // 5km, 15 minutes
    const paymentResult = await initializeRidePayment({
      amount: price,
      paymentMethod: 'pm_card_visa', // Stripe payment method ID
      // other ride details...
    });

    if (paymentResult) {
      // Handle successful payment
    }
  };

  const loadPaymentMethods = async () => {
    const methods = await getSavedPaymentMethods();
    // Update UI with payment methods
  };
};
*/
