import { describe, expect, it } from 'vitest';
import { isTheme, nextTheme, resolveTheme } from './theme';

describe('resolveTheme', () => {
	it('uses a saved choice over the system setting', () => {
		expect(resolveTheme('light', true)).toBe('light');
		expect(resolveTheme('dark', false)).toBe('dark');
	});

	it('follows the system setting when nothing is saved', () => {
		expect(resolveTheme(null, true)).toBe('dark');
		expect(resolveTheme(null, false)).toBe('light');
	});

	it('ignores an invalid saved value', () => {
		expect(resolveTheme('purple', true)).toBe('dark');
		expect(resolveTheme('', false)).toBe('light');
	});
});

describe('isTheme', () => {
	it('accepts only light and dark', () => {
		expect(isTheme('light')).toBe(true);
		expect(isTheme('dark')).toBe(true);
		expect(isTheme('Dark')).toBe(false);
		expect(isTheme(null)).toBe(false);
	});
});

describe('nextTheme', () => {
	it('switches between light and dark', () => {
		expect(nextTheme('light')).toBe('dark');
		expect(nextTheme('dark')).toBe('light');
	});
});
