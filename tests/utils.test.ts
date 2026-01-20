import { describe, it, expect } from 'vitest';
import { extractFirstH1, titleToFilename } from '../src/utils';

describe('extractFirstH1', () => {
	it('extracts simple H1', () => {
		const content = '# My Title\n\nSome content';
		expect(extractFirstH1(content)).toBe('My Title');
	});

	it('extracts H1 with extra spaces', () => {
		const content = '#   Spaced Title  \n\nContent';
		expect(extractFirstH1(content)).toBe('Spaced Title');
	});

	it('returns first H1 when multiple exist', () => {
		const content = '# First Title\n\n# Second Title';
		expect(extractFirstH1(content)).toBe('First Title');
	});

	it('skips frontmatter', () => {
		const content = `---
title: Front Matter Title
---

# Real Title

Content here`;
		expect(extractFirstH1(content)).toBe('Real Title');
	});

	it('handles frontmatter with ... delimiter', () => {
		const content = `---
title: Test
...

# Real Title`;
		expect(extractFirstH1(content)).toBe('Real Title');
	});

	it('skips H1 inside code blocks', () => {
		const content = `# Real Title

\`\`\`markdown
# Code Block Title
\`\`\`

Some content`;
		expect(extractFirstH1(content)).toBe('Real Title');
	});

	it('skips H1 inside tilde code blocks', () => {
		const content = `~~~
# Code Title
~~~

# Real Title`;
		expect(extractFirstH1(content)).toBe('Real Title');
	});

	it('finds H1 after code block', () => {
		const content = `\`\`\`
# Not this
\`\`\`

# After Code Block`;
		expect(extractFirstH1(content)).toBe('After Code Block');
	});

	it('returns null when no H1 exists', () => {
		const content = '## H2 Title\n\n### H3 Title';
		expect(extractFirstH1(content)).toBeNull();
	});

	it('returns null for empty content', () => {
		expect(extractFirstH1('')).toBeNull();
	});

	it('does not match # without space', () => {
		const content = '#NoSpace\n\n# With Space';
		expect(extractFirstH1(content)).toBe('With Space');
	});

	it('extracts H1 with markdown formatting', () => {
		const content = '# My **Bold** Title';
		expect(extractFirstH1(content)).toBe('My **Bold** Title');
	});

	it('handles frontmatter-only content', () => {
		const content = `---
title: Only Frontmatter
---`;
		expect(extractFirstH1(content)).toBeNull();
	});
});

