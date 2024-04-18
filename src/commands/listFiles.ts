import walk from "walk";
import * as fs from "fs";
import fsPath from "path";

export const listFiles = async (
  path: string,
  asMap = true,
  saveToFile = false
) => {
  const filesMap: Record<string, string[]> = {};
  const files: string[] = [];
  let filesCount = 0;
  const walker = walk.walk(fsPath.resolve(path), { followLinks: false });
  const promise = new Promise<
    | {
        files: Record<string, string[]>;
        count: number;
      }
    | { files: string[]; count: number }
  >((resolve, reject) => {
    walker.on("file", function (root, stat, next) {
      filesCount++;
      if (asMap) {
        if (filesMap[stat.name] == null) {
          filesMap[stat.name] = [root + "/" + stat.name];
        } else {
          filesMap[stat.name].push(root + "/" + stat.name);
        }
      } else {
        files.push(root + "/" + stat.name);
      }
      next();
    });

    walker.on("end", function () {
      const content = JSON.stringify(asMap ? filesMap : files, null, 4);
      if (saveToFile) {
        fs.writeFile("./list.json", content, (err) => {
          if (err) {
            console.log("[ERROR]", err);
            reject(err);
            return null;
          } else {
            console.log("[SAVED TO list.json]");
          }
        });
      }
      resolve(
        asMap
          ? { files: filesMap, count: filesCount }
          : { files: files, count: filesCount }
      );
    });
  });
  return promise;
};
