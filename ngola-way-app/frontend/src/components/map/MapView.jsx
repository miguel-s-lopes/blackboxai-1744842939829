import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Loading from '../common/Loading';

// Set your Mapbox token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const defaultCenter = [-0.118092, 51.509865]; // London coordinates as default
const defaultZoom = 12;

function MapView({
  center = defaultCenter,
  zoom = defaultZoom,
  markers = [],
  onMarkerClick,
  onMapClick,
  showUserLocation = false,
  drawRoute = false,
  routeCoordinates = [],
  className = '',
  interactive = true,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [loading, setLoading] = useState(true);

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center,
      zoom: zoom,
      interactive: interactive,
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    if (showUserLocation) {
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }));
    }

    map.current.on('load', () => {
      setLoading(false);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Handle map click events
  useEffect(() => {
    if (!map.current || !onMapClick) return;

    const handleClick = (e) => {
      onMapClick({
        lngLat: [e.lngLat.lng, e.lngLat.lat],
        point: [e.point.x, e.point.y]
      });
    };

    map.current.on('click', handleClick);

    return () => {
      if (map.current) {
        map.current.off('click', handleClick);
      }
    };
  }, [onMapClick]);

  // Update markers
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach(markerData => {
      const { longitude, latitude, type = 'default', popup } = markerData;

      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      
      // Style marker based on type
      switch (type) {
        case 'driver':
          el.innerHTML = `
            <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          `;
          break;
        case 'property':
          el.innerHTML = `
            <div class="w-8 h-8 bg-secondary-600 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          `;
          break;
        default:
          el.innerHTML = `
            <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          `;
      }

      // Create and add the marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude]);

      if (popup) {
        const popupContent = new mapboxgl.Popup({ offset: 25 })
          .setHTML(popup);
        marker.setPopup(popupContent);
      }

      if (onMarkerClick) {
        el.addEventListener('click', () => onMarkerClick(markerData));
      }

      marker.addTo(map.current);
      markersRef.current.push(marker);
    });
  }, [markers, onMarkerClick]);

  // Draw route
  useEffect(() => {
    if (!map.current || !drawRoute || routeCoordinates.length < 2) return;

    if (map.current.getSource('route')) {
      map.current.removeLayer('route');
      map.current.removeSource('route');
    }

    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeCoordinates
        }
      }
    });

    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3b82f6',
        'line-width': 4
      }
    });
  }, [drawRoute, routeCoordinates]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <Loading size="lg" />
        </div>
      )}
    </div>
  );
}

export default MapView;

/* Example usage:
// Simple map with markers
<MapView
  className="h-96"
  markers={[
    {
      longitude: -0.118092,
      latitude: 51.509865,
      type: 'driver',
      popup: '<h3>Available Driver</h3><p>Rating: 4.8⭐</p>'
    },
    {
      longitude: -0.120092,
      latitude: 51.509865,
      type: 'property',
      popup: '<h3>Luxury Apartment</h3><p>$200/night</p>'
    }
  ]}
  onMarkerClick={(marker) => console.log('Marker clicked:', marker)}
/>

// Map with route
<MapView
  className="h-96"
  drawRoute={true}
  routeCoordinates={[
    [-0.118092, 51.509865],
    [-0.120092, 51.509865]
  ]}
  showUserLocation={true}
/>
*/