describe('titleToFilename', () => {
	describe('basic transformation', () => {
		it('keeps simple titles unchanged', () => {
			expect(titleToFilename('Simple Title')).toBe('Simple Title');
		});

		it('trims whitespace', () => {
			expect(titleToFilename('  Padded Title  ')).toBe('Padded Title');
		});
	});

	describe('illegal character replacement', () => {
		it('replaces colon with dash', () => {
			expect(titleToFilename('Title: Subtitle')).toBe('Title- Subtitle');
		});

		it('replaces question mark with dash', () => {
			expect(titleToFilename('Is This Valid?')).toBe('Is This Valid');
		});

		it('replaces asterisk with dash', () => {
			expect(titleToFilename('Star * Title')).toBe('Star Title');
		});

		it('replaces quotes with dash', () => {
			expect(titleToFilename('He said "hello"')).toBe('He said -hello');
		});

		it('replaces forward slash with dash', () => {
			expect(titleToFilename('Path/To/File')).toBe('Path-To-File');
		});

		it('replaces backslash with dash', () => {
			expect(titleToFilename('Path\\To\\File')).toBe('Path-To-File');
		});

		it('replaces angle brackets with dash', () => {
			expect(titleToFilename('Tag <html>')).toBe('Tag -html');
		});

		it('replaces pipe with dash', () => {
			expect(titleToFilename('A | B')).toBe('A B');
		});

		it('replaces hash with dash', () => {
			expect(titleToFilename('Issue #123')).toBe('Issue -123');
		});

		it('replaces caret with dash', () => {
			expect(titleToFilename('Super^Script')).toBe('Super-Script');
		});

		it('replaces square brackets with dash', () => {
			expect(titleToFilename('Array [0]')).toBe('Array -0');
		});

		it('handles multiple illegal chars', () => {
			expect(titleToFilename('Title: Part 1?')).toBe('Title- Part 1');
		});
	});

	describe('markdown stripping', () => {
		it('removes bold formatting with asterisks', () => {
			expect(titleToFilename('My **Bold** Title')).toBe('My Bold Title');
		});

		it('removes bold formatting with underscores', () => {
			expect(titleToFilename('My __Bold__ Title')).toBe('My Bold Title');
		});

		it('removes italic formatting with asterisks', () => {
			expect(titleToFilename('My *Italic* Title')).toBe('My Italic Title');
		});

		it('removes italic formatting with underscores', () => {
			expect(titleToFilename('My _Italic_ Title')).toBe('My Italic Title');
		});

		it('removes inline code', () => {
			expect(titleToFilename('The `code` function')).toBe('The code function');
		});

		it('removes wiki-style links', () => {
			expect(titleToFilename('Link to [[Page]]')).toBe('Link to Page');
		});

		it('removes wiki-style links with display text', () => {
			expect(titleToFilename('Link to [[Page|Display]]')).toBe('Link to Display');
		});

		it('removes markdown links', () => {
			expect(titleToFilename('Check [this](http://example.com)')).toBe('Check this');
		});

		it('removes strikethrough', () => {
			expect(titleToFilename('Not ~~deleted~~ kept')).toBe('Not deleted kept');
		});

		it('removes highlight', () => {
			expect(titleToFilename('Very ==important== text')).toBe('Very important text');
		});

		it('handles complex formatting', () => {
			expect(titleToFilename('My **Bold** Title: A Story? (Part 1) with [[links]]')).toBe(
				'My Bold Title- A Story- (Part 1) with links'
			);
		});
	});

	describe('dash and space collapsing', () => {
		it('collapses multiple spaces', () => {
			expect(titleToFilename('Too   Many   Spaces')).toBe('Too Many Spaces');
		});

		it('collapses multiple dashes', () => {
			expect(titleToFilename('Dash--Dash')).toBe('Dash-Dash');
		});

		it('collapses dashes from multiple illegal chars', () => {
			expect(titleToFilename('A???B')).toBe('A-B');
		});
	});

	describe('trimming', () => {
		it('trims leading dashes', () => {
			expect(titleToFilename('---Title')).toBe('Title');
		});

		it('trims trailing dashes', () => {
			expect(titleToFilename('Title---')).toBe('Title');
		});

		it('trims leading spaces', () => {
			expect(titleToFilename('   Title')).toBe('Title');
		});

		it('trims trailing spaces', () => {
			expect(titleToFilename('Title   ')).toBe('Title');
		});
	});

	describe('truncation', () => {
		it('truncates to 200 characters', () => {
			const longTitle = 'A'.repeat(250);
			const result = titleToFilename(longTitle);
			expect(result.length).toBeLessThanOrEqual(200);
		});

		it('preserves titles under 200 characters', () => {
			const title = 'A'.repeat(199);
			expect(titleToFilename(title)).toBe(title);
		});

		it('trims trailing dash after truncation', () => {
			const title = 'A'.repeat(199) + ':';
			const result = titleToFilename(title);
			expect(result).not.toMatch(/-$/);
		});
	});

	describe('edge cases', () => {
		it('handles empty string', () => {
			expect(titleToFilename('')).toBe('');
		});

		it('handles string of only illegal chars', () => {
			expect(titleToFilename('???:::')).toBe('');
		});

		it('handles string with only spaces', () => {
			expect(titleToFilename('   ')).toBe('');
		});

		it('handles real-world example from spec', () => {
			expect(titleToFilename('My **Bold** Title: Part 1?')).toBe('My Bold Title- Part 1');
		});
	});
});
