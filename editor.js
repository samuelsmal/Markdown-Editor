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

function Editor (parameters) {
	this.sourceField = document.getElementById(parameters['sourceField']);
	this.target = document.getElementById(parameters['target']);
	this.time_since_keyDown = 0;

	this.parser = new MarkdownParser();

	var self = this;
	this.anchorPopup = new Popup(function(data) {self.add_anchor(data);});
}

Editor.prototype.updatePreview = function() {
	this.target.innerHTML = this.parser.parse(this.sourceField.value);
	// console.clear();
};

Editor.prototype.adjustPreview = function() {
	if (this.sourceField.offsetWidth >= window.innerWidth / 2) {
		this.target.style.clear = 'both';
		this.target.style.width = this.sourceField.offsetWidth + 'px';
	} else {
		this.target.style.float = 'left';
		this.target.style.width = (window.innerWidth - this.sourceField.offsetWidth - 10) + 'px';
		this.target.style.height = this.sourceField.offsetHeight + 'px';
	}
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
Editor.prototype.add_anchor = function(data) {
	this.insertAtCaret('[' + data.title + '](' + data.href + ')');
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
    editor.adjustPreview();

    // TODO: Add refocus.


    addEvent(window, 'keydown', function () {
        if (editor.time_since_keyDown) {
            clearTimeout(editor.time_since_keyDown);
            editor.time_since_keyDown = setTimeout(function () {
				editor.updatePreview();
			}, 1000);
        } else {
            editor.time_since_keyDown = setTimeout(function () {
				editor.updatePreview();
			}, 1000);
        }
    });

    addEvent(document.getElementById('add_anchor_button'), 'click', function () {
    	editor.anchorPopup.toggleDisplay();
    	// editor.add_anchor();
    });
    addEvent(document.getElementById('add_italics_button'), 'click', function () {
    	editor.add_italics();
    });
    addEvent(document.getElementById('add_bold_button'), 'click', function () {
    	editor.add_bold();
    });
    addEvent(document.getElementById('add_quote_button'), 'click', function () {
    	editor.add_quote();
    });
    addEvent(document.getElementById('add_enumerate_button'), 'click', function () {
    	editor.add_enumerate();
    });
    addEvent(document.getElementById('add_itemize_button'), 'click', function () {
    	editor.add_itemize();
    });
    addEvent(document.getElementById('add_code_button'), 'click', function () {
    	editor.add_code();
    });

    // Expensive...
    addEvent(editor.sourceField, 'mousemove', function () {
    	editor.adjustPreview();
    });
}

function addEvent(element, event, fn) {
	if (element.addEventListener)
		element.addEventListener(event, fn, false);
	else if (element.attachEvent)
		element.attachEvent('on' + event, fn);
}

addEvent(window, 'load', setup);