import fs, { promises } from "fs";

export const adjustRelativePath = (path: string) => {
    if (['/', '.'].indexOf(path[0]) === -1) {
        path = './' + path;
    } else if (path[0] === '/') {
        path = '.' + path;
    }

    return path;
};

export const folderExists = (path: string) => {
    return fs.existsSync(path);
};

export const getFileNameFromPath = (path: string) => {
    const segments = path.split('/');
    return segments[segments.length - 1];
};