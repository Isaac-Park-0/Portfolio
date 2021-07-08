var footer = document.getElementsByTagName("footer");
var nav = document.getElementById("nav");
var foot = document.getElementById("foot");

var canvas = document.getElementById("perlin");
var ctx = canvas.getContext("2d");


canvas.width = window.innerWidth;
canvas.height = window.innerHeight-nav.clientHeight-48;
console.log(footer[0],foot)

function init3darray() {
	field = []
	field.push(generateRandomArray()); /* This initialises the field at t=0 */
	field.push(generateRandomArray()); /* This initialises the target field for t=1 */
}

window.addEventListener('resize', resizeCanvas, false); /* we want to resize the canvas every time the window is resized */

function resizeCanvas() {
	window.cancelAnimationFrame(currentid); // cancel animating our curretnt frame, this will alos stop the function from threading, so we can call animate again later
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight-nav.clientHeight-48;
	init3darray(); // setup a new array
	initParticles(); // setup a new set of particles
	animate(); // Redraw everything after resizing the window
}

function generateRandomArray() {
	let arr = [];
	for ( y = 0; y <= Math.ceil(canvas.height/scl); y++) {
		let row=[];
			for ( x = 0; x <= Math.ceil(canvas.width/scl); x++) {
				theta = Math.random()*2*Math.PI;
				row.push(theta);
			}
		arr.push(row);
	}
	return arr
}

function getUnitVectorFromAngle(theta){
	return {x: Math.cos(theta), y: Math.sin(theta)}
}

function distDotProdGrid(x, y, t, xIndex, yIndex){
		angle1=field[0][yIndex][xIndex];
		angle2=field[1][yIndex][xIndex];
		theta=linInterp(t, angle2, angle1);
		var g_vect = getUnitVectorFromAngle(theta);
		var d_vect = {x: (x - xIndex*scl)/scl, y: (y - yIndex*scl)/scl};
		return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
}

function smoothInterpolate(t) {
	return 6*Math.pow(t,5)-15*Math.pow(t,4)+10*Math.pow(t,3)
}

function linInterp(x, a, b){
	return (a-b)*x+b
}

function updateField() {
	field[0]=[...field[1]];
	field[1]=generateRandomArray();
	return 0
}

function getPerlin(x, y, t) {
	gridcol=Math.floor(x/scl);
	gridrow=Math.floor(y/scl);
	x0=gridcol*scl;
	y0=gridrow*scl;

	let n=[];
	for(i=0; i<2; i++) {
		temp=[];
		for(j=0; j<2; j++) {
			temp.push(distDotProdGrid(x,y,t,gridcol+i,gridrow+j));
		}
		n.push(temp);
	}
	interpX=smoothInterpolate((x-x0)/scl);
	interpY=smoothInterpolate((y-y0)/scl);

	nx0=linInterp(interpX, n[1][0], n[0][0]);
	nx1=linInterp(interpX, n[1][1], n[0][1]);
	return (linInterp(interpY,nx1, nx0)+1)/2
}

// interpolates between two colors, returning an 'rgb()' string. factor (fac) must be 0<=fac<=1 and determines where on the gradient to return
function interpolateColorArrays(color1, color2, fac) {
    colorOut=[];
    for(let i=0; i < color1.length; i++) {
    	colorOut.push(linInterp(fac, color1[i], color2[i]));
    }
    return `rgb(${colorOut[0]},${colorOut[1]},${colorOut[2]})`
  }

class Particle {
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.prevx = x;
		this.prevy = y;
		this.size = 1;
		this.color='#ffffff';
	}
	update(t, ProgressGradientBackwards){
		this.prevx = this.x;
		this.prevy = this.y;

		var direction=getPerlin(this.x, this.y, t)*5*Math.PI;
		var vect=getUnitVectorFromAngle(direction);
		this.velx = fldStr*vect.x;
		this.vely = fldStr*vect.y;
		this.x += this.velx;
		this.y += this.vely;
		if (this.y > canvas.height) {
			this.y = this.y-canvas.height;
			this.prevy = 0;
		}
		if (this.y < 0) {
			this.y = this.y+canvas.height;
			this.prevy = canvas.height;
		}
		if (this.x > canvas.width) {
			this.x = this.x-canvas.width;
			this.prevx = 0;
		}
		if (this.x < 0) {
			this.x = this.x+canvas.width;
			this.prevx = canvas.width;
		}
		if(ProgressGradientBackwards){
			this.color=interpolateColorArrays([255,255,255],[145,166,255],ProgressGradientBackwards-t);
		}
		else {
			this.color=interpolateColorArrays([255,255,255],[145,166,255],t);
		}
	}
	draw(){
		/*ctx.fillStyle = "gray";
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.size, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();*/
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.prevx,this.prevy);
		ctx.lineTo(this.x,this.y);
		ctx.stroke();
		ctx.closePath();
	}
}

