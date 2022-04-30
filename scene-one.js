var SceneOne = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "SceneOne" });
    },
    init: function() {},
    preload: function() {
        this.load.image("plane", "https://raw.githubusercontent.com/216mcm02/epicgaming/main/assets/coinGold.png");
    },
    create: function() {
        this.plane = this.add.image(640, 360, "plane");
    this.time.addEvent({
        delay: 3000,
        loop: false,
        callback: () => {
            this.scene.start("SceneTwo", { 
                "message": "Game Over" 
            });
        }
    })
    },
    update: function() {}
});