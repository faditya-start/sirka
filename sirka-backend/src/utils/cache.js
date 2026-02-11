import NodeCache from "node-cache";

// Cache valid for 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

export const getCache = (key) => {
    return cache.get(key);
};

export const setCache = (key, value) => {
    return cache.set(key, value);
};

export const delCache = (key) => {
    return cache.del(key);
};

export const flushCache = () => {
    return cache.flushAll();
};

export const clearCachePattern = (pattern) => {
    const keys = cache.keys();
    const filteredKeys = keys.filter((key) => key.startsWith(pattern));
    if (filteredKeys.length > 0) {
        cache.del(filteredKeys);
    }
};

export default cache;
