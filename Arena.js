
let canvas;
let gl;
const TIME_LIMIT = 10;

let near = -100;
let far = 200;
let left = -100.0;
let right = 100.0;
let ytop = 100.0;
let bottom = -100.0;

let timelimit = 60;
let timegone = 0;
let timer;
let shootable = true;
let runningGame = false;
let score = 0;
let scoreText = document.querySelector("#userscore");

let radius = 40.0;
let theta = 0.0;
let phi = 0.0;
let rotation_by_5_deg = 5.0 * Math.PI / 180.0;

let done = false;
let at = vec3(0.0, 0.0, 0.0);
let up = vec3(0.0, 1.0, 0.0);

let uniformModelView, uniformProjection;
let modelViewMatrix, projectionMatrix;
let uniformColor;

let coords = myHoop.vertices[0].values;
let indices = myHoop.connectivity[0].indices;
let normals = myHoop.vertices[1].values;
let texcoord = myHoop.vertices[2].values;



let program;
let vaos = [];
let shapes;


let textures = [];

let machine = {
    positions: coords,
    normals: normals,
    texcoords: texcoord,
    indices: indices,
};



let coords2 = myShoe.vertices[0].values;
let indices2 = myShoe.connectivity[0].indices;
let normals2 = myShoe.vertices[1].values;
let texcoord2 = myShoe.vertices[2].values;

let shoe = {
    positions: coords2,
    normals: normals2,
    texcoords: texcoord2,
    indices: indices2,
}


//light 
let lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0); // white light
let lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
let lightSpecular = vec4(0.9, 0.9, 0.9, 1.0);

let lightPosition = vec4(1.0, 1.0, 1.0, 0.0);

let materialDiffuse = [vec4(1, 1, 1, 1.0),
vec4(0.2, 1, 1.0, 1.0),
vec4(0.2, 0.2, 1, 1.0),
vec4(.75, .24, 10, 1.0)];

let materialAmbient = [vec4(1, 1, 1, 1.0),
vec4(0.2, 1, 1.0, 1.0),
vec4(0.2, 0.2, 1, 1.0),
vec4(.75, .24, 1, 1.0)];
let materialSpecular = [vec4(1, 1, 1, 1.0),
vec4(0.2, 1, 1.0, 1.0),
vec4(0.2, 0.2, 1, 1.0),
vec4(.75, .24, 1, 1.0)];
let materialShininess = 100.0;

function configureTexture( image, program, textureNum ) {
    let texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    //Flip the Y values to match the WebGL coordinates
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    
    //Specify the image as a texture array:
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
         
    //Set filters and parameters
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
    
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT );
    
    //Link texture to a sampler in fragment shader
    return texture;
}

function configureTexture( image, program ) {
    let texture = gl.createTexture();

    gl.activeTexture( gl.TEXTURE0 );

    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // Flip the Y values to match the WebGL coordinates
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    
    // Specify the image as a texture array:
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
         
    // Set filters and parameters
    gl.generateMipmap(gl.TEXTURE_2D);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
    
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT );
    
    // Link texture to a sampler in fragment shader
    gl.uniform1i(gl.getUniformLocation(program, "u_textureMap"), 0);

    return texture;
}



