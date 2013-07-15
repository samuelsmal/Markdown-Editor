function MarkdownParser() {
	this.src = "";
}

MarkdownParser.prototype.parse = function(source) {
	this.src = source;

	this.preprocessor();

	this.doInline();
	this.doBlock();

	return this.src;
};

/*
 *
 *	Preprocessor.
 *	Removes uncessary bits and homogenizes the input.
 *
 */

MarkdownParser.prototype.preprocessor = function() {
	this.src = this.src
		.replace(/\r\n|\r/g, '\n')
		.replace(/\t/g, '    ')
		.replace(/\u00a0/g, ' ')
		.replace(/\u2424/g, '\n');
		//.replace(/^ +/, '');
};

/*
 *
 *	Inline elements
 *
 */

// TODO: Add underline functionality. <u>...</u>


MarkdownParser.prototype.doInline = function() {
	this.doEmphasis();
	this.doAnchors();
	this.doInlineCode();
};

MarkdownParser.prototype.doEmphasis = function() {
	this.src = this.src
		.replace(/\*{2}(.+?)\*{2}/g, "<strong>$1</strong>")
		.replace(/\*(.+?)\*/g, "<em>$1</em>")
		.replace(/_{2}(.+?)_{2}/g, "<strong>$1</strong>")
		.replace(/_(.+?)_/g, "<em>$1</em>");
};

MarkdownParser.prototype.doAnchors = function() {
	this.src = this.src
		.replace(/\[([\S ]+?)\]\(([^ ]+?)\)/, '<a href="$2">$1</a>')
		.replace(/\[([\S ]+?)\]\(([^ ]+?) "([\S ]+?)"\)/, '<a href="$2" title="$3">$1</a>');
};

MarkdownParser.prototype.doInlineCode = function() {
	this.src = this.src.replace(/`(.+?)`/g, '<code>$1</code>');
};

/*
 *
 *	Block elements
 *
 */

// TODO: Make lists only lists when there are multiple items. Otherwise ignore the command.

MarkdownParser.prototype.doBlock = function() {
	this.doHeaders();

	var lines = this.src.split('\n'),
		j,
		structuredText = "";

	for (var i = 0, numberOfLines = lines.length; i < numberOfLines; ) {

		if (lines[i] === "") {
			++i;
		} else if (/^>/.test(lines[i])) {
			// blockquote
			structuredText += '<blockquote>';
			while (i < numberOfLines && /^>/.test(lines[i])) {
				structuredText += lines[i++].replace(/^>\s*/, '') + ' ';
			}
			structuredText += '</blockquote>';

		} else if (/^\d+\./.test(lines[i])) {
			// numbered list
			structuredText += '<ol>';
			while (i < numberOfLines && lines[i]) {
				structuredText += '<li>' + lines[i++].replace(/^\d+\.\s*/, '');

				// for multiple paragraphs
				while(i < numberOfLines && lines[i] && !/^\d+\./.test(lines[i])) {
					structuredText += lines[i++];
				}
				structuredText += '</li>';
			}
			structuredText += '</ol>';

		} else if (/^\*[^\\]/.test(lines[i])) {
			// bulleted list
			structuredText += '<ul>';
			while (i < numberOfLines && lines[i]) {
				structuredText += '<li>' + lines[i++].replace(/^\*\s*/, '');

				// for multiple paragraphs
				while (i < numberOfLines && lines[i] && !/^\*[^\\]/.test(lines[i])) {
					structuredText += lines[i++];
				}
				structuredText += '</li>';
			}
			structuredText += '</ul>';

		} else if (/^ {4}/.test(lines[i])) {
			// code block
			structuredText += '<pre><code>';

			while (i < numberOfLines && /^ {4}/.test(lines[i])) {
				structuredText += lines[i++].replace(/^ {4}/, '');
				if (i + 1 < numberOfLines && lines[i + 1]) structuredText += '\n\r';
			}

			structuredText += '</pre></code>';

		} else if (!/<h[1-3]>/.test(lines[i])) {
			// paragraphs
			j = i;
			while (j + 1 < numberOfLines && lines[j + 1]) ++j;

			structuredText += '<p>' + this.doParagraphs(lines, i, j) + '</p>';

			i = j + 1;
		}  else {
			// header
			structuredText += lines[i++];
		}
	}

	this.src = structuredText;
};

MarkdownParser.prototype.doParagraphs = function(stringArray, begin, end) {
	var sol = "";

	while (begin < end) {
		sol += stringArray[begin++] + " ";
	}

	sol += stringArray[end];

	return sol;
};

MarkdownParser.prototype.doHeaders = function() {
	this.src = this.src
		.replace(/#{3} *([\S\d ]+) *[#{3}|\n]/g, '<h3>$1</h3>')
		.replace(/#{2} *([\S\d ]+) *[#{2}|\n]/g, '<h2>$1</h2>')
		.replace(/# *([\S\d ]+) *[#|\n]/g, '<h1>$1</h1>');
};