var sd = new Date().getTime();
var stats = new Stats();

window.onload = function() {
	stats.domElement.style.position = "absolute";
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );
	
	initVars();
}

var scene, camera, wuzCam, renderer;
var ground;
var c = 0;


function initVars() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 65, 4/3, 0.1, 1000 );
	wuzCam = new WUZZIE.PerspectiveCamera( camera, document.getElementById("mainCanvas") );
	renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("mainCanvas") });
	renderer.setClearColor( 0xffffff, 1 );
	
	initWorld();
}

function initWorld() {
	ground = new THREE.Mesh(new THREE.PlaneGeometry( 50, 50, 16, 16 ),
							new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true } )
	);
	
	scene.add( ground );
	scene.add( wuzCam.getObject() );
	ground.rotation.x = -(Math.PI / 2);
	ground.position.set( 0, -1, -5 );
	
	render();
	
	var fd = new Date().getTime();
	console.log( "init speed: " + ( fd - sd ) + " ms" );
}

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
	wuzCam.updateMovement();
	stats.update();
}