// "use strict";

// let gl;

// let numPositions  = 36;

// let texSize = 64;

// let flag = true;

// let positionsArray = [];
// let colorsArray = [];
// let texCoordsArray = [];

// let texture;

// let texCoord = [
//     vec2(0, 0),
//     vec2(0, 1),
//     vec2(1, 1),
//     vec2(1, 0)
// ];

// let vertices = [
//     vec4(-0.5, -0.5,  0.5, 1.0),
//     vec4(-0.5,  0.5, 0.5, 1.0),
//     vec4(0.5,  0.5, 0.5, 1.0),
//     vec4(0.5, -0.5, 0.5, 1.0),
//     vec4(-0.5, -0.5, -0.5, 1.0),
//     vec4(-0.5,  0.5, -0.5, 1.0),
//     vec4(0.5,  0.5, -0.5, 1.0),
//     vec4(0.5, -0.5, -0.5, 1.0)
// ];

// let vertexColors = [
//     vec4(0.0, 0.0, 0.0, 1.0),  // black
//     vec4(1.0, 0.0, 0.0, 1.0),  // red
//     vec4(1.0, 1.0, 0.0, 1.0),  // yellow
//     vec4(0.0, 1.0, 0.0, 1.0),  // green
//     vec4(0.0, 0.0, 1.0, 1.0),  // blue
//     vec4(1.0, 0.0, 1.0, 1.0),  // magenta
//     vec4(0.0, 1.0, 1.0, 1.0),  // white
//     vec4(0.0, 1.0, 1.0, 1.0)   // cyan
// ];

// let xAxis = 0;
// let yAxis = 1;
// let zAxis = 2;
// let axis = xAxis;
// let theta = vec3(45.0, 45.0, 45.0);

// let thetaLoc;

// function configureTexture( image, program ) {
//     texture = gl.createTexture();
//     gl.activeTexture( gl.TEXTURE0 );  //0 active by default
//     gl.bindTexture(gl.TEXTURE_2D, texture);
    
//     //Flip the Y values to match the WebGL coordinates
//     gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    
//     //Specify the image as a texture array:
//     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
         
//     //Set filters and parameters
//     gl.generateMipmap(gl.TEXTURE_2D);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
//     //Link texture to a sampler in fragment shader
//     gl.uniform1i(gl.getUniformLocation(program, "u_textureMap"), 0);
// }


// // function quad(a, b, c, d) {
// //      positionsArray.push(vertices[a]);
// //      colorsArray.push(vertexColors[a]);
// //      texCoordsArray.push(texCoord[0]);

// //      positionsArray.push(vertices[b]);
// //      colorsArray.push(vertexColors[a]);
// //      texCoordsArray.push(texCoord[1]);

// //      positionsArray.push(vertices[c]);
// //      colorsArray.push(vertexColors[a]);
// //      texCoordsArray.push(texCoord[2]);

// //      positionsArray.push(vertices[a]);
// //      colorsArray.push(vertexColors[a]);
// //      texCoordsArray.push(texCoord[0]);

// //      positionsArray.push(vertices[c]);
// //      colorsArray.push(vertexColors[a]);
// //      texCoordsArray.push(texCoord[2]);

// //      positionsArray.push(vertices[d]);
// //      colorsArray.push(vertexColors[a]);
// //      texCoordsArray.push(texCoord[3]);
// // }


// // function colorCube(){
// //     quad(1, 0, 3, 2);
// //     quad(2, 3, 7, 6);
// //     quad(3, 0, 4, 7);
// //     quad(6, 5, 1, 2);
// //     quad(4, 5, 6, 7);
// //     quad(5, 4, 0, 1);
// // }


// function init() {
// 	//Get graphics context
//     let canvas = document.getElementById( "gl-canvas" );
// 	let  options = {  // no need for alpha channel, but note depth buffer enabling
// 		alpha: false,
// 		depth: true  //NOTE THIS
// 	};

// 	gl = canvas.getContext("webgl2", options);
//     if ( !gl ) { alert( "WebGL 2.0 isn't available" ); }

// 	//Load shaders
// 	let program = initShaders( gl, "vertex-shader", "fragment-shader" );
// 	gl.useProgram( program );

//     colorCube();

//     let cBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

//     let colorLoc = gl.getAttribLocation(program, "a_color");
//     gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(colorLoc);

//     let vBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

//     let positionLoc = gl.getAttribLocation(program, "a_coords");
//     gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(positionLoc);

//     let tBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

//     let texCoordLoc = gl.getAttribLocation(program, "a_texCoord");
//     gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(texCoordLoc);

//     //Initialize texture
//     let image = new Image();
//     image.src = document.getElementById("texImage").src; 
//     image.onload = function() {
//         configureTexture( image, program );
//     }
    
//     thetaLoc = gl.getUniformLocation(program, "u_theta");

    

//     //set up screen
//     gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); 
//     gl.clearColor(1, 1, 1, 1); 
    
//     //Enable depth testing    
//     gl.enable(gl.DEPTH_TEST);
//     gl.depthFunc(gl.LEQUAL);
//     gl.enable(gl.POLYGON_OFFSET_FILL);
//     gl.polygonOffset(1.0, 2.0);     
    
//     draw();

// }

// function draw() {
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//     if(flag) 
//             theta[axis] += 1.0;
//     gl.uniform3fv(thetaLoc, theta);
//     gl.drawArrays(gl.TRIANGLES, 0, numPositions);
//     requestAnimationFrame(draw);
// }

let canvas;
let gl;

