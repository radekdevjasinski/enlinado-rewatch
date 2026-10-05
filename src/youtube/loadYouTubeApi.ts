let apiPromise: Promise<typeof YT> | null = null;

function injectApiScript(): Promise<typeof YT> {
  return new Promise((resolve, reject) => {
    window.onYouTubeIframeAPIReady = () => {
      if (window.YT) resolve(window.YT);
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = () => {
      apiPromise = null;
      reject(new Error('Nie udało się załadować YouTube IFrame Player API'));
    };
    document.head.append(script);
  });
}

export function loadYouTubeApi(): Promise<typeof YT> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  apiPromise ??= injectApiScript();
  return apiPromise;
}
