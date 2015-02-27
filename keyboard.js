var Keyboard = function()
{
	var self = this;
	
	window.addEventListener('keydown', function(evt) { self.onKeyDown(evt); }, false);
	window.addEventListener('keyup', function(evt) { self.onKeyUp(evt); }, false);
	
	this.keyListeners = new Array();
	this.keys = new Array();
	
	// Key constants. Go here for a list of key codes:
	// https://developer.mozilla.org/en-US/docs/DOM/KeyboardEvent
	
	this.KEY_SPACE = 32;
	this.KEY_LEFT = 37;
	this.KEY_UP = 38;
	this.KEY_RIGHT = 39;
	this.KEY_DOWN = 40;
	
	this.KEY_A = 65;
	this.KEY_D = 68;
	this.KEY_S = 83;
	this.KEY_W = 87;
	this.KEY_SHIFT = 16;
	
	this.Digit1			= 49
	this.Digit2			= 50
	this.Digit3			= 51
	this.Digit4			= 52
	this.Digit5			= 53
	this.Digit6			= 54
	this.Digit7			= 55
	this.Digit8			= 56
	this.Digit9			= 57
	this.Digit0			= 48
	this.KeyA			= 65
	this.KeyB			= 66
	this.KeyC			= 67
	this.KeyD			= 68
	this.KeyE			= 69
	this.KeyF			= 70
	this.KeyG			= 71
	this.KeyH			= 72
	this.KeyI			= 73
	this.KeyJ			= 74
	this.KeyK			= 75
	this.KeyL			= 76
	this.KeyM			= 77
	this.KeyN			= 78
	this.KeyO			= 79
	this.KeyP			= 80
	this.KeyQ			= 81
	this.KeyR			= 82
	this.KeyS			= 83
	this.KeyT			= 84
	this.KeyU			= 85
	this.KeyV			= 86
	this.KeyW			= 87
	this.KeyX			= 88
	this.KeyY			= 89
	this.KeyZ			= 90	
	this.Comma			= 188
	this.Period			= 190
	this.Semicolon		= 186
	this.Quote			= 222
	this.BracketLeft	= 219
	this.BracketRight	= 221
	this.Backquote		= 192
	this.Backslash		= 220
	this.Minuse			= 189
	this.Equal			= 187
	
}