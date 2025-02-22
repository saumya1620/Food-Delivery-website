const getBaseApiUrl = () => {
  return "http://localhost:3000";
};

const STORAGE_PREFIX = "tomato-";

const saveAuthToken = (token) => {
  sessionStorage.setItem(`${STORAGE_PREFIX}token`, token);
};

const getAuthToken = () => {
  const token = sessionStorage.getItem(`${STORAGE_PREFIX}token`) || null;
  return token;
};

export { getBaseApiUrl, saveAuthToken, getAuthToken };
