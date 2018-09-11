var renderer,
    scene,
    camera,
    container;

var arSource,
    arContext,
    arMarker = [];

var 
    mesh;

init();

function init(){



    container = document.getElementById('container');

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0px'
    renderer.domElement.style.left = '0px'

    scene = new THREE.Scene();
    camera = new THREE.Camera();

    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);
    scene.add(camera);
    scene.visible = false;


    mesh = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({
        color: 0xFF00FF,
        transparent: true,
        opacity: 0.5
    }));
    scene.add(mesh);





    arSource = new THREEx.ArToolkitSource({
        sourceType : 'webcam',
    });

    arContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'data/data/camera_para.dat',
        detectionMode: 'mono',
        maxDetectionRate: 30,
        canvasWidth: 80*3,
        canvasHeight: 60*3,
    });

    arMarker[0] = new THREEx.ArMarkerControls(arContext, camera, {
        type : 'pattern',
        patternUrl : 'data/data/hand-marker-3.patt',
        changeMatrixMode: 'cameraTransformMatrix'
    });





    /* handle */
    arSource.init(function(){
        arSource.onResize();
        arSource.copySizeTo(renderer.domElement);

        if(arContext.arController !== null) arSource.copySizeTo(arContext.arController.canvas);

    });

    // handle resize
    window.addEventListener('resize', function(){
        onResize()
    })
    function onResize(){
        arToolkitSource.onResize()  
        arToolkitSource.copySizeTo(renderer.domElement) 
        if( arToolkitContext.arController !== null ){
            arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)    
        }   
    }

    arContext.init(function onCompleted(){
        
        camera.projectionMatrix.copy(arContext.getProjectionMatrix());

    });


    render();   
    
}   




function render(){
    requestAnimationFrame(render);
    renderer.render(scene,camera);                

    if(arSource.ready === false) return;

    arContext.update(arSource.domElement);
    scene.visible = camera.visible;


    

} 