let near = -100;
let far = 100;
let left = -100.0;
let right = 100.0;
let ytop = 100.0;
let bottom = -100.0;

let radius = 40.0;
let theta  = 0.0;
let phi    = 0.0;
let rotation_by_5_deg = 5.0 * Math.PI/180.0;

const blue = vec4(0.0, 0.0, 1.0, 1.0);
const black = vec4(0.0, 0.0, 0.0, 1.0);
const red = vec4(1.0, 0.0, 0.0, 1.0);

let at = vec3(0.0, 0.0, 0.0);
let up = vec3(0.0, 1.0, 0.0);

let uniformModelView, uniformProjection;
let modelViewMatrix, projectionMatrix;
let uniformColor;               

let coords = myMesh.vertices[0].values;

let indices = myMesh.connectivity[0].indices;


function init(){
    
	//Get graphics context
    let canvas = document.getElementById( "gl-canvas" );
	let  options = {  // no need for alpha channel, but note depth buffer enabling
		alpha: false,
		depth: true  //NOTE THIS
	};

	gl = canvas.getContext("webgl2", options);
    if ( !gl ) { alert( "WebGL 2.0 isn't available" ); }

	//Load shaders
	let program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );
    
    //set up index buffer
    let bufferIndices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferIndices);
    // Uint16Array here must match gl.UNSIGNED_BYTE in drawElements call
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STREAM_DRAW);  
 
    setViewParams(coords); // Attempt to size the viewing window based on object's coords
 
    //set up vertices buffer
    let bufferCoords = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCoords);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STREAM_DRAW);

    let attributeCoords  = gl.getAttribLocation(program, "a_coords");
    gl.vertexAttribPointer(attributeCoords, 3, gl.FLOAT, false, 0, 0);  
    gl.enableVertexAttribArray(attributeCoords);
     
    //set up uniform variables
    uniformModelView = gl.getUniformLocation(program, "u_modelViewMatrix");
    uniformProjection = gl.getUniformLocation(program, "u_projectionMatrix");
    uniformColor = gl.getUniformLocation(program, "u_color");
    
    // buttons for moving viewer and changing size
    document.getElementById("Button1").onclick = function(){near  *= 1.02; far *= 1.02;};
    document.getElementById("Button2").onclick = function(){near *= 0.98; far *= 0.98;};
    document.getElementById("Button3").onclick = function(){radius *= 1.1;};
    document.getElementById("Button4").onclick = function(){radius *= 0.9;};
    document.getElementById("Button5").onclick = function(){theta += rotation_by_5_deg;};
    document.getElementById("Button6").onclick = function(){theta -= rotation_by_5_deg;};
    document.getElementById("Button7").onclick = function(){phi += rotation_by_5_deg;};
    document.getElementById("Button8").onclick = function(){phi -= rotation_by_5_deg;};
    document.getElementById("Button9").onclick = function(){left  *= 0.9; right *= 0.9;};
    document.getElementById("Button10").onclick = function(){left *= 1.1; right *= 1.1;};
    document.getElementById("Button11").onclick = function(){ytop  *= 0.9; bottom *= 0.9;};
    document.getElementById("Button12").onclick = function(){ytop *= 1.1; bottom *= 1.1;};
    
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


function draw(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let eye = vec3( radius*Math.sin(theta)*Math.cos(phi), 
                    radius*Math.sin(theta)*Math.sin(phi),
                    radius*Math.cos(theta));
    
    modelViewMatrix = lookAt( eye, at, up );
    projectionMatrix = ortho( left, right, bottom, ytop, near, far );
    
    gl.uniformMatrix4fv( uniformModelView, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( uniformProjection, false, flatten(projectionMatrix) );
    
    gl.uniform4fv(uniformColor, flatten(red));    
    gl.drawElements( gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0 ); 
    //gl.uniform4fv(uniformColor, flatten(black));
    //gl.drawElements( gl.LINE_LOOP, indices.length, gl.UNSIGNED_SHORT, 0 );

    requestAnimationFrame( draw );
}

// This function tries to guess what the appropriate viewing
// parameters should be based on the overall values of the
// coordinates
function setViewParams(vertices) {
    let xmin = Infinity;
    let xmax = -Infinity;
    let ymin = Infinity;
    let ymax = -Infinity;
    let zmin = Infinity;
    let zmax = -Infinity;
    for (let i = 0; i < vertices.length; i = i + 3) {
        if (vertices[i] < xmin)
            xmin = vertices[i];
        else if (vertices[i] > xmax)
            xmax = vertices[i];
        if (vertices[i+1] < ymin)
            ymin = vertices[i+1];
        else if (vertices[i+1] > ymax)
            ymax = vertices[i+1];
        if (vertices[i+2] < zmin)
            zmin = vertices[i+2];
        else if (vertices[i+2] > zmax)
            zmax = vertices[i+2];
    }

    /* translate the center of the object to the origin */
    let centerX = (xmin+xmax)/2;
    let centerY = (ymin+ymax)/2; 
    let centerZ = (zmin+zmax)/2;
    let max = Math.max(centerX - xmin, xmax - centerX);
    max = Math.max(max, Math.max(centerY - ymin, ymax - centerY) );
    max = Math.max(max, Math.max(centerZ - zmin, zmax - centerZ) );
    let margin = max * 0.2;
    left = -(max+margin);
    right = max+margin;
    bottom = -(max+margin);
    ytop = max+margin;
    far = -(max+margin);
    near = max+margin;
    radius = max + margin;
}
