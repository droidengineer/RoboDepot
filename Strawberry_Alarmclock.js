
//FightCode can only understand your robot
//if its class is called Robot
var Robot = function(robot) { };

Robot.Velocity = 10;

Robot.prototype.rad2deg = function(rads)
{
  return Math.floor(rads*(180/3.14159));
};

Robot.prototype.distance = function(ev)
{
  var robot = ev.robot;
  var enemy = ev.scannedRobot;
  
  var txs = Math.pow(enemy.position.x - robot.position.x);
  var tys = Math.pow(enemy.position.y - robot.position.y);
  
  return Math.sqrt(txs + tys);
};

Robot.prototype.bearing = function(ev)
{
  var a = Math.abs(ev.robot.position.y - ev.scannedRobot.position.y);
  var h = distance(ev);
  return rad2deg(a/h);
};

Robot.prototype.getAngleFromCoord = function(ev)
{
  
};

Robot.prototype.onIdle = function(ev) {
    var robot = ev.robot;
    robot.ahead(100);
  robot.rotateCannon(360);
  robot.rotateCannon(-360);
//    robot.back(50);
//    robot.rotateCannon(90);

};

Robot.prototype.onScannedRobot = function(ev) {
    var robot = ev.robot;
    robot.fire();
  robot.prototype.rotateCannon(bearing(ev));
  var logmsg = "Enemy bot found at (" + ev.scannedRobot.x + "," + ev.scannedRobot.y + ")";
  robot.log(logmsg);
};

Robot.prototype.onWallCollision = function(ev) {
	var robot = ev.robot;
  robot.turn(45-ev.bearing);
};

Robot.prototype.onRobotCollision = function(ev) {
  var robot = ev.robot;
  var newTurretAngle = robot.collidedRobot.cannonAngle;
  robot.rotateCannon(newTurretAngle);
  robot.fire();
};

Robot.prototype.onHitByBullet = function(ev) {
  var robot = ev.robot;  
  robot.rotateCannon(ev.bearing);
	
};
