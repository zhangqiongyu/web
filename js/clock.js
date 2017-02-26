var width = 500;
var height = 500;
var radiusFrame = width/2.8;
var radiusShaft = radiusFrame/25;
var center = {
	x: width/2,
	y: height/2.5
}

var clock = document.getElementById("clock");
clock.width = width;
clock.height = height;
clock.style.background = "#139c57";
var ctx = clock.getContext("2d");

/*******************************
drawClockDial: frame, shaft, box
*******************************/
function drawClockDial()
{																																																																																																			
	//Draw the frame
	var deltaArc = Math.PI/50;
	for(var i = 0; i < 4; i++)
	{
		ctx.strokeStyle = "white";
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.arc(center.x, center.y, radiusFrame, deltaArc + i*Math.PI/2, (i+1)*Math.PI/2 - deltaArc);
		ctx.stroke();
		scale = (i+1) * 3;
		ctx.font = 0.03*width + "px" + " Arial";
		ctx.strokeStyle = "white";
		x = center.x + radiusFrame * Math.cos(Math.PI*i/2);
		y = center.y + radiusFrame * Math.sin(Math.PI*i/2);
		x -= width*0.01;
		y += height*0.01;
		if(i == 3)
			x -= width*0.006;
		ctx.fillText(scale.toString(), x, y);
	}

	//Draw th shaft;
	ctx.strokeStyle = "white";
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.arc(center.x, center.y, radiusShaft, 0, 2*Math.PI);
	ctx.stroke();

	//Draw the box
	ctx.strokeStyle = "white";
	ctx.strokeRect(width/4, 0.8*height, width/2, height/6);
	ctx.strokeStyle = "#6ec298";
	ctx.strokeRect(width/3.8, 0.811*height, width/2 - 2*width*(1/3.8 -1/4.0), height/6 - 2*height*(1/0.8 - 1/0.807))
}

/*******************
Draw pointer:
second: second hand;
minute: minute hand;
hour: hour hand;
*******************/
var numScale = 540;
function drawClockPointer(date)
{
	//Get the detail time
	var milliSec = date.getMilliseconds();
	var sec = date.getSeconds();
	var minute = date.getMinutes();
	var hour = date.getHours();
	sec += milliSec / 1000;
	sec %= 60;
	minute += sec/60;
	minute %=60;
	hour += minute/60;
	hour %= 12;

	//Print the time in the box
	var seperatorDate = "-";
	var seperatorTime = ":";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	ctx.fillStyle = "white";
	ctx.font = 0.05*width + "px" + " Arial";
	ctx.fillText(year + seperatorDate + month + seperatorDate + day, width/2.6, 0.87*height);
	var printHour = parseInt(hour)>0 ? parseInt(hour) : 12;
	ctx.fillText(parseInt(printHour) + seperatorTime + parseInt(minute) + seperatorTime + parseInt(sec), width/2.45, 0.93*height);


	//Draw the scale
	var scaleInner = 0.9;
	var scaleOuter = 0.95;
	for (var i = 0; i < numScale; i++) 
	{
		var angle = 2*i*Math.PI/numScale;
		ctx.strokeStyle = "#6ec298";
		if(i%2 == 0)
			ctx.strokeStyle = "white";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(center.x + scaleOuter*radiusFrame*Math.cos(angle), center.y + scaleOuter*radiusFrame*Math.sin(angle));
		ctx.lineTo(center.x + scaleInner*radiusFrame*Math.cos(angle), center.y + scaleInner*radiusFrame*Math.sin(angle));
		ctx.stroke();

		//Draw second hand
		var eps = Math.PI*1/numScale/2;
		var sizeSecHand = 1.5*radiusFrame*(scaleOuter - scaleInner);
		var d1 = sizeSecHand/2;
		var d2 = radiusFrame*scaleInner - d1*Math.sqrt(3);
		var radiusCorner = Math.sqrt(d1*d1 + d2*d2);
		if(Math.abs(sec/30*Math.PI - angle) < eps)
		{			
			var angleUpCorner = angle - Math.atan(d1/d2) - Math.PI/2;
			var angleDownCorner = angle + Math.atan(d1/d2) - Math.PI/2;
			ctx.fillStyle = "white";
			ctx.beginPath();
			ctx.moveTo(center.x + radiusCorner*Math.cos(angleUpCorner), center.y + radiusCorner*Math.sin(angleUpCorner));
			ctx.lineTo(center.x + scaleInner*radiusFrame*Math.cos(angle - Math.PI/2), center.y + scaleInner*radiusFrame*Math.sin(angle - Math.PI/2));
			ctx.lineTo(center.x + radiusCorner*Math.cos(angleDownCorner), center.y + radiusCorner*Math.sin(angleDownCorner));
			ctx.closePath();
			ctx.fill();

			for(var j = 0; j < numScale/4; j++)
			{
				var angleSerial = angle - Math.PI/2 - 2*j*Math.PI/numScale;
				ctx.strokeStyle = "white";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(center.x + scaleOuter*radiusFrame*Math.cos(angleSerial), center.y + scaleOuter*radiusFrame*Math.sin(angleSerial));
				ctx.lineTo(center.x + scaleInner*radiusFrame*Math.cos(angleSerial), center.y + scaleInner*radiusFrame*Math.sin(angleSerial));
				ctx.stroke();
			}
		}		
	}	

	//Draw minute hand
	var radiusMinute = radiusFrame*0.7;
	var angleMinute = (minute/30-0.5) * Math.PI;
	ctx.strokeStyle = "white";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(center.x + radiusShaft*Math.cos(angleMinute), center.y + radiusShaft*Math.sin(angleMinute));
	ctx.lineTo(center.x + radiusMinute*Math.cos(angleMinute), center.y + radiusMinute*Math.sin(angleMinute));
	ctx.stroke();
	
	//Draw hour hand
	ctx.strokeStyle = "#6ec298";
	var radiusHour = radiusFrame * 0.5;
	var angleHour = (hour/6 - 0.5)*Math.PI;
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.moveTo(center.x + radiusShaft*Math.cos(angleHour), center.y + radiusShaft*Math.sin(angleHour));
	ctx.lineTo(center.x + radiusHour*Math.cos(angleHour), center.y + radiusHour*Math.sin(angleHour));
	ctx.stroke();
}


function updateTime()
{
	ctx.clearRect(0, 0, width, height);
	drawClockDial();
	var date = new Date(); 
	drawClockPointer(date);
}

setInterval(updateTime, 0);