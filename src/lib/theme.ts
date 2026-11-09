/**
 * Light and dark mode.
 *
 * The page follows the system setting until the visitor picks a theme with
 * the toggle; the choice is then saved in localStorage.
 *
 * The inline script in src/app.html repeats `resolveTheme` in plain JS, so
 * the theme is set before the first paint. Keep both in sync.
 */

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

export function isTheme(value: unknown): value is Theme {
	return value === 'light' || value === 'dark';
}

/** A saved choice wins; otherwise follow the system setting. */
export function resolveTheme(saved: string | null, systemPrefersDark: boolean): Theme {
	if (isTheme(saved)) return saved;
	return systemPrefersDark ? 'dark' : 'light';
}

export function nextTheme(theme: Theme): Theme {
	return theme === 'dark' ? 'light' : 'dark';
}
