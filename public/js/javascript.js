var socket = new WebSocket("ws://app-lovingwebsockets.rhcloud.com:8000/");
var remoteShips = [];
var remoteProjectiles = [];

socket.on("connect", onSocketConnected);
socket.on("disconnect", onSocketDisconnect);
socket.on("new player", onNewPlayer);
socket.on("update player", onUpdatePlayer);
socket.on("remove player", onRemovePlayer);


var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};


var scene = new THREE.Scene();
var sceneCSS = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 55, window.innerWidth/window.innerHeight, 0.1, 30000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
//renderer.setClearColor( 0xffffff, 0);
document.body.appendChild( renderer.domElement );


var light = new THREE.DirectionalLight(0xf6e86d, 1);
light.position.set(0.4, 100, 2);
scene.add(light);

var lightGlobal = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1);
scene.add( lightGlobal );

var geometryBox = new THREE.BoxGeometry( 1, 1, 1);
var materialBox = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );

var geometrySphere = new THREE.SphereGeometry( 0.2, 64, 64 );
var materialSphere = new THREE.MeshBasicMaterial( { color: 0xCC0000 } );

function randomNumber(MAX, MIN){
	var number = Math.floor((Math.random() * MAX) + MIN);
	return number;
};

var cube = new Ship( geometryBox, materialBox );
cube.receiveShadow = true;
cube.castShadow = true;
cube.setSpeed(1);
cube.add(camera);
cube.position.y = 1;
scene.add( cube );
camera.position.y = 2;
camera.position.z = 4;
camera.lookAt(cube);


var geoFloor = new THREE.BoxGeometry( 20, 1, 20);
var matFloor = new THREE.MeshLambertMaterial( { color: 0x0000ff } );

var floor = new THREE.Mesh( geoFloor, matFloor );
floor.receiveShadow = true;
floor.castShadow = true;
scene.add( floor );
 

/* var loader = new THREE.JSONLoader(); // init the loader util

loader.load('models/fighter.json', function (geometry) {
  // create a new material
  var material = new THREE.MeshLambertMaterial( { color: 0xCCCCCC } );
  
  tempGeo = geometry;
  tempMat = material;
  cube.geometry = geometry;
  cube.material = material;
  
});

loader.load('models/station.json', function (geometry) {
  // create a new material
  var material = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture('/img/stationTexture.jpg'),  // specify and load the texture
  });
  
  // create a mesh with models geometry and material
  

  stationMesh.geometry = geometry;
  stationMesh.material = material;
});

var skybox;

function loadSkybox(){
	var urls = [
	  'img/box_right1.jpg',
	  'img/box_left2.jpg',
	  'img/box_top3.jpg',
	  'img/box_bottom4.jpg',
	  'img/box_front5.jpg',
	  'img/box_back6.jpg'
	];

	var cubemap = THREE.ImageUtils.loadTextureCube(urls); // load textures
	cubemap.format = THREE.RGBFormat;

	var shader = THREE.ShaderLib['cube']; // init cube shader from built-in lib
	shader.uniforms['tCube'].value = cubemap; // apply textures to shader

	// create shader material
	var skyBoxMaterial = new THREE.ShaderMaterial( {
	  fragmentShader: shader.fragmentShader,
	  vertexShader: shader.vertexShader,
	  uniforms: shader.uniforms,
	  depthWrite: false,
	  side: THREE.BackSide
	});

	// create skybox mesh
	skybox = new THREE.Mesh(
	  new THREE.CubeGeometry(1000, 1000, 1000),
	  skyBoxMaterial
	);
	skybox.renderOrder = -1;
	scene.add(skybox);

}

if(!isMobile.any()){
	loadSkybox();
} */

/* var label = document.createElement( 'p' );
label.className = 'playerTag';
label.textContent = "THREE.JS";
labelObject = new THREE.CSS3DObject( label );
labelObject.scale.set(0.1, 0.1, 0.1)
sceneCSS.add(labelObject);
 */

var keysDown = [];
addEventListener("keydown", function (e) {
			keysDown[e.keyCode] = true;
		});

		addEventListener("keyup", function (e) {
			delete keysDown[e.keyCode];
		});
		
