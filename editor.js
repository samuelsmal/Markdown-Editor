/*
*	This is my go at a markdown editor.
*	It's heavily coupled with the corresponding php-Editor.
*	Mostly it follows the daringfireball syntax.
*	It escapes all characters to UTF-8.
*/

var block = {
	newline: /([\n]|[\r])+/
};

function Editor (parameters) {
	this.sourceField = document.getElementById(parameters['sourceField']);
	this.target = document.getElementById(parameters['target']);
	this.stringToParse = "";

	this.time_since_keyDown = 0;
}

Editor.prototype.updatePreview = function() {
	this.stringToParse = this.sourceField.value;

	this.preprocessor();
	this.doHeaders();
	this.doEmphasis();

	this.target.innerHTML = this.stringToParse;
};

Editor.prototype.preprocessor = function() {
	this.stringToParse = this.stringToParse
		.replace(/\r\n|\r/g, '\n')
		.replace(/\t/g, '    ')
		.replace(/\u00a0/g, ' ')
		.replace(/\u2424/g, '\n')
		.replace(/\\#/g, '&#35;');
};

Editor.prototype.doHeaders = function() {
	this.stringToParse = this.stringToParse
		.replace(/[^\\]#{3}([\w ]+?)#{3}|\n/g, '<h3>$1</h3>')
		.replace(/[^\\]#{2}([\w ]+?)#{2}|\n/g, '<h2>$1</h2>')
		.replace(/[^\\]#([\w ]+?)#|\n/g, '<h1>$1</h1>');
};

Editor.prototype.doEmphasis = function() {
	this.stringToParse = this.stringToParse
		.replace(/\*{2}(.+?)\*{2}/g, "<strong>$1</strong>")
		.replace(/\*(.+?)\*/g, "<em>$1</em>")
		.replace(/_{2}(.+?)_{2}/g, "<strong>$1</strong>")
		.replace(/_(.+?)_/g, "<em>$1</em>");
};

/* Setup */
function setup() {
	var parameters = {sourceField:'write',target:'preview'};
    var editor = new Editor(parameters);

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