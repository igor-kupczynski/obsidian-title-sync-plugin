/**
 * Extracts the first H1 header from markdown content, skipping frontmatter and code blocks.
 * Returns null if no H1 is found.
 */
export function extractFirstH1(content: string): string | null {
	const lines = content.split('\n');
	let inFrontmatter = false;
	let frontmatterEnded = false;
	let inCodeBlock = false;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmedLine = line.trim();

		// Handle frontmatter (only at the very start of the file)
		if (i === 0 && trimmedLine === '---') {
			inFrontmatter = true;
			continue;
		}

		if (inFrontmatter) {
			if (trimmedLine === '---' || trimmedLine === '...') {
				inFrontmatter = false;
				frontmatterEnded = true;
			}
			continue;
		}

		// Handle code blocks (fenced with ``` or ~~~)
		if (trimmedLine.startsWith('```') || trimmedLine.startsWith('~~~')) {
			inCodeBlock = !inCodeBlock;
			continue;
		}

		if (inCodeBlock) {
			continue;
		}

		// Look for H1 header (# at the start of line, followed by space)
		const h1Match = line.match(/^#\s+(.+)$/);
		if (h1Match) {
			return h1Match[1].trim();
		}
	}

	return null;
}

/**
 * Converts a markdown title to a valid filename.
 *
 * Transformation rules (in order):
 * 1. Strip markdown formatting (bold, italic, links)
 * 2. Replace illegal chars with dash
 * 3. Collapse multiple dashes/spaces
 * 4. Trim leading/trailing dashes and spaces
 * 5. Truncate to 200 chars
 */
export function titleToFilename(title: string): string {
	let result = title;

	// 1. Strip markdown formatting
	// Remove wiki-style links: [[link]] -> link, [[link|display]] -> display
	result = result.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2');
	result = result.replace(/\[\[([^\]]+)\]\]/g, '$1');

	// Remove markdown links: [text](url) -> text
	result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

	// Remove bold: **text** or __text__ -> text
	result = result.replace(/\*\*([^*]+)\*\*/g, '$1');
	result = result.replace(/__([^_]+)__/g, '$1');

	// Remove italic: *text* or _text_ -> text
	result = result.replace(/\*([^*]+)\*/g, '$1');
	result = result.replace(/_([^_]+)_/g, '$1');

	// Remove inline code: `code` -> code
	result = result.replace(/`([^`]+)`/g, '$1');

	// Remove strikethrough: ~~text~~ -> text
	result = result.replace(/~~([^~]+)~~/g, '$1');

	// Remove highlight: ==text== -> text
	result = result.replace(/==([^=]+)==/g, '$1');

	// 2. Replace illegal filename characters with dash
	// Illegal chars: * " \ / < > : | ? # ^ [ ]
	result = result.replace(/[*"\\/<>:|?#^[\]]/g, '-');

	// 3. Collapse multiple dashes and spaces
	result = result.replace(/[-\s]+/g, ' ');
	result = result.replace(/\s*-\s*/g, '-');
	result = result.replace(/-+/g, '-');
	result = result.replace(/\s+/g, ' ');

	// 4. Trim leading/trailing dashes and spaces
	result = result.replace(/^[-\s]+|[-\s]+$/g, '');

	// 5. Truncate to 200 chars
	if (result.length > 200) {
		result = result.substring(0, 200);
		// Trim any trailing dash or space from truncation
		result = result.replace(/[-\s]+$/, '');
	}

	return result;
}
