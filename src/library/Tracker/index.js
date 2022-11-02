const { default: axios } = require('axios');
((window) => {
  const { location, localStorage, document, history } = window;
  const { pathname, search, origin } = location;
  const { currentScript } = document;

  if (!currentScript) return;

  const assign = (a, b) => {
    Object.keys(b).forEach((key) => {
      if (b[key] !== undefined) a[key] = b[key];
    });
    return a;
  };

  const hook = (_this, method, callback) => {
    const orig = _this[method];

    return (...args) => {
      callback.apply(null, args);

      return orig.apply(_this, args);
    };
  };

  const _data = 'data-';
  const _false = 'false';
  const attr = currentScript.getAttribute.bind(currentScript);
  const website = attr(_data + 'website-id');

  const hostUrl = envEndpoint;
  const autoTrack = attr(_data + 'auto-track') !== _false;
  const root = hostUrl
    ? hostUrl.replace(/\/$/, '')
    : currentScript.src.split('/').slice(0, -1).join('/');
  const endpointInit = `${root}/index.php?webserviceClient=site&webserviceVersion=1.0.0&option=reditem&view=webevent&task=init&api=hal`;
  const endpointStart = `${root}/index.php?webserviceClient=site&webserviceVersion=1.0.0&option=reditem&view=webevent&task=start&api=hal`;
  const endpointEnd = `${root}/index.php?webserviceClient=site&webserviceVersion=1.0.0&option=reditem&view=webevent&task=end&api=hal`;
  let currentUrl = `${origin}${pathname}${search}`;
  let currentRef = document.referrer;
  let currentUserAgent = window.navigator.userAgent;
  let cache;
  /* Collect metrics */

  const getPayload = () => ({
    url: currentUrl,
    user_agent: currentUserAgent,
  });
  const getIpAddress = async () => {
    const res = await axios.get('https://geolocation-db.com/json/');
    return res.data.IPv4;
  };
  const initTracker = async (payload) => {
    const fetchData = await fetch(endpointInit, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: assign({ 'Content-Type': 'application/json' }, { ['x-tracker-cache']: cache }),
    });
    const response = await fetchData.json();
    return response;
  };

  const startTracker = async (payload) => {
    const fetchData = await fetch(endpointStart, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: assign({ 'Content-Type': 'application/json' }, { ['x-tracker-cache']: cache }),
    });
    const response = await fetchData.json();
    return response;
  };

  const endTracker = async (payload) => {
    const fetchData = await fetch(endpointEnd, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: assign({ 'Content-Type': 'application/json' }, { ['x-tracker-cache']: cache }),
    });
    const response = await fetchData.json();
    return response;
  };

  const trackView = async (
    url = currentUrl,
    referrer = currentRef,
    user_agent = currentUserAgent
  ) => {
    // Init Tracker
    if (!localStorage.getItem('event_id') && !localStorage.getItem('uuid')) {
      let ip = await getIpAddress();
      const response = await initTracker({
        url: url,
        referrer: referrer,
        user_agent: user_agent,
        ip: ip,
      });
      localStorage.setItem('event_id', response.result.event_id);
      localStorage.setItem('uuid', response.result.uuid);
    }
    // Start Tracker
    const responseStart = await startTracker({
      event_id: localStorage.getItem('event_id'),
      uuid: localStorage.getItem('uuid'),
      referrer: referrer,
      url: url,
    });
    if (responseStart) {
      localStorage.setItem('event_id_start', responseStart.result.event_id);
      localStorage.setItem('uuid_start', responseStart.result.uuid);
    }
  };

  const endTrackView = async () => {
    // End Tracker
    const responseEnd = await endTracker({
      event_id: localStorage.getItem('event_id_start'),
      uuid: localStorage.getItem('uuid_start'),
    });
    return responseEnd;
  };

  const trackEvent = (eventName, eventData, url = currentUrl, websiteUuid = website) =>
    initTracker(
      'event',
      assign(getPayload(), {
        website: websiteUuid,
        url,
        event_name: eventName,
        event_data: eventData,
      })
    );

  /* Handle history changes */

  const handlePush = (state, title, url) => {
    if (!url) return;

    currentRef = currentUrl;
    const newUrl = url.toString();

    if (newUrl.substring(0, 4) === 'http') {
      currentUrl = '/' + newUrl.split('/').splice(3).join('/');
    } else {
      currentUrl = newUrl;
    }

    if (currentUrl !== currentRef) {
      trackView();
    }
  };

  /* Global */

  if (!window.tracker) {
    const tracker = (eventValue) => trackEvent(eventValue);
    tracker.trackView = trackView;
    tracker.trackEvent = trackEvent;

    window.tracker = tracker;
  }

  /* Start */

  if (autoTrack) {
    history.pushState = hook(history, 'pushState', handlePush);
    history.replaceState = hook(history, 'replaceState', handlePush);

    const update = () => {
      if (document.readyState === 'complete') {
        trackView();
      }
    };

    document.addEventListener('readystatechange', update, true);

    window.addEventListener('beforeunload', async () => {
      await endTrackView();
    });

    update();
  }
})(window);
