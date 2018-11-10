/*
 * @author zz85 / https://github.com/zz85
 * @author mrdoob / http://mrdoob.com
 * Running this will allow you to drag three.js objects around the screen.
 */

THREE.InteractControls = function ( _objects, _camera, _domElement ) {

	if ( _objects instanceof THREE.Camera ) {

		console.warn( 'THREE.InteractControls: Constructor now expects ( objects, camera, domElement )' );
		var temp = _objects; _objects = _camera; _camera = temp;

	}

	var _plane = new THREE.Plane();
	var _raycaster = new THREE.Raycaster();

	var _mouse = new THREE.Vector2();
	var _offset = new THREE.Vector3();
	var _intersection = new THREE.Vector3();

	//

	var scope = this;

	function activate() {

		_domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
		_domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
		_domElement.addEventListener( 'touchmove', onDocumentTouchMove, false );
		_domElement.addEventListener( 'touchend', onDocumentTouchStart, false );

	}

	function deactivate() {

		_domElement.removeEventListener( 'mousemove', onDocumentMouseMove, false );
		_domElement.removeEventListener( 'mouseup', onDocumentMouseUp, false );
		_domElement.removeEventListener( 'touchmove', onDocumentTouchMove, false );
		_domElement.removeEventListener( 'touchend', onDocumentTouchStart, false );

	}

	function dispose() {

		deactivate();

	}

	function onDocumentMouseMove( event ) {

		event.preventDefault();

		var rect = _domElement.getBoundingClientRect();

		_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
		_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

	}

	function onDocumentMouseUp( event ) {

		event.preventDefault();

		_raycaster.setFromCamera( _mouse, _camera );

		var intersects = _raycaster.intersectObjects( _objects );

		if ( intersects.length > 0 ) 
		{
			var tappedObj = intersects[ 0 ].object;
			if(tappedObj.visible)
			{
				scope.dispatchEvent( { type: 'tapped', object: tappedObj } );
			}
		}


	}

	function onDocumentTouchMove( event ) {

		event.preventDefault();
		event = event.changedTouches[ 0 ];

		var rect = _domElement.getBoundingClientRect();

		_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
		_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
	}

	function onDocumentTouchStart( event ) {

		event.preventDefault();
		event = event.changedTouches[ 0 ];

		var rect = _domElement.getBoundingClientRect();

		_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
		_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

		_raycaster.setFromCamera( _mouse, _camera );

		var intersects = _raycaster.intersectObjects( _objects );

		if ( intersects.length > 0 ) 
		{
			var tappedObj = intersects[ 0 ].object;
			if(tappedObj.visible)
			{
				scope.dispatchEvent( { type: 'tapped', object: tappedObj } );
			}
		}


	}

	activate();

	// API

	this.enabled = true;

	this.activate = activate;
	this.deactivate = deactivate;
	this.dispose = dispose;

	// Backward compatibility

	this.setObjects = function () {

		console.error( 'THREE.InteractControls: setObjects() has been removed.' );

	};

	this.on = function ( type, listener ) {

		console.warn( 'THREE.InteractControls: on() has been deprecated. Use addEventListener() instead.' );
		scope.addEventListener( type, listener );

	};

	this.off = function ( type, listener ) {

		console.warn( 'THREE.InteractControls: off() has been deprecated. Use removeEventListener() instead.' );
		scope.removeEventListener( type, listener );

	};

	this.notify = function ( type ) {

		console.error( 'THREE.InteractControls: notify() has been deprecated. Use dispatchEvent() instead.' );
		scope.dispatchEvent( { type: type } );

	};

};

THREE.InteractControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.InteractControls.prototype.constructor = THREE.InteractControls;
