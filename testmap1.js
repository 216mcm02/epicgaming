var SceneOne = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "testmap1" });
    },
    map: null,
    player: null,
    cursors: null,
    groundLayer: null,
    text: null,
    prevVel: null,
    direction: null,
    slow: null,
/*
var map;
var player;
var cursors;
var groundLayer;
var text;
var prevVel;
var direction;
var slow;
*/
init: function() {},

preload: function() {
    //set base pathing for getting images, set to github
    this.load.setBaseURL('https://raw.githubusercontent.com/216mcm02/epicgaming/main/assets/');
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'attempt2.json');
    // tiles in spritesheet 
    this.load.spritesheet('tiles', 'customtiles/customTiles.png', {frameWidth: 32, frameHeight: 32});
    // player animations
    this.load.atlas('player', 'customplayer/customsprite.png', 'customplayer/sprites.json');
    //this.load.image('player', 'customplayer/player1.png');
},

create: function() {
    var map;
    var player;
    var cursors;
    var groundLayer;
    var text;
    var prevVel;
    var direction;
    var slow;
    //load the map 
    map = this.make.tilemap({key: 'map'});
    //initialize tileset
    var groundTiles =  map.addTilesetImage('customTiles', 'tiles', 32, 32, 0, 1);
    // create the ground layer
    groundLayer = map.createDynamicLayer('Tile Layer 1', groundTiles, 0, 0);
    //zoom camera in on player
    this.cameras.main.setZoom(1.4);
    //enable ground layer collision
    groundLayer.setCollisionByExclusion([-1]);
    // create boundaries
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;
    // create the player sprite    
    player = this.physics.add.sprite(200, 200, 'player');
    //sets max possible player speed as a vector
    player.setMaxVelocity(450, 800);
    player.setCollideWorldBounds(true); // don't go out of the map    
    
    // small fix to our player images, we resize the physics body object slightly
    player.body.setSize(player.width, player.height);
    
    // player will collide with the level tiles 
    this.physics.add.collider(groundLayer, player);
    
    //shitty if statement
    // coinLayer.setTileIndexCallback(17, collectCoin, this);
    // // when the player overlaps with a tile with index 17, collectCoin 
    // // will be called    
    // this.physics.add.overlap(player, coinLayer);
    
    // player walk animation
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('player', {prefix: 'walk', start: 1, end: 11, zeroPad: 0}),
        frameRate: 10,
        repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNames('player', {prefix: 'idle', start: 1, end: 2, zeroPad: 0}),
        frameRate: 10,
        repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'jump',
        frames: [{key: 'player', frame: 'jump'}],
        frameRate: 10,
    });
    // wall-cling anim
    this.anims.create({
        key: 'cling',
        frames: [{key: 'player', frame: 'cling'}],
        frameRate: 10,
    });
    
    //enable keyboard inputs
    cursors = this.input.keyboard.createCursorKeys();
    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);
    // set background color    
    this.cameras.main.setBackgroundColor('#ccccff');
},

update: function() {
    //player.anims.play('', true);
    //swap the direction of animations to match the direction 
    //the player was moving on the prevois frame
    player.flipX = direction;
    //set up multiple variables that will be referenced often
    if(player.body.velocity.x > 0){
        direction = true;
    }else if(player.body.velocity.x < 0){
        direction = false;
    }
    var wleft, wright;
    if (player.body.blocked.right) {
        // running into a wall on the right
        wright = true;
    } else if (player.body.blocked.left) {
        // running into a wall on the left
        wleft = true;
    }
    var acc = 250;
    var accc;
    var run;
    if(player.body.velocity.x < 50 && player.body.velocity.x > -50){
        run = false;
    }else run = true;
    //player is on floor
    if(player.body.onFloor()){
        player.anims.play('walk', true);
        //normal walking, aswell as startup speed boost for qol
        if (cursors.left.isDown && !wleft){
            if(run){
                accc = -acc;
            }else {
                if(player.body.onFloor()) {
                    player.body.setVelocityX(-50);
                } else accc= -acc;
            }
        }else if (cursors.right.isDown && !wright){
            if(run){
                accc = acc;
            }else {
                if(player.body.onFloor()){
                    player.body.setVelocityX(50);
                }
                accc = acc;
            }
        }else{
            //scuffed friction code to make player stop when doing nothing.
            accc = -player.body.velocity.x*3; 
            player.anims.play('idle', true);
        }

    //player is in air
    }else {
        player.anims.play('jump', true);
        //control acceleration midair
        if (cursors.left.isDown && !wleft){
            accc = -acc;
        }else if (cursors.right.isDown && !wright){
            accc = acc;
        }
    }
    var plsWork = prevVel;
    player.body.setAccelerationX(accc);
    //grounded jump 
    if(cursors.up.isDown && player.body.onFloor()){
        player.anims.play('jump', true);
        player.body.setVelocityY(-400);  
    }
    //walljump
    if((wright || wleft) && !player.body.onFloor()){
        if(cursors.up.isDown){
            player.body.setVelocityY(-450);
            player.anims.play('jump', true);
            //push player away from wall if their velocity is to low
            if(wright && slow){
                player.body.setVelocityX(-115);
            }else if(wleft && slow){
                player.body.setVelocityX(115);
            } else player.body.setVelocityX(plsWork * -1.05);
            // give player wall boost if they have high enough speed
        }else{
            player.body.setVelocityY(50);
            player.anims.play('cling', true);
        }
    }
}});