/* animate the canvas and draw the particles */
function initParticles() {
	particles = [];
	for(i=0; i < nparticles; i++) {
		particles.push(new Particle(Math.random()*canvas.width,Math.random()*canvas.height));
	}
	t=0;
	ProgressGradientBackwards=0;
}

function animate() {
	ctx.fillStyle='rgba(33,33,33,0.01)';
	ctx.fillRect(0,0,canvas.width,canvas.height);
	t=t+0.005;
	for(part=0; part<particles.length; part++) {
		particles[part].update(t, ProgressGradientBackwards);
		particles[part].draw();
	}
	if(t>1) {
		t=updateField();
		if(ProgressGradientBackwards==0) {
			ProgressGradientBackwards=1;
		}
		else {
			ProgressGradientBackwards=0;
		}
	}
	currentid = requestAnimationFrame(animate);
}

ctx.lineWidth = 1;
const nparticles = 10000; 
var scl = 50;    /* size of the perlin grid */
var fldStr = 0.4; /* amount the particles should move each frame (in pixels)*/
init3darray();
initParticles();
animate();

/* some useful code to visualise the perlin noise */

/*function drawImage(resolution, t) {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	for ( y = 0; y < Math.floor(canvas.height); y+=resolution) {
		for ( x = 0; x < Math.floor(canvas.width); x+=resolution) {
			color=getPerlin(x,y,t)*255;
			color=Math.floor(color);
			ctx.fillStyle=`rgb(${color},${color},${color})`;
			ctx.fillRect(x,y,resolution,resolution);
		}
	}
}

var t=0;
setInterval(function(){
									t+=0.1;
									drawImage(5,t)
									if(t>1) {
										t=0;
										console.log(field[1]);
										field[0]=field[1];
										console.log(field[0]);
										field[1]=generateRandomArray();};
									},100);*/

/* some useful code to visualise the random vectors */

/*function drawField(t,style='black') {
	ctx.beginPath();
	for ( y = 0; y <= Math.ceil(canvas.height/scl); y++) {
		for ( x = 0; x <= Math.ceil(canvas.width/scl); x++) {
			ctx.moveTo(x*scl,y*scl);
			angle1=field[0][y][x];
			angle2=field[1][y][x];
			theta=linInterp(t, angle2, angle1);
			vect = getUnitVectorFromAngle(theta);
			ctx.lineTo(x*scl+fldStr*vect.x,y*scl+fldStr*vect.y);
		}
	}
	ctx.strokeStyle=style;
	ctx.stroke();}

var t=0;
style="black"
setInterval(function(){
									ctx.clearRect(0, 0, canvas.width, canvas.height);
									drawField(t,style);
									t+=0.1;
									if(t>1) {
										t=0;
										field[0]=[...field[1]];
										field[1]=generateRandomArray()
										if(style=='black'){style='red'}
										else {style='black'}};
								},100);*/

/* some useful code to visualise the flow field */

/*function drawFlowField(resolution, t, multipy) {
	ctx.beginPath();
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	for ( y = resolution/2.0; y < Math.floor(canvas.height); y+=resolution) {
		for ( x = resolution/2.0; x < Math.floor(canvas.width); x+=resolution) {
			var theta=getPerlin(x,y,t)*Math.PI*multipy;
			var vect=getUnitVectorFromAngle(theta);
			ctx.moveTo(x,y);
			ctx.lineTo(x+resolution*vect.x,y+resolution*vect.y);
		}
	}
	ctx.stroke();
}

var t=0;
const resolution=10;
setInterval(function(){
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					drawFlowField(resolution, t, 5);
					t+=0.1;
					if(t>1) {
						t=updateField();
					};
				},100);*/