var Vector2 = function()
{
	this.x = 0;
	this.y = 0;
}

Vector2.prototype.Set(x, y)
{
	this.x = x;
	this.y = y;
}

Vector2.prototype.Normalize()
{
	var Magnitude = (this.x * this.x) + (this.y * this.y);
	if(Magnitude != 0)
	{
		var OneOverSqrtMag = 1 / Math.Sqrt(Magnitude);
		x *= OneOverSqrtMag;
		y *= OneOverSqrtMag;
	}
}

Vector2.prototype.Add(vec2)
{
	this.x += vec2.x;
	this.y += vec2.y;
}

Vector2.prototype.Subtrace(vec2)
{
	this.x -= vec2.x;
	this.y -= vec2.y;
}

Vector2.prototype.MultiplyScalar(scalar)
{
	this.x *= scalar;
	this.y *= scalar;
}