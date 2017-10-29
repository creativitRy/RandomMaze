states.title = function () {
};

states.title.prototype = {
    preload: function () {
        game.load.image('bg', 'assets/background.png');
        game.load.image('start', 'assets/start.png')
    },
    create: function () {
        game.add.sprite(0, 0, 'bg');
        game.add.text(80, 80, 'Random Maze Game\n', {font: "64px Courier", fill: "#45f442", align: "center"});

        startButton = game.add.button(80, 200, 'start', changeState);

        startButton.inputEnabled = true;
    },
    update: function () {
        if (game.input.keyboard.isDown(13))
            changeState();

        if (startButton.input.pointerOver()) {
            startButton.alpha = 0.7;
        }
        else {
            startButton.alpha = 1;
        }
    }
};

function changeState() {
    game.state.start('mainGame');
}