// Cinematic 3D Background for Kishore Medical
(function(){
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion) return;

  var canvas = document.getElementById('bg-canvas');
  if(!canvas) return;
  
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x061019, 0.045);

  var camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 14);

  // ---- Node field: a drifting molecular / synapse network ----
  var NODE_COUNT = 90;
  var nodes = [];
  var nodeGeo = new THREE.SphereGeometry(0.055, 10, 10);
  var nodeMat = new THREE.MeshBasicMaterial({ color: 0x4fd1c5, transparent:true, opacity:0.9 });
  var nodeGroup = new THREE.Group();

  for(var i=0;i<NODE_COUNT;i++){
    var mesh = new THREE.Mesh(nodeGeo, nodeMat);
    var radius = 9;
    var theta = Math.random()*Math.PI*2;
    var phi = Math.acos((Math.random()*2)-1);
    var r = radius * (0.35 + Math.random()*0.65);
    mesh.position.set(
      r*Math.sin(phi)*Math.cos(theta),
      r*Math.sin(phi)*Math.sin(theta)*0.6,
      r*Math.cos(phi)
    );
    mesh.userData = {
      basePos: mesh.position.clone(),
      speed: 0.15 + Math.random()*0.25,
      offset: Math.random()*Math.PI*2,
      driftAxis: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize()
    };
    nodes.push(mesh);
    nodeGroup.add(mesh);
  }
  scene.add(nodeGroup);

  // ---- Connective lines between nearby nodes (network / synapse look) ----
  var lineMat = new THREE.LineBasicMaterial({ color: 0x4fd1c5, transparent:true, opacity:0.18 });
  var lineGeo = new THREE.BufferGeometry();
  var maxLines = NODE_COUNT * 4;
  var linePositions = new Float32Array(maxLines * 2 * 3);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  var lineMesh = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lineMesh);

  function rebuildLines(){
    var idx = 0;
    var connectDist = 3.2;
    for(var i=0;i<nodes.length && idx < maxLines;i++){
      for(var j=i+1;j<nodes.length && idx < maxLines;j++){
        var d = nodes[i].position.distanceTo(nodes[j].position);
        if(d < connectDist){
          linePositions[idx*6+0] = nodes[i].position.x;
          linePositions[idx*6+1] = nodes[i].position.y;
          linePositions[idx*6+2] = nodes[i].position.z;
          linePositions[idx*6+3] = nodes[j].position.x;
          linePositions[idx*6+4] = nodes[j].position.y;
          linePositions[idx*6+5] = nodes[j].position.z;
          idx++;
        }
      }
    }
    lineGeo.setDrawRange(0, idx*2);
    lineGeo.attributes.position.needsUpdate = true;
  }

  // ---- Distant particle haze for depth ----
  var PARTICLES = 400;
  var pGeo = new THREE.BufferGeometry();
  var pPos = new Float32Array(PARTICLES*3);
  for(var p=0;p<PARTICLES;p++){
    pPos[p*3+0] = (Math.random()-0.5)*40;
    pPos[p*3+1] = (Math.random()-0.5)*40;
    pPos[p*3+2] = (Math.random()-0.5)*40 - 5;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  var pMat = new THREE.PointsMaterial({ color:0xa8f0e6, size:0.045, transparent:true, opacity:0.35 });
  var particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // ---- Soft key light glow via large sprite (cinematic bloom-ish feel without postprocessing) ----
  var glowCanvas = document.createElement('canvas');
  glowCanvas.width = 256; glowCanvas.height = 256;
  var gctx = glowCanvas.getContext('2d');
  var grad = gctx.createRadialGradient(128,128,0,128,128,128);
  grad.addColorStop(0, 'rgba(125,216,255,0.55)');
  grad.addColorStop(1, 'rgba(125,216,255,0)');
  gctx.fillStyle = grad;
  gctx.fillRect(0,0,256,256);
  var glowTex = new THREE.CanvasTexture(glowCanvas);
  var glowMat = new THREE.SpriteMaterial({ map: glowTex, transparent:true, depthWrite:false });
  var glowSprite = new THREE.Sprite(glowMat);
  glowSprite.scale.set(18,18,1);
  glowSprite.position.set(-3, 2, -6);
  scene.add(glowSprite);

  // ---- Mouse parallax ----
  var mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', function(e){
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  });

  var clock = new THREE.Clock();
  var frameSkip = 0;

  function animate(){
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();

    nodes.forEach(function(n){
      var d = n.userData;
      n.position.copy(d.basePos).addScaledVector(
        d.driftAxis,
        Math.sin(t*d.speed + d.offset) * 0.6
      );
    });

    // rebuild connective lines every few frames (perf)
    frameSkip++;
    if(frameSkip % 3 === 0) rebuildLines();

    nodeGroup.rotation.y = t * 0.035;
    nodeGroup.rotation.x = Math.sin(t*0.05) * 0.08;
    lineMesh.rotation.copy(nodeGroup.rotation);
    particles.rotation.y = t * 0.008;

    camera.position.x += (mouseX*1.2 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY*0.8 - camera.position.y) * 0.02;
    camera.lookAt(0,0,0);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
