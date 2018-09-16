import * as path from 'path';
const jetpack = require('fs-jetpack');

/**
 * Finds the directory of the parent module's package descriptor file. If the
 * directory is undefined (the default case), then it is set to the directory
 * name of the parent module's filename. If no package.json file is found, then
 * the parent directories are recursively searched until the file is found or
 * the root directory is reached.
 * https://gist.github.com/fhellwig/3355047
 */
export async function findPackageDir(directory: string): Promise<string> {
    const packageFile = path.resolve(directory, 'package.json');
    const type = await jetpack.existsAsync(packageFile);
    if (type === 'file') {
        return directory;
    }

    const parent = path.resolve(directory, '..');
    if (parent === directory) {
        throw new Error('Parent module package file was not found.');
    }

    return await findPackageDir(parent);
}
