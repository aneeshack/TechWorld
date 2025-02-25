export const storeObject = (key: string, object: unknown) => {
    const jsonString = JSON.stringify(object);
    localStorage.setItem(key, jsonString);
};

export const getObject = (key: string) => {
    const jsonString: string|null = localStorage.getItem(key);
    return JSON.parse(jsonString as string);
};

export const deleteObject = (key: string) => {
    return localStorage.removeItem(key);
}