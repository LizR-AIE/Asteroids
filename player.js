var Player = function()
{
	var self = this;
	this.image = document.createElement("img");
	this.position = new Vector2();
	this.width = 93;
	this.height = 80;
	this.direction = new Vector2();
	this.angularDirection = 0;
	this.rotation = 0;
	this.isDead = false;
	this.resetPosition = new Vector2();	
	this.image.src = "ship.png";
}

Player.prototype.Update = function(deltaTime)
{
	if(this.isDead == false)
	{
		console.log("hi");
		this.direction.X = 0;
		this.direction.Y = 0;
		this.angularDirection = 0;
		
		if(keyboard.isKeyDown(keyboard.Up))
			this.direction.Y += 1;
		if(keyboard.isKeyDown(keyboard.Down))
			this.direction.Y -= 1;
		if(keyboard.isKeyDown(keyboard.KeyA))
			this.direction.X += 1;
		if(keyboard.isKeyDown(keyboard.KeyS))
			this.direction.X -= 1;
		if(keyboard.isKeyDown(keyboard.Right))
			this.angularDirection += 1;
		if(keyboard.isKeyDown(keyboard.Left))
			this.angularDirection -= 1;
		
		// calculate sin and cos for the player's current rotation
		var s = Math.sin(this.rotation);
		var c = Math.cos(this.rotation);
		
		var xDir = (this.direction.X * c) - (this.direction.Y * s);
		var yDir = (this.direction.X * s) + (this.direction.Y * c);
		var xVel = xDir * PLAYER_SPEED;
		var yVel = yDir * PLAYER_SPEED;
			
		this.position.x += xVel * deltaTime;
		this.position.y += yVel * deltaTime;
			
		this.rotation += this.angularDirection * PLAYER_TURN_SPEED * deltaTime;
	}
}

Player.prototype.Draw = function()
{
	if(this.isDead == false)
	{
		context.save();			
		context.translate(this.position.x, this.position.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, 0 - this.width / 2, 0 - this.height / 2); 	
		context.restore();
	}
}