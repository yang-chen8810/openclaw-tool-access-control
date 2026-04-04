import * as path from 'path';

/**
 * Resolves a path to an absolute path.
 * If the path is relative, it is resolved against the current working directory.
 * This can be used to detect path traversal attempts ('..').
 */
export function resolvePath(p: string): string {
    if (!p) return '';
    return path.resolve(p);
}
