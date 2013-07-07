/*
*	This is my go at a markdown editor.
*	It's heavily coupled with the corresponding php-Editor.
*	Mostly it follows the daringfireball syntax.
*	It escapes all characters to UTF-8.
*
*	It's not build for speed - for now. All is done using RegEx. More an exercise for me.
*
*/

function Editor (parameters) {
	this.sourceField = document.getElementById(parameters['sourceField']);
	this.target = document.getElementById(parameters['target']);

	this.src = "";

	this.time_since_keyDown = 0;
}

Editor.prototype.updatePreview = function() {
	this.src = this.sourceField.value;

	this.preprocessor();

	this.doInline();
	this.doBlock();

	this.target.innerHTML = this.src;
	console.clear();
	console.log(this.src);
};

/*
 *
 *	Preprocessor.
 *	Removes uncessary bits and homogenizes the input.
 *
 */

Editor.prototype.preprocessor = function() {
	this.src = this.src
		.replace(/\r\n|\r/g, '\n')
		.replace(/\t/g, '    ')
		.replace(/\u00a0/g, ' ')
		.replace(/\u2424/g, '\n')
		.replace(/^ +/, '');
};

/*
 *
 *	Inline elements
 *
 */


Editor.prototype.doInline = function() {
	this.doEmphasis();
	this.doAnchors();
};

Editor.prototype.doEmphasis = function() {
	this.src = this.src
		.replace(/\*{2}(.+?)\*{2}/g, "<strong>$1</strong>")
		.replace(/\*(.+?)\*/g, "<em>$1</em>")
		.replace(/_{2}(.+?)_{2}/g, "<strong>$1</strong>")
		.replace(/_(.+?)_/g, "<em>$1</em>");
};

Editor.prototype.doAnchors = function() {
	this.src = this.src
		.replace(/\[([\S ]+?)\]\(([^ ]+?)\)/, '<a href="$2">$1</a>')
		.replace(/\[([\S ]+?)\]\(([^ ]+?) "([\S ]+?)"\)/, '<a href="$2" title="$3">$1</a>');
};

/*
 *
 *	Block elements
 *
 */

Editor.prototype.doBlock = function() {
	this.doHeaders();

	var lines = this.src.split('\n'),
		numberOfLines,
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
			structuredText += '</blockquote';

		} else if (/^\d+[^\\]\./.test(lines[i])) {
			// numbered list
			structuredText += '<ul>';
			while (i < numberOfLines && lines[i] !== "") {
				structuredText += '<li>' + lines[i++] + '</li>';
			}
			structuredText += '</ul>';

		} else if (!/<h[1-3]>/.test(lines[i])) {
			// paragraphs
			structuredText += '<p>';
			while (i < numberOfLines && lines[i] !== "") {
				structuredText += lines[i++];
				if (i + 1 < numberOfLines && lines[i+1] !== "") {structuredText += " ";}
			}
			structuredText += '</p>';
		} else {
			// header
			structuredText += lines[i++];
		}
	}

	this.src = structuredText;
};

Editor.prototype.doParagraphs = function(string) {
};

Editor.prototype.doHeaders = function() {
	this.src = this.src
		.replace(/#{3}([\S ]+?)[#{3}|\n]/g, '<h3>$1</h3>')
		.replace(/#{2}([\S ]+?)[#{2}|\n]/g, '<h2>$1</h2>')
		.replace(/#([\S ]+?)[#|\n]/g, '<h1>$1</h1>');
};

/*
 *
 *	Setup
 *
 */

function setup() {
	var parameters = {sourceField:'write',target:'preview'};
    var editor = new Editor(parameters);

    editor.updatePreview();

    // The callMethod function is necessary, since setTimeout calls a function in the global scope.
    var callMethod = function () {
        editor.updatePreview();
    };

    window.onkeydown = function () {
        if (editor.time_since_keyDown) {
            clearTimeout(editor.time_since_keyDown);
            editor.time_since_keyDown = setTimeout(callMethod, 1000);
        } else {
            editor.time_since_keyDown = setTimeout(callMethod, 1000);
        }
    };
}

window.onload = setup;