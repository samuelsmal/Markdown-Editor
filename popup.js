// TODO: Move style more to an css-file.

function Popup (_callback) {
	this.callback = _callback;
	this.backgroundElement = new BackgroundElement();
	this.popupElement = new PopupElement(this.backgroundElement.el);

	this.hrefElement = new InputElement('href: ', 'anchor_href', 'text', this.popupElement.el);
	this.titleElement = new InputElement('Title: ', 'anchor_title', 'text', this.popupElement.el);
	this.textElement = new InputElement('Text: ', 'anchor_text', 'text', this.popupElement.el);

	var self = this;
	this.submitButton = new Button('OK', 'btn', function() {self.closePositiv();}, this.popupElement.el);
	this.cancelButton = new Button('Cancel', 'btn', function () {self.toggleDisplay();}, this.popupElement.el);

}

Popup.prototype.toggleDisplay = function() {
	this.backgroundElement.el.style.display = (this.backgroundElement.el.style.display === 'block') ? 'none' : 'block';
};

Popup.prototype.closePositiv = function() {
	var data = {};

	data.href = this.hrefElement.getValue();
	data.title = this.titleElement.getValue();
	data.text = this.textElement.getValue();

	this.callback(data);
	this.toggleDisplay();
};

Popup.prototype.closeNegativ = function() {

	this.toggleDisplay();
};

function Button (_text, _cssClass, _callback, _parent) {
	this.el = document.createElement('button');

	this.el.class = _cssClass;

	this.el.innerHTML = _text;
	addEvent(this.el, 'click', _callback);

	_parent.appendChild(this.el);
}

function PopupElement (_parent) {
	this.el = document.createElement('div');

	this.parent = _parent;

	this.el.style.width = '200px';
	this.el.style.backgroundColor = 'white';
	this.el.style.position = 'absolute';
	this.el.style.top = '50%';
	this.el.style.left = '50%';

	this.parent.appendChild(this.el);
	// this.popupElement.appendChild(this.inputElement);
}

function BackgroundElement () {
	this.el = document.createElement('div');

	this.el.style.display = 'none';
	this.el.style.width = window.innerWidth + 'px';
	this.el.style.height = window.innerHeight + 'px';
	this.el.style.backgroundColor = 'rgba(217, 217, 217, 0.5)';
	this.el.style.position = 'absolute';
	this.el.style.top = '0';
	this.el.style.left = '0';

	document.body.appendChild(this.el);
}

function InputElement (_text, _name, _type, _parent) {
	this.name = _name;
	this.parent = _parent;
	this.type = _type;

	this.label = document.createElement('label');
	this.label.innerHTML = _text;

	this.el = document.createElement('input');

	this.el.id = _name;
	this.el.name = _name;
	this.el.type = _type;

	this.parent.appendChild(this.label);
	this.parent.appendChild(this.el);
}

InputElement.prototype.getValue = function() {
	return this.el.value;
};