function init() {

    

    //Get graphics context
    let canvas = document.getElementById("gl-canvas");
    let options = {  // no need for alpha channel, but note depth buffer enabling
        alpha: false,
        depth: true  //NOTE THIS
    };

    gl = canvas.getContext("webgl2", options);
    if (!gl) { alert("WebGL 2.0 isn't available"); }

    //Load shaders
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    shapes = [
        [machine, mat4()],
        [shoe, mat4()],
        [createSphereVertices(1, 30, 30), mat4()]
    ];



    setUpShapes();

    document.getElementById("xButton").onclick = function () {
        rX(shapes[0][1]);
    };
    document.getElementById("yButton").onclick = function () {
        rY(shapes[0][1]);
    };
    document.getElementById("zButton").onclick = function () {
        rZ(shapes[0][1]);
    };

    for (let i = 0; i < shapes.length; i++) {
        vaos.push(setUpVertexObject(shapes[i][0]));

        let pic = new Image();
        pic.src = document.getElementById("image" + i).src;
        pic.onload = function () {
            configureTexture(pic, program, i);
        }
        textures.push(configureTexture(pic,program));
    }

    // buttons for moving viewer and changing size
    document.getElementById("Button1").onclick = function () { near *= 1.02 };
    document.getElementById("Button2").onclick = function () { near *= 0.98 };
    document.getElementById("Button13").onclick = function () { far *= 1.02; };
    document.getElementById("Button14").onclick = function () { far *= 0.98; };
    document.getElementById("Button3").onclick = function () { radius *= 1.1; };
    document.getElementById("Button4").onclick = function () { radius *= 0.9; };
    document.getElementById("Button5").onclick = function () { theta += rotation_by_5_deg; };
    document.getElementById("Button6").onclick = function () { theta -= rotation_by_5_deg; };
    document.getElementById("Button7").onclick = function () { phi += rotation_by_5_deg; };
    document.getElementById("Button8").onclick = function () { phi -= rotation_by_5_deg; };
    document.getElementById("Button9").onclick = function () { left *= 0.9; right *= 0.9; };
    document.getElementById("Button10").onclick = function () { left *= 1.1; right *= 1.1; };
    document.getElementById("Button11").onclick = function () { ytop *= 0.9; bottom *= 0.9; };
    document.getElementById("Button12").onclick = function () { ytop *= 1.1; bottom *= 1.1; };

    //set up uniform variables
    uniformModelView = gl.getUniformLocation(program, "u_modelViewMatrix");
    uniformProjection = gl.getUniformLocation(program, "u_projectionMatrix");

    document.onkeydown = function (ev) { keydown(ev); };


    //set up screen
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(1, 1, 1, 1);

    //Enable depth testing    
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 2.0);
    draw();
}

function setUpShapes() {
    // shapes[1][1] = mult(shapes[1][1], rotateZ(90));
    // shapes[1][1] = mult(shapes[1][1], rotateY(90));
    shapes[1][1] = mult(shapes[1][1], rotateZ(90));
    // shapes[1][1] = mult(shapes[1][1],translate(1,0,-1));
    shapes[0][1] = mult(shapes[0][1],translate(0,-65,0));
    shapes[0][1] = mult(shapes[0][1], rotateY(-90));
    shapes[0][1] = mult(shapes[0][1], scalem(5,5,5));
    theta += rotation_by_5_deg;
    for(let i = 0; i < 5; i++){
        ytop *= 0.9;
        bottom *= 0.9;
        left *= 0.9; 
        right *= 0.9;
    }
}

function lR() {
    radius *= 0.9;
}

function drawTexture(textureObj, program, i)
{
    gl.activeTexture( gl.TEXTURE0 + i );

    gl. bindTexture(gl.TEXTURE_2D, textureObj);

    gl.uniform1i(gl.getUniformLocation(program, "u_textureMap"), i);
}


function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let eye = vec3(radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta));

    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);

    //gl.uniformMatrix4fv( uniformModelView, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv(uniformProjection, false, flatten(projectionMatrix));


    //gl.drawElements( gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0 ); 

    //gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
    for (let i = 0; i < shapes.length; i++) {
        modelViewMatrix = (mult(modelViewMatrix, shapes[i][1]));
        gl.uniformMatrix4fv(uniformModelView, false, flatten(modelViewMatrix));
        drawVertexObject(vaos[i], shapes[i][0].indices.length, materialAmbient[i], materialDiffuse[i], materialSpecular[i], materialShininess / (i + 1));
        drawTexture(textures[i], program, i);
    }

    requestAnimationFrame(draw);
}

function rX(shape) {
    shape = mult(shape, rotateX(90));
    draw();
}

function rY(shape) {
    shape = mult(shape, rotateY(90));
    draw();
}

function rZ(shape) {
    shape = mult(shape, rotateZ(90));
    draw();
}



