import { promises } from "fs";
import { getFileNameFromPath } from "../helpers/path.js";

export const replaceFile = async (src: string, dest: string) => {
    try {
        console.log(` ✅ Remplacement du fichier ${getFileNameFromPath(src)} dans ${dest}`);
        await promises.copyFile(src, dest);
    } catch(err){
        console.log(` ❌ Une erreur a été rencontrée en écrasant le fichier ${getFileNameFromPath(src)} à la destination ${dest}`);
    }
};