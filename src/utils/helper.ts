export enum LOCALSTORAGE_KEYS {
    USER = "USER",
    LANGUAGE = "LANGUAGE",
    DEFAULT_INSTITUTE = "DEFAULT_INSTITUTE",
    INSTITUTES = "INSTITUTES",
    ROLE_ACTIVITY = "ROLE_ACTIVITY",
    MODULES = "MODULES"
}

const defaults = {
    USER: "Nil Neetin",
    LANGUAGE: "English",
    DEFAULT_INSTITUTE: "",
    INSTITUTES: "",
    ROLE_ACTIVITY: "",
    MODULES: ""
};

type FeatureKey = keyof typeof defaults;

const isStorageAvailable = (storage: Storage | null): boolean => {
    if (!storage) {
        return false;
    }

    try {
        const testKey = "__storage_test__";
        storage.setItem(testKey, testKey);
        storage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
};

export const setLocalStorage = (key: FeatureKey, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch (error: unknown) {
        const err = error as DOMException;
        const isQuotaError =
            err?.name === "QuotaExceededError" ||
            err?.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
            (err?.message && err.message.toLowerCase().includes("quota"));

        if (isQuotaError && isStorageAvailable(sessionStorage)) {
            sessionStorage.setItem(key, value);
            console.warn(`localStorage quota exceeded. Saved key '${key}' to sessionStorage instead.`);
            return;
        }

        console.error(`Unable to save storage key '${key}':`, error);
    }
};

export const getLocalStorage = (key: FeatureKey) => {
    try {
        return localStorage.getItem(key) ?? sessionStorage.getItem(key);
    } catch (error) {
        console.warn(`Unable to read storage key '${key}':`, error);
        try {
            return sessionStorage.getItem(key);
        } catch {
            return null;
        }
    }
};

export const removeLocalStorage = (key: FeatureKey) => {
    try {
        localStorage.removeItem(key);
    } catch {
        // ignore
    }

    try {
        sessionStorage.removeItem(key);
    } catch {
        // ignore
    }
};

export const signOut = () => {
    try {
        Object.keys(localStorage).forEach((key: string) => {
            localStorage.removeItem(key);
        });
    } catch {
        // ignore
    }

    try {
        Object.keys(sessionStorage).forEach((key: string) => {
            sessionStorage.removeItem(key);
        });
    } catch {
        // ignore
    }
};
