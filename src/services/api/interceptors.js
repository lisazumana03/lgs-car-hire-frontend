export const logRequest = (config) => {
  if (import.meta.env.DEV) {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
};

export const logResponse = (response) => {
  if (import.meta.env.DEV) {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
  }
  return response;
};

export const addTimestamp = (config) => {
  config.metadata = { startTime: new Date() };
  return config;
};

export const calculateDuration = (response) => {
  const duration = new Date() - response.config.metadata.startTime;
  if (import.meta.env.DEV) {
    console.log(`[API Duration] ${response.config.url} took ${duration}ms`);
  }
  return response;
};

export const retryRequest = async (error, retries = 3) => {
  const config = error.config;

  if (!config || !config.retry) {
    return Promise.reject(error);
  }

  config.__retryCount = config.__retryCount || 0;

  if (config.__retryCount >= retries) {
    return Promise.reject(error);
  }

  config.__retryCount += 1;

  const backoff = new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, config.__retryCount * 1000);
  });

  await backoff;
  return axios(config);
};
