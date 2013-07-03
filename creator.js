function Creator (parameters) {
    this.sourceField = document.getElementById(parameters['sourceField']);
    this.target = document.getElementById(parameters['target']);

    this.source = "";
    this.lines;

    this.time_since_keyDown = 0;
}

Creator.prototype.updatePreview = function() {
    this.source = this.sourceField.value;

    this.lines = this.source.split('\n');
    console.log(this.lines);
};


function setup() {
	var parameters = {sourceField:'write',target:'preview'};
    var editor = new Creator(parameters);

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