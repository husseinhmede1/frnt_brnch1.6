export enum LOCALSTORAGE_KEYS {
    USER = "USER",
    LANGUAGE = "LANGUAGE",
    DEFAULT_INSTITUTE = "DEFAULT_INSTITUTE",
    INSTITUTES = "INSTITUTES",
    ROLE_ACTIVITY = "ROLE_ACTIVITY"
}

const defaults = {
    USER: "Nil Neetin",
    LANGUAGE: "English",
    DEFAULT_INSTITUTE: "",
    INSTITUTES: "",
    ROLE_ACTIVITY: ""
};

type FeatureKey = keyof typeof defaults;

export const setLocalStorage = (key: FeatureKey, value: string) => {
    localStorage.setItem(key, value);
};

export const getLocalStorage = (key: FeatureKey) => {
    return localStorage.getItem(key);
};

export const removeLocalStorage = (key: FeatureKey) => {
    return localStorage.removeItem(key);
};

export const signOut = () => {
    Object.keys(localStorage).forEach((key: string) => {
        localStorage.removeItem(key);
    });

};
