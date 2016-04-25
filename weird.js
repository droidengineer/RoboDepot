var flag = 0;
var caa, ra, ca, ex, ey, rx, ry, dist, deg;
var t;
var mrvn_targetAquired = 0;
var mrvn_targetY = 0;
var mrvn_targetX = 0;
var mrvn_previousAngle = 0;
var mrvn_cloneId = 0;
var mrvn_timeToChangeDirection = 0;
var mrvn_cloneInit = true;

var isClone = function (robot) {
    return !!robot.parentId;
};

var isRelated = function (robot, scannedRobot) {
    return robot.id == scannedRobot.parentId || robot.parentId == scannedRobot.id;
};


var calculateAngleToTarget = function (robotX, robotY, absoluteAngle) {
    var deltaX = robotX - mrvn_targetX;
    var deltaY = robotY - mrvn_targetY;
    var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

    angle = angle - absoluteAngle;

    if (angle > 180) angle -= 360;
    if (angle < -180) angle += 360;

    return angle;
};

var smartRotateCannon = function (robot, number) {
    if (robot.position.x <= 25 || robot.position.y <= 25) {
        var relativeAngle = robot.cannonRelativeAngle;
        if (relativeAngle >= 90 || relativeAngle <= 270) {
            robot.rotateCannon(-number);
        }else {
            robot.rotateCannon(-number);
        }
    }
};

var Robot = function(robot) {
  init = robot;
  if (robot.parentId === null) {
    rank = 0;
  } else {
    rank = 1;
  }
  for (var e in robot) {
    console.log(e+" : "+robot[e]);
  }
  robot.notify(function() {robot.log("hello");});
  //robot.ahead(100);
  //ahead2(robot, 100);
};

var init;
var time = 0;
var rank;

function tic() {
  time++;
}
function RobotData(scanData) {
 	this.id = scanData.id;
  //this.
  this.scans = [];
  this.scans.unshift(scanData);
}

function RobotScan(scanData) {
  this.scantime = time;
  this.data = scanData;
}

// an array of OtherRobots used to track their information
var otherRobots = [];

// returns the index of the robot in the otherRobots array or null if it doesn't exist
function getOtherRobotIndex(id) {
  for (var i = 0; i < otherRobots.length; i++) {
    if (otherRobots[i].scans[0].data.id == id) {
      otherIndex = i;
      return i;
    }
  }
  return null;
}


Robot.prototype.onIdle = function (ev) {
    var robot = ev.robot;
    var b = ev.robot;
    var robotX = robot.position.x;
    var robotY = robot.position.y;
     tic();

    if (robot.availableClones) {

        robot.clone();
    }
    if (mrvn_targetX != 0 && mrvn_targetY != 0) {
        var angle = calculateAngleToTarget(robotX, robotY, robot.cannonAbsoluteAngle);

        angle = angle + mrvn_previousAngle;
        robot.rotateCannon(angle);

        if (mrvn_targetAquired > 0) {
            mrvn_targetAquired--;
        } else {
            mrvn_targetX = 0;
            mrvn_targetY = 0;
        }
    } else {
        smartRotateCannon(robot, 2)
    }
    if (isClone(robot) && mrvn_cloneInit) {
        mrvn_cloneInit = false;
        robot.back(20);
        robot.rotateCannon(-20);
        robot.turn(90);
    }
    robot.ahead(1);

};
    
         



Robot.prototype.onScannedRobot = function(ev)
{
  
	var r = ev.robot;
	var e = ev.scannedRobot;
  
	if (e.parentId == r.id || e.id == r.parentId)
	{
		flag = 0;
		return;
	};
	flag = 1;
	caa = r.cannonAbsoluteAngle;
	ra = r.angle;
	ca = r.cannonRelativeAngle;
	ex = e.position.x;
	ey = e.position.y;
	rx = r.position.x;
	ry = r.position.y;
	dist = Math.sqrt((ey-ry)*(ey-ry)+(ex-rx)*(ex-rx));
	//var deg = Math.round(Math.atan(ey/ex)*180/3.14);
	deg = Math.round(Math.atan((ey-ry)/(ex-rx))*180/3.14);
	r.stop();
	r.turn(90+deg-ra);
	if (rx < ex)
	{
		r.rotateCannon(-ca+90);
		r.fire();
		r.ahead(dist);
	}
	else
	{
		r.rotateCannon(-ca+270);
		r.fire();
		r.back(dist);
		if (-ca+270 > 0)
		{
			r.rotateCannon(360);
		}
		else
		{
			r.rotateCannon(-360);
		}
	}
};

Robot.prototype.onHitByBullet = function(ev) {
  var vektor = ev.robot;
  vektor.disappear();
  if (vektor.parentId !== null) {   
    vektor.stop();
    vektor.rotateCannon(ev.bearing);
    vektor.fire(1);
    vektor.turn(90 - ev.bulletBearing);
  }
  else vektor.turn(90 - (ev.bulletBearing*2));
};

Robot.prototype.onWallCollision = function(ev) {
  var vektor = ev.robot;
	if (vektor.parentId == null) {
  	vektor.turn(ev.bearing + 90); 
  }
  else {
    vektor.back(100);
    vektor.rotateCannon(-180); 
    vektor.turn(ev.bearing - 110); 
  }
};

Robot.prototype.onRobotCollision = function(ev)
{
	var r = ev.robot;
  r.turnleft(3);
  r.turnright(30);
  r.rotatecannon(3);
};
