states.mainGame = function () {
};

var walls;
var player;
var fins;
var input;
var mazeWidth;
var mazeHeight;
var light;
var opaques;
var lightMask;

states.mainGame.prototype = {
    preload: function () {
        game.load.image('bg', 'assets/bg.png');
        game.load.image('block', 'assets/block.png');
        game.load.image('finBlock', 'assets/fin.png');
        game.load.image('player', 'assets/player.png')
    },
    create: function () {
        game.plugins.add(Phaser.Plugin.PhaserIlluminated);
        mazeWidth = game.width / 20;
        mazeHeight = game.height / 20;
        
        game.add.sprite(0, 0, 'bg');
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        walls = game.add.group();
        walls.enableBody = true;
        
        fins = game.add.group();
        fins.enableBody = true;
        
        opaques = [];
        createMaze(1, 1);
        
        player = game.add.sprite(1 * 20 + 1, 1 * 20 + 1, 'player');
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.setCircle(9);
        
        input = game.input.keyboard.createCursorKeys();
        
        light = game.add.illuminated.lamp(1 * 20 + 1, 1 * 20 + 1, {distance: 40, });
        light.createLighting(opaques);
        lightMask = game.add.illuminated.darkMask([light], 'rgba(0,0,0,0.99)');
        
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
        
        //light
        light.x = player.x;
        if (light.x % 20 < 2)
            light.x += 2;
        light.y = player.y;
        if (light.y % 20 < 2)
            light.y += 2;
        light.refresh();
        lightMask.refresh();
    }
};

function onWin(player, fins) {
    game.state.start('win');
}

function createMaze(startX, startY) {
    /*
     Start with a grid full of walls.
     Pick a cell, mark it as part of the maze. Add the walls of the cell to the wall list.
     While there are walls in the list:
     -Pick a random wall from the list. If only one of the two cells that the wall divides is visited, then:
     --Make the wall a passage and mark the unvisited cell as part of the maze.
     --Add the neighboring walls of the cell to the wall list.
     -Remove the wall from the list.
     */
    // x, y, xWall, yWall, value
    var walls = new PriorityQueue({
        comparator: function (a, b) {
            return a.value - b.value;
        }
    });
    // [coordToIndex(x, y)] = true if that position has a block
    var wallBlocks = [];
    for (var y = 0; y < mazeHeight; y++) {
        for (var x = 0; x < mazeWidth; x++) {
            wallBlocks[coordToIndex(x, y)] = true;
        }
    }
    
    markWall(startX, startY);
    while (walls.length) {
        var wall = walls.dequeue();
        // console.log(wall.x + ", " + wall.y);
        
        if (wallBlocks[coordToIndex(wall.x, wall.y)]) {
            wallBlocks[coordToIndex(wall.xWall, wall.yWall)] = false;
            markWall(wall.x, wall.y);
        }
    }
    
    for (var y = 0; y < mazeHeight; y++) {
        for (var x = 0; x < mazeWidth; x++) {
            if (wallBlocks[coordToIndex(x, y)])
                createWall(x, y);
        }
    }
    
    for (var y = 0; y < mazeHeight; y++) {
        if (!wallBlocks[coordToIndex(mazeWidth - 1, y)])
            createFin(mazeWidth - 1, y)
    }
    for (var x = 0; x < mazeWidth; x++) {
        if (!wallBlocks[coordToIndex(x, mazeHeight - 1)])
            createFin(x, mazeHeight - 1)
    }
    
    function markWall(x, y) {
        wallBlocks[coordToIndex(x, y)] = false;
        var tempWalls = getWalls(x, y);
        for (var i = 0; i < tempWalls.length; i++)
            walls.queue(tempWalls[i]);
    }
    
    function getWalls(x, y) {
        var walls = [];
        
        if (inRange(x + 2, y))
            walls.push({x: x + 2, y: y, xWall: x + 1, yWall: y, value: game.rnd.integer()});
        if (inRange(x - 2, y))
            walls.push({x: x - 2, y: y, xWall: x - 1, yWall: y, value: game.rnd.integer()});
        if (inRange(x, y + 2))
            walls.push({x: x, y: y + 2, xWall: x, yWall: y + 1, value: game.rnd.integer()});
        if (inRange(x, y - 2))
            walls.push({x: x, y: y - 2, xWall: x, yWall: y - 1, value: game.rnd.integer()});
        
        return walls;
    }
    
    function inRange(x, y) {
        return x >= 0 && x < mazeWidth && y >= 0 && y < mazeHeight;
    }
    
    function coordToIndex(x, y) {
        return y * mazeWidth + x;
    }
}

function createWall(x, y) {
    var wall = walls.create(x * 20, y * 20, 'block');
    wall.body.immovable = true;
    opaques.push(game.add.illuminated.rectangleObject(x * 20, y * 20, 20, 20));
}

function createFin(x, y) {
    var wall = fins.create(x * 20, y * 20, 'finBlock');
    wall.body.immovable = true;
}