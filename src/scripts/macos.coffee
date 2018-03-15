noVNC = require 'novnc-node'

fetch('http://35.194.80.84/session').then (res) ->
	console.log(res)
	

socket = new WebSocket('ws://35.194.80.84/socket')

onVNCCopyCut = (rfb, text) ->
	return

onUpdateState = (rfb, state, oldstate, msg) ->
	console.log(rfb, state, oldstate, msg)
	return

onFBUComplete = (rfb, fbu) ->
	rfb.setDesktopSize(680, 480)
	rfb.set_onFBUComplete(() -> {})


rfb = new noVNC.RFB({
	'target': document.getElementById('noVNC_canvas'),
	'encrypt':      true,
	'repeaterID':   '',
	'true_color':   true,
	'local_cursor': true,
	'shared':       true,
	'view_only':    false,
	'onUpdateState':  onUpdateState,
	'onClipboard':    onVNCCopyCut,
	'onFBUComplete':  onFBUComplete
});

rfb.sendPassword("secret");

rfb.connect("ws://35.194.80.84/websockify", "secret");
