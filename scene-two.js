var SceneTwo = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "SceneTwo" });
    },
    init: function(data) {
        this.message = data.message;
    },
    preload: function() {},
    create: function() {
        var text = this.add.text(
            640, 
            360, 
            this.message,
            {
                fontSize: 50,
                color: "#000000",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);
    },
    update: function() {}
});