import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function useRealtime() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user, supabase } = useAuth();
  const { showNotification } = useNotification();

  // Cleanup subscriptions on unmount
  useEffect(() => {
    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe());
    };
  }, [subscriptions]);

  // Subscribe to ride updates (for both drivers and clients)
  const subscribeToRides = useCallback((rideId = null) => {
    try {
      let query = supabase
        .channel('rides')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'rides',
            ...(rideId ? { filter: `id=eq.${rideId}` } : {}),
          },
          (payload) => {
            const { new: newRecord, old: oldRecord, eventType } = payload;

            // Handle different event types
            switch (eventType) {
              case 'INSERT':
                if (newRecord.driver_id === user.id) {
                  showNotification({
                    title: 'New Ride Request',
                    message: 'You have a new ride request!',
                    type: 'info',
                  });
                }
                break;

              case 'UPDATE':
                // Handle status changes
                if (newRecord.status !== oldRecord.status) {
                  const messages = {
                    accepted: 'Ride has been accepted',
                    started: 'Ride has started',
                    completed: 'Ride has been completed',
                    cancelled: 'Ride has been cancelled',
                  };

                  showNotification({
                    title: 'Ride Update',
                    message: messages[newRecord.status] || 'Ride status has changed',
                    type: newRecord.status === 'cancelled' ? 'error' : 'success',
                  });
                }
                break;

              case 'DELETE':
                showNotification({
                  title: 'Ride Cancelled',
                  message: 'The ride has been cancelled',
                  type: 'warning',
                });
                break;
            }
          }
        )
        .subscribe();

      setSubscriptions(prev => [...prev, query]);
      return query;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [user, supabase, showNotification]);

  // Subscribe to stay booking updates (for both hosts and clients)
  const subscribeToBookings = useCallback((bookingId = null) => {
    try {
      let query = supabase
        .channel('bookings')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookings',
            ...(bookingId ? { filter: `id=eq.${bookingId}` } : {}),
          },
          (payload) => {
            const { new: newRecord, old: oldRecord, eventType } = payload;

            switch (eventType) {
              case 'INSERT':
                if (newRecord.host_id === user.id) {
                  showNotification({
                    title: 'New Booking Request',
                    message: 'You have a new booking request!',
                    type: 'info',
                  });
                }
                break;

              case 'UPDATE':
                if (newRecord.status !== oldRecord.status) {
                  const messages = {
                    confirmed: 'Booking has been confirmed',
                    cancelled: 'Booking has been cancelled',
                    completed: 'Stay has been completed',
                  };

                  showNotification({
                    title: 'Booking Update',
                    message: messages[newRecord.status] || 'Booking status has changed',
                    type: newRecord.status === 'cancelled' ? 'error' : 'success',
                  });
                }
                break;
            }
          }
        )
        .subscribe();

      setSubscriptions(prev => [...prev, query]);
      return query;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [user, supabase, showNotification]);

  // Subscribe to driver location updates
  const subscribeToDriverLocation = useCallback((driverId) => {
    try {
      let query = supabase
        .channel(`driver-${driverId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'driver_profiles',
            filter: `user_id=eq.${driverId}`,
          },
          (payload) => {
            const { new: newLocation } = payload;
            // Handle location update
            // This could trigger a map update or ETA recalculation
          }
        )
        .subscribe();

      setSubscriptions(prev => [...prev, query]);
      return query;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [supabase]);

  // Subscribe to user notifications
  const subscribeToNotifications = useCallback(() => {
    try {
      let query = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const { new: notification } = payload;
            showNotification({
              title: notification.title,
              message: notification.message,
              type: notification.type,
            });
          }
        )
        .subscribe();

      setSubscriptions(prev => [...prev, query]);
      return query;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [user, supabase, showNotification]);

  // Subscribe to property availability updates
  const subscribeToPropertyAvailability = useCallback((propertyId) => {
    try {
      let query = supabase
        .channel(`property-${propertyId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'properties',
            filter: `id=eq.${propertyId}`,
          },
          (payload) => {
            const { new: newData, old: oldData } = payload;
            if (newData.available !== oldData.available) {
              showNotification({
                title: 'Property Update',
                message: newData.available 
                  ? 'Property is now available'
                  : 'Property is no longer available',
                type: 'info',
              });
            }
          }
        )
        .subscribe();

      setSubscriptions(prev => [...prev, query]);
      return query;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [supabase, showNotification]);

  // Unsubscribe from a specific subscription
  const unsubscribe = useCallback((subscription) => {
    if (subscription) {
      subscription.unsubscribe();
      setSubscriptions(prev => prev.filter(sub => sub !== subscription));
    }
  }, []);

  // Unsubscribe from all subscriptions
  const unsubscribeAll = useCallback(() => {
    subscriptions.forEach(subscription => subscription.unsubscribe());
    setSubscriptions([]);
  }, [subscriptions]);

  return {
    loading,
    error,
    subscribeToRides,
    subscribeToBookings,
    subscribeToDriverLocation,
    subscribeToNotifications,
    subscribeToPropertyAvailability,
    unsubscribe,
    unsubscribeAll,
  };
}

/* Example usage:
const MyComponent = () => {
  const {
    subscribeToRides,
    subscribeToDriverLocation,
    unsubscribeAll,
  } = useRealtime();

  useEffect(() => {
    // Subscribe to relevant updates
    const rideSubscription = subscribeToRides();
    const driverSubscription = subscribeToDriverLocation(driverId);

    // Cleanup on unmount
    return () => {
      unsubscribeAll();
    };
  }, []);
};
*/