document.addEventListener("mousemove", function(e) {
		cube.rotateY (e.movementX * 0.01 *(-1));
		/* if(e.movementY > 0.5 && camera.position.y < 2){
			camera.position.y += 0.01;
		}
		if(e.movementY < -0.5 && camera.position.y > -1){
			camera.position.y -= 0.01;
		}
		if(e.movementX > 0.5 && camera.position.x < 2){
			camera.position.x += 0.01;
		}
		if(e.movementX < -0.5 && camera.position.x > -2){
			camera.position.x -= 0.01;
		}
		 */
		/* if(e.movementX > 0.5){
			//cube.rotateY(-0.005);
			cube.rotateZ(-0.005);
		}
		if(e.movementX < -0.5){
			//cube.rotateY(0.005);
			cube.rotateZ(0.005);
		}
		if(e.movementY > 0.5){
			cube.rotateX(0.005);
		}
		if(e.movementY < -0.5){
			cube.rotateX(-0.005);
		} */
		
});

document.getElementsByTagName("canvas")[0].addEventListener("click", function() {
	this.requestPointerLock();
}, false);


var render = function () {
	requestAnimationFrame( render );
	getInput();
	socket.emit("update player", {playerMatrix: cube.matrix});
	updateHUD();
	renderer.render(scene, camera);
};


function updateHUD(){
	$("#healthText").text("Health: " + "%");
	$("#infoText").text("X: " + Math.floor(cube.position.x));
	$("#infoText2").text("Y: " + Math.floor(cube.position.y));
	$("#infoText3").text("Z: " + Math.floor(cube.position.z));
}

function getInput(){
	if ("87" in keysDown){// W
		cube.move(0, 0, -1);
	}
	if ("65" in keysDown){// A
		cube.move(-1, 0, 0);
	}
	if ("83" in keysDown){// S
		cube.move(0, 0, 1);
	}
	if ("68" in keysDown){// D
		cube.move(1, 0, 0);
	}
	if ("81" in keysDown){// Q
		cube.rotateZ(0.05);
	}
	if ("69" in keysDown){// E
		cube.rotateZ(-0.05);
	}
	if ("16" in keysDown){// SHIFT
		cube.setSpeed(5);
	}
	else{
		
	}
}

window.onload = function() {
  var gui = new dat.GUI();
  gui.add(cube, 'speed', 0, 10);
};


function onSocketConnected() {
	console.log("scoket connected (client)");
	console.log("cube get id: " + cube.getPlayerID());
	socket.emit("new player", {id: cube.id, playerMatrix: cube.matrix});
}
function onSocketDisconnect(data) {
    console.log("Disconnected from socket server: " + data.id);
};

function onNewPlayer(data) {
    console.log("New player connected: "+data.id);
	var newShip = new Ship(geometryBox, materialBox);
	newShip.id = data.id;
	newShip.matrixAutoUpdate = false;
	newShip.matrix = data.playerMatrix;
	scene.add(newShip);

	remoteShips.push(newShip);
};

function onUpdatePlayer(data) {	
	var moveShip = shipById(data.id);
	moveShip.matrix = data.playerMatrix;
};

function onRemovePlayer(data){
	var removePlayer = shipById(data.id);
	console.log("remove player (clinet)");

	if (!removePlayer) {
		console.log("Player not found remove (client): "+data.id);
		return;
	};
	
	scene.remove(removePlayer);
	remoteShips.splice(remoteShips.indexOf(removePlayer), 1);
}

function shipById(id) {
    var i;
    for (i = 0; i < remoteShips.length; i++) {
        if (remoteShips[i].id == id)
			console.log("SUCCESS");
            return remoteShips[i];
    };
	console.log("FAILURE");
    return 0;
};

function projectileById(id) {
    var i;
    for (i = 0; i < remoteProjectiles.length; i++) {
        if (remoteProjectiles[i].id == id)
			console.log("SUCCESS");
            return remoteProjectiles[i];
    };
	console.log("FAILURE");
    return 0;
};

render();