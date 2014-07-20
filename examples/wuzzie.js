var WUZZIE = { 
	VERSION: "1.0.1"
};

WUZZIE.PerspectiveCamera = function( camera, canvas ) {
		this._camera = camera;
		this._canvas = canvas;
		this._pitchObject = new THREE.Object3D();
		this._yawObject = new THREE.Object3D();
		this.init();
}

WUZZIE.PerspectiveCamera.prototype = {
	
	init: function() {	
		this.charSettings = {
			speed_default: 0.1,
			speed_sprint: 0.4,
			speed: 0.1,
			sensitivity_default: 0.002,
			sensitivity: 0.002
		}
	
		this.bindlist = {
			forward: 87,
			back: 83,
			left: 65,
			right: 68,
			up: 32,
			down: 67,
			shift: 16
		};
		
		this.controls = {
			forward: false,
			back: false,
			left: false,
			right: false,
			up: false,
			down: false,
			shift: false
		};
		
		this.keyMap = {
			q: 81,
			w: 87,
			e: 69,
			r: 82,
			t: 84,
			y: 89,
			u: 85,
			i: 73,
			o: 79,
			p: 80,
			a: 65,
			s: 83,
			d: 68,
			f: 70,
			g: 71,
			h: 72,
			j: 74,
			k: 75,
			l: 76,
			z: 90,
			x: 88,
			c: 67,
			v: 86,
			b: 66,
			n: 78,
			m: 77,
			0: 48,
			1: 49,
			2: 50,
			3: 51,
			4: 52,
			5: 53,
			6: 54,
			7: 55,
			8: 56,
			9: 57,
			" ": 32,
			shift: 16
		};
		
		this.handlers = {
			inputMouseMoveHandler: this.inputMouseMove.bind( this ),
			inputDownHandler: this.inputDown.bind( this ),
			inputUpHandler: this.inputUp.bind( this )
		}
		
		this.createPointerLockObjects();
		this.checkPointerLock();
	},
	
	bind: function( control, key ) {
		//control = the name of the action (forward/back/etc) - key = key to be pressed on the keyboard (spacebar etc)
		//this needs to be changed to an event listener using the id of an input box and then a keyCode when a key is pressed for it.
		if ( this.keyMap.hasOwnProperty( key ) === true ) {
			this.bindlist[ control ] = this.keyMap[ key ];
		} else {
			alert( "That key is not allowed or not yet implemented to be used." );
		}
	},
	
	bindLookupCode: function( key ) {	
		if ( this.keyMap.hasOwnProperty( key ) === true ) {
			return this.keyMap[ key ];
		}
	},
	
	bindLookupKey: function( code ) {
		for ( i in this.keyMap ) {
			if ( this.keyMap[ i ] === code ) {
				return i;
			}
		}
	},
	
	checkPointerLock: function() {
		var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
		if ( havePointerLock === false ) {
			alert("Pointer Lock API is not supported in your browser - check your browser version");
		} else {
			this.initConstantListeners()
		}
	},
	
	initConstantListeners: function() {
		this._canvas.addEventListener( "click", this.enablePointerLock.bind( this ) );
		document.addEventListener( "pointerlockchange", this.checkPointerLockState.bind( this ) );
		document.addEventListener( "mozpointerlockchange", this.checkPointerLockState.bind( this ) );
		document.addEventListener( "webkitpointerlockchange", this.checkPointerLockState.bind( this ) );
		document.addEventListener('pointerlockerror', function(){ console.log("Pointer Lock Error event fired") } );
		document.addEventListener('mozpointerlockerror', function(){ console.log("Pointer Lock Error event fired") } );
		document.addEventListener('webkitpointerlockerror', function(){ console.log("Pointer Lock Error event fired") } );
	},
	
	checkPointerLockState: function( e ) {
		if ( document.pointerLockElement === this._canvas || document.mozPointerLockElement === this._canvas || document.webkitPointerLockElement === this._canvas ) {
			document.addEventListener( "mousemove", this.handlers.inputMouseMoveHandler );
			document.addEventListener( "keydown", this.handlers.inputDownHandler );
			document.addEventListener( "keyup", this.handlers.inputUpHandler );
		} else {
			document.removeEventListener( "mousemove", this.handlers.inputMouseMoveHandler );
			document.removeEventListener( "keydown", this.handlers.inputDownHandler );
			document.removeEventListener( "keyup", this.handlers.inputUpHandler );
		}
	},
	
	enablePointerLock: function( e ) {
		e.target.requestPointerLock = e.target.requestPointerLock || e.target.mozRequestPointerLock || e.target.webkitRequestPointerLock;
		e.target.requestPointerLock()
	},
	
	inputMouseMove: function( e ) {
		var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0,
			movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
		console.log("Logging (movementX, movementY): (", movementX, ", ", movementY, ")");
		this._yawObject.rotation.y -= movementX * this.charSettings.sensitivity;
		this._pitchObject.rotation.x -= movementY * this.charSettings.sensitivity;
		this._pitchObject.rotation.x = Math.max( -Math.PI/2, Math.min( Math.PI/2, this._pitchObject.rotation.x ) );
	},
	
	createPointerLockObjects: function(){
		this._pitchObject.add( this._camera );
		this._yawObject.add( this._pitchObject );
	},
	
	getObject: function(){
		return this._yawObject;
	},
	
	inputDown: function( e ) {
		switch( e.keyCode ) {
		case this.bindlist.forward:
			this.controls.forward = true;
			break;
		case this.bindlist.back:
			this.controls.back = true;
			break;
		case this.bindlist.left:
			this.controls.left = true;
			break;
		case this.bindlist.right:
			this.controls.right = true;
			break;
		case this.bindlist.up:
			this.controls.up = true;
			break;
		case this.bindlist.down:
			this.controls.down = true;
			break;
		case this.bindlist.shift:
			this.charSettings.speed = this.charSettings.speed_sprint;
			break;
		}
	},
	
	inputUp: function( e ) {
		switch( e.keyCode ) {
		case this.bindlist.forward:
			this.controls.forward = false;
			break;
		case this.bindlist.back:
			this.controls.back = false;
			break;
		case this.bindlist.left:
			this.controls.left = false;
			break;
		case this.bindlist.right:
			this.controls.right = false;
			break;
		case this.bindlist.up:
			this.controls.up = false;
			break;
		case this.bindlist.down:
			this.controls.down = false;
			break;
		case this.bindlist.shift:
			this.charSettings.speed = this.charSettings.speed_default;
			break;
		}
	},
	
	updateMovement: function(){
		if ( this.controls.forward == true ) {
			this._yawObject.translateZ( -this.charSettings.speed );
		}
		if ( this.controls.back == true ) {
			this._yawObject.translateZ( this.charSettings.speed * 0.5 );
		}
		if ( this.controls.left == true ) {
			this._yawObject.translateX( -this.charSettings.speed * 0.8 );
		}
		if ( this.controls.right == true ) {
			this._yawObject.translateX( this.charSettings.speed * 0.8 );
		}
		if ( this.controls.up == true ) {
			this._yawObject.position.y += this.charSettings.speed;
		}
		if ( this.controls.down == true ) {
			this._yawObject.position.y -= this.charSettings.speed;
		}
	}
}