// Loads a VAO and draws it
function drawVertexObject(vao, iLength, mA, mD, mS, s) {
    let ambientProduct = mult(lightAmbient, mA);
    let diffuseProduct = mult(lightDiffuse, mD);
    let specularProduct = mult(lightSpecular, mS);
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), s);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, iLength, gl.UNSIGNED_SHORT, 0);
}

// Sets up a VAO 
function setUpVertexObject(shape) {
    let indices = shape.indices;
    let vertices = shape.positions;
    let normals = shape.normals;
    let texCoord = shape.texcoords;
    //setViewParams(flatten(vertices));
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // Set up index buffer, if using
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STREAM_DRAW);

    // For each attribute (e.g. each of vertices, normal, color, etc.)

    // Set up vertices buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STREAM_DRAW);
    let attributeCoords = gl.getAttribLocation(program, "a_coords");
    gl.vertexAttribPointer(attributeCoords, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attributeCoords);

    // Set up normals buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STREAM_DRAW);
    let attributeNormals = gl.getAttribLocation(program, "a_normals");
    gl.vertexAttribPointer(attributeNormals, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attributeNormals);

    let tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoord), gl.STATIC_DRAW);

    let texCoordLoc = gl.getAttribLocation(program, "a_texCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);

    // Finalize the vao; not required, but considered good practice
    gl.bindVertexArray(null);
    return vao;
}

//below is needed code
function startgame() {
    resetgame();
    clearInterval(timer);
    runningGame = true;
    timer = setInterval(settimer, 1000);

    var x = document.getElementById("startButton");
    x.style.display = "none";

}
function settimer() {
    if (timelimit > 0) {
        timelimit--;
        timegone++;
        document.getElementById("timertext").value = timelimit + " sec";
    } else {
        endgame();
    }
}
function resetgame() {
    timelimit = 10;
    timegone = 0;
    score = 0;
    scoreText.value = score;
    shootable = true;
    document.getElementById("userscore").value = "0";
    document.getElementById("timertext").Text = timelimit;

    var x = document.getElementById("restartButton");
    x.style.display = "none";
    x = document.getElementById("startButton");
    x.style.display = "block";
    runningGame = false;
    //need to disable startbutton until game ends

}
function endgame() {
    clearInterval(timer);
    runningGame = false;
    shootable = false;
    var x = document.getElementById("startButton");
    x.style.display = "none";
    x = document.getElementById("restartButton");
    x.style.display = "block";
    //enable startbutton
    //compare scores to update highscore
    if (document.getElementById("highscore").value < document.getElementById("userscore").value) {
        document.getElementById("highscore").value = score;
    }

}

function shoot() {
    if (shootable && runningGame) {
        shootable = false;
        //needs create basketball that moves towards hoop

        //see if blocked 
        let t = (Math.floor(Math.random() * 100) + 1);
        if (t % 2 === 0) {
            score = score - 75;
            scoreText.value = score;
            document.getElementById('blocked').style.display = 'block';

        } else {
            document.getElementById('blocked').style.display = 'none';
            lightShow();
            score = score + 100;
            scoreText.value = score;
        }
    }
    shootable = true;
}

async function lightShow() {
    lightDiffuse = vec4(0, 1.0, 1.0, 1.0);
    lightPosition = vec4(0.5, 1.0, 1.0, 0.0);
    await sleep(70);
    lightDiffuse = vec4(0, 1.0, 1.0, 1.0);
    lightPosition = vec4(0.75, 1.0, 1.0, 0.0);
    await sleep(70);
    lightDiffuse = vec4(1.0, 0, 1.0, 1.0);
    lightPosition = vec4(1.0, 1.0, 0.0, 0.0);
    await sleep(70);
    lightDiffuse = vec4(0, 1.0, 1.0, 1.0);
    lightPosition = vec4(1.0, 1.0, 0.75, 0.0);
    await sleep(70);
    lightDiffuse = vec4(1.0, 1.0, 0, 1.0);
    lightPosition = vec4(1.0, 0.0, 1.0, 0.0);
    await sleep(70);
    lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
    lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function keydown(ev) {
    switch (ev.keyCode) {
        case 32: // spacebar
            shoot();
            break;
        default: return; // Skip drawing if no effective action
    }
}
