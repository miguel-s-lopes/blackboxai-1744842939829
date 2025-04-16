interface Config {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onInstallPromptAvailable?: () => void;
  onInstalled?: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let currentConfig: Config | null = null;

export function register(config?: Config): void {
  currentConfig = config || null;

  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL || window.location.href, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = '/serviceWorker.js';

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: Config): void {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      // Check for updates on page load
      registration.update();

      // Set up periodic updates
      setInterval(() => {
        registration.update();
      }, 1000 * 60 * 60); // Check for updates every hour

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log(
                'New content is available and will be used when all tabs for this page are closed.'
              );

              if (config?.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              console.log('Content is cached for offline use.');

              if (config?.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config): void {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

export function unregister(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// Handle PWA installation
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e as BeforeInstallPromptEvent;
  
  console.log('Install prompt available');
  
  if (currentConfig?.onInstallPromptAvailable) {
    currentConfig.onInstallPromptAvailable();
  }
});

export async function promptInstall(): Promise<void> {
  if (deferredPrompt) {
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      deferredPrompt = null;
    } catch (error) {
      console.error('Error prompting for install:', error);
    }
  }
}

window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  
  if (currentConfig?.onInstalled) {
    currentConfig.onInstalled();
  }
});

/* Example usage:
register({
  onUpdate: (registration: ServiceWorkerRegistration) => {
    // Show notification to user about update
    showUpdateNotification();
  },
  onSuccess: (registration: ServiceWorkerRegistration) => {
    // Show notification that app is ready for offline use
    showOfflineReadyNotification();
  },
  onInstallPromptAvailable: () => {
    // Show custom install button or banner
    showInstallBanner();
  },
  onInstalled: () => {
    // Show thank you message or update UI
    showThankYouMessage();
  }
});
*/
