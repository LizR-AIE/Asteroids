var Vector2 = function()
{
	this.x = 0;
	this.y = 0;
}

Vector2.prototype.Set = function(x, y)
{
	this.x = x;
	this.y = y;
}

Vector2.prototype.Normalize = function()
{
	var Magnitude = (this.x * this.x) + (this.y * this.y);
	if(Magnitude != 0)
	{
		var OneOverSqrtMag = 1 / Math.Sqrt(Magnitude);
		x *= OneOverSqrtMag;
		y *= OneOverSqrtMag;
	}
}

Vector2.prototype.Add = function(vec2)
{
	this.x += vec2.x;
	this.y += vec2.y;
}

Vector2.prototype.Subtract = function(vec2)
{
	this.x -= vec2.x;
	this.y -= vec2.y;
}

Vector2.prototype.MultiplyScalar = function(scalar)
{
	this.x *= scalar;
	this.y *= scalar;
}