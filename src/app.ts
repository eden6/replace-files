import { input } from "@inquirer/prompts";
import checkbox from "@inquirer/checkbox";
import { listFiles } from "./commands/listFiles.js";
import { adjustRelativePath, folderExists, getFileNameFromPath } from "./helpers/path.js";
import { replaceFile } from "./commands/replaceFile.js";

(async () => {
  const destinationPath = adjustRelativePath(await input({
    message:
      "Quel est le chemin relatif vers le dossier cible (fichiers à remplacer)?",
    default: "../chemin/du/dossier",
  }));

  if (!folderExists(destinationPath)) {
    console.log('Chemin erroné - dossier inexistant');
    return;
  }

  const { count, files: destinationFiles} = await listFiles(
    destinationPath,
    true
  );
  console.log(
    `${count} fichier${count > 1 ? "s" : ""} trouvé${count > 1 ? "s" : ""}`
  );

  const sourcePath = adjustRelativePath(await input({
    message:
      "Quel est le chemin relatif vers le dossier source (fichiers de remplacement)?",
      default: "../chemin/du/dossier"
  }));

  if (!folderExists(sourcePath)) {
    console.log('Chemin erroné - dossier inexistant');
    return;
  }

  const { count: replaceCount, files: sourceFiles } = await listFiles(
    sourcePath,
    false
  );
  console.log(
    `${replaceCount} fichier${replaceCount > 1 ? "s" : ""} trouvé${replaceCount > 1 ? "s" : ""}`
  );

  let df = destinationFiles as Record<string, string[]>;
  for(let file of (sourceFiles as string[])) {
    let fileName = getFileNameFromPath(file);
    if (!df[fileName]) {
      console.log(` 🙅 Fichier ${fileName} non trouvé dans le dossier de destination`);
      continue;
    }

    if (df[fileName].length === 1){
      await replaceFile(file, df[fileName][0]);
      continue;
    }

    if (df[fileName].length > 1) {
      const choiceAnswer = await checkbox({
        message: `Il existe plusieurs fichiers nommés ${fileName} dans le dossier source. Lequels voulez-vous remplacer?`,

        choices: df[fileName].map(f => ({name: f, value: f}))
      });
      await Promise.all(choiceAnswer.map(d => replaceFile(file, d)));
    }
  }
})();
