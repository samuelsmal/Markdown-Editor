/*
*	This is my go at a markdown editor.
*	It's heavily coupled with the corresponding php-Editor.
*	Mostly it follows the daringfireball syntax.
*	It escapes all characters to UTF-8.
*
*	It's not build for speed - for now. All is done using RegEx. More an exercise for me.
*
*/

// TODO: Make preview as big as editor. If overlapping display at bottom of editor.

var Editor = function (parameters) {
	this.sourceField = document.getElementById(parameters['sourceField']);
	this.target = document.getElementById(parameters['target']);
	this.time_since_keyDown = 0;

	this.parser = new MarkdownParser();
}

Editor.prototype.updatePreview = function() {
	this.target.innerHTML = this.parser.parse(this.sourceField.value);
	console.clear();
};

/*
 *
 *	Helper functions
 *
 */

Editor.prototype.insertAtCaret = function(value) {
	//IE support
	if (document.selection) {
		this.sourceField.focus();
		sel = document.selection.createRange();
		sel.text = value;
		this.sourceField.focus();
	}
	//MOZILLA/NETSCAPE support
	else if (this.sourceField.selectionStart || this.sourceField.selectionStart == '0') {
		var startPos = this.sourceField.selectionStart,
			endPos = this.sourceField.selectionEnd,
			scrollTop = this.sourceField.scrollTop,
			first = this.sourceField.value.substring(0, startPos),
			second = this.sourceField.value.substring(endPos, this.sourceField.value.lenght);
		this.sourceField.value = first + value + second;
		this.sourceField.srollTop = scrollTop;
	} else {
		this.sourceField.value += value;
		this.sourceField.focus();
	}
};

Editor.prototype.getSelection = function() {
	var selectedText;
	// IE version
	if (document.selection !== undefined)
	{
		this.sourceField.focus();
		return document.selection.createRange().text;
	}
	// Mozilla version
	else if (this.sourceField.selectionStart !== undefined)
	{
		var startPos = this.sourceField.selectionStart;
		var endPos = this.sourceField.selectionEnd;
		return this.sourceField.value.substring(startPos, endPos);
	}
};

/*
 *
 *	UI functions
 *
 */


// FIX: add_anchor
Editor.prototype.add_anchor = function() {
	var ret_val = prompt("Enter an address:", "http://... title"),
		raw = ret_val.split(" "),
		href = (raw.length > 0) ? raw[0] : 'http://...',
		title = (raw.length > 1) ? raw[1] : 'title';

	for (var i = 2; i < raw.length; ++i) {
		title += ' ' + raw[i];
	}

	this.insertAtCaret('[' + title + '](' + href + ')');
	this.updatePreview();
};

Editor.prototype.add_italics = function() {
	var userSelection = this.getSelection();

	if (userSelection) {
		this.insertAtCaret('*' + this.getSelection() + '*');
	} else {
		this.insertAtCaret('*italics*');
	}

	this.updatePreview();
};

Editor.prototype.add_bold = function() {
	var userSelection = this.getSelection();

	if (userSelection) {
		this.insertAtCaret('**' + this.getSelection() + '**');
	} else {
		this.insertAtCaret('**bold**');
	}

	this.updatePreview();
};

// TODO: Needs to be able to handle multiline support.
Editor.prototype.add_quote = function() {
	var userSelection = this.getSelection();

	if (userSelection) {
		this.insertAtCaret('> ' + this.getSelection());
	} else {
		this.insertAtCaret('> Blockquote');
	}

	this.updatePreview();
};

Editor.prototype.add_enumerate = function() {
	var userSelection = this.getSelection();

	if (userSelection) {
		this.insertAtCaret('1. ' + this.getSelection());
	} else {
		this.insertAtCaret('1. \n2. ');
	}

	this.updatePreview();
};

Editor.prototype.add_itemize = function() {
	var userSelection = this.getSelection();

	if (userSelection) {
		this.insertAtCaret('* ' + this.getSelection());
	} else {
		this.insertAtCaret('* \n* ');
	}

	this.updatePreview();
};

Editor.prototype.add_code = function() {
	var userSelection = this.getSelection();

	if (userSelection) {
		this.insertAtCaret('    ' + this.getSelection());
	} else {
		this.insertAtCaret('     Code');
	}

	this.updatePreview();
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
    var callPreview = function () {
        editor.updatePreview();
    };

    window.onkeydown = function () {
        if (editor.time_since_keyDown) {
            clearTimeout(editor.time_since_keyDown);
            editor.time_since_keyDown = setTimeout(callPreview, 1000);
        } else {
            editor.time_since_keyDown = setTimeout(callPreview, 1000);
        }
    };

    // TODO: Add refocus.
    var callAnchor = function () {
		editor.add_anchor();
    },	callItalics = function () {
		editor.add_italics();
    },	callBold = function () {
    	editor.add_bold();
    },	callQuote = function () {
    	editor.add_quote();
    },	callEnumerate = function () {
    	editor.add_enumerate();
    },	callItemize = function () {
    	editor.add_itemize();
    },	callCode = function () {
    	editor.add_code();
    };

    document.getElementById('add_anchor_button').addEventListener('click', callAnchor, false);
    document.getElementById('add_italics_button').addEventListener('click', callItalics, false);
    document.getElementById('add_bold_button').addEventListener('click', callBold, false);
    document.getElementById('add_quote_button').addEventListener('click', callQuote, false);
    document.getElementById('add_enumerate_button').addEventListener('click', callEnumerate, false);
    document.getElementById('add_itemize_button').addEventListener('click', callItemize, false);
    document.getElementById('add_code_button').addEventListener('click', callCode, false);

}

window.onload = setup;