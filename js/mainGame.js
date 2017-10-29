states.mainGame = function () {
};

var walls;
var player;
var fins;
var input;

states.mainGame.prototype = {
    preload: function () {
        game.load.image('bg', 'assets/bg.png');
        game.load.image('block', 'assets/block.png');
        game.load.image('finBlock', 'assets/fin.png');
        game.load.image('player', 'assets/player.png')
    },
    create: function () {
        game.add.sprite(0, 0, 'bg');
        game.physics.startSystem(Phaser.Physics.ARCADE);

        walls = game.add.group();
        walls.enableBody = true;

        createWall(2, 1);

        player = game.add.sprite(3 * 20 + 1, 4 * 20 + 1, 'player');
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;

        fins = game.add.group();
        fins.enableBody = true;

        createFin(14, 14);

        input = game.input.keyboard.createCursorKeys();
    },
    update: function () {
        game.physics.arcade.collide(player, walls);
        game.physics.arcade.overlap(player, fins, onWin, null, this);

        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        if (input.left.isDown)
            player.body.velocity.x = -150;
        else if (input.right.isDown)
            player.body.velocity.x = 150;

        if (input.up.isDown)
            player.body.velocity.y = -150;
        else if (input.down.isDown)
            player.body.velocity.y = 150;
    }
};

function onWin(player, fins) {
    game.state.start('win');
}

function createMaze() {
    var width = game.width / 40;
    var height = game.height / 40;

    var walls = [];

    for (var y = 0; y < height; y++)
        for (var x = 0; x < width; x++)
            walls[y * width + x] = {x: x, y: y};


}

function createWall(x, y) {
    var wall = walls.create(x * 20, y * 20, 'block');
    wall.body.immovable = true;
}

function createFin(x, y) {
    var wall = fins.create(x * 20, y * 20, 'finBlock');
    wall.body.immovable = true;
}