function pythagoras(x1, y1, x2, y2) {
    distX = x1 - x2;
    distY = y1 - y2;

    return Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
}

/* 
The following code is based off the line collision code written by jeffrey thompson 
Source: http://www.jeffreythompson.org/collision-detection/line-circle.php
Adapted to work for a triangle
*/

function triCollision() {
    for(i = 0; i < gameObstacles.length; i++) {
        if (gameObstacles[i].type == 'tri') {
            // Triangle vs CIRCLE

            // Circle Centre
            var cx = heroTri.centerX;
            var cy = heroTri.centerY;
            var r = heroTri.size;

            // Back Triangle point
            var x1 = gameObstacles[i].backPointX;
            var y1 = gameObstacles[i].backPointY;
            
            // Top Triangle point
            var x2 = gameObstacles[i].topPointX;
            var y2 = gameObstacles[i].topPointY;
            
            // Front Triangle point
            var x3 = gameObstacles[i].frontPointX;
            var y3 = gameObstacles[i].frontPointY;

            // 1. Points vs Circle: Are the points in the circle (three points back, top, front)
            // Pythagoras Therom to find the distance (hypotenuse) of each point from hero center (Same as Hero vs Circle but for 3 points)
            // Hero treated as "circle" when airborn as it is rotating

            var backHyp = pythagoras(cx, cy, x1, y1);
            var topHyp = pythagoras(cx, cy, x2, y2);
            var frontHyp = pythagoras(cx, cy, x3, y3);

            // If the any of the distances is smaller than the Hero's radius they must be overlapping (Same as Hero vs Circle but only one radius)
            if (backHyp < r || topHyp < r || frontHyp < r) {
                heroTri.crash(); 
            }

            else {

                // 2. Find Closest Point
                // Back Side Length
                var backLen = pythagoras(x1, y1, x2, y2);

                // Front Side Length
                var frontLen = pythagoras(x2, y2, x3, y3);

                // Bottom Side Length
                var bottomLen = pythagoras(x1, y1, x3, y3);

                // Dot product of two vectors
                var backDot = (((cx-x1) * (x2-x1)) + ((cy-y1) * (y2-y1))) / Math.pow(backLen, 2);
                var frontDot = (((cx-x2) * (x3-x2)) + ((cy-y2) * (y3-y2))) / Math.pow(frontLen, 2);
                var bottomDot = (((cx-x3) * (x3-x1)) + ((cy-y1) * (y3-y1))) / Math.pow(bottomLen, 2);

                // Back Closest Point
                var backClosestX = x1 + (backDot * (x2-x1));
                var backClosestY = y1 + (backDot * (y2-y1));

                // Front Closest Point
                var frontClosestX = x2 + (frontDot * (x3-x2));
                var frontClosestY = y2 + (frontDot * (y3-y2));

                // Bottom Closest Point
                var bottomClosestX = x3 + (bottomDot * (x3-x1));
                var bottomClosestY = y3 + (bottomDot * (y3-y1));

                // Is the closest point on the triangles edge
                var backOnSegment = linePoint(x1,y1,x2,y2, backClosestX, backClosestY);
                var frontOnSegment = linePoint(x2,y2,x3,y3, frontClosestX, frontClosestY);
                var bottomOnSegment = linePoint(x1,y1,x3,y3, bottomClosestX, bottomClosestY);

                if (backOnSegment == true) {
                    var backDistance = pythagoras(backClosestX, backClosestY, cx, cy);

                    if (backDistance <= r) {
                        heroTri.crash(); 
                    }
                }

                else if (frontOnSegment == true ) {
                    var frontDistance = pythagoras(frontClosestX, frontClosestY, cx, cy);

                    if (frontDistance <= r) {
                        heroTri.crash(); 
                    }
                } 

                else if (bottomOnSegment == true ) {
                    var bottomDistance = pythagoras(bottomClosestX, bottomClosestY, cx, cy);
                
                    if (bottomDistance <= r) {
                        heroTri.crash(); // Replace with END GAME
                    }
                } 
            }
        }
    }
}

// LINE / POINT
function linePoint(x1, y1, x2, y2, px, py) {

  // get distance from the point to the two ends of the line
  var d1 = pythagoras(px,py, x1,y1);
  var d2 = pythagoras(px,py, x2,y2);

  // get the length of the line
  var lineLen = pythagoras(x1,y1, x2,y2);


  // a little buffer zone that will give collision
  var buffer = 0.1;    // higher no. = less accurate

  // if the two distances are equal to the line's
  // length, the point is on the line!
  // note we use the buffer here to give a range,
  if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
    return true;
  }
  else {
    return false;
  }
}