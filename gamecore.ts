//% block="Game Core"
//% icon="\uf2db" color="#00c000"
//% advanced=true
namespace gamecore {

    interface Game {
        id: number;
        behavior: () => void;
        icon: Image;
    }

    let games: Game[] = []
    let currentGame: number = 0;
    let image_sprites: game.LedSprite[] = []
    let _init = false

    //% block="initialize game core"
    export function init() {
        control.inBackground(() => {
            while (!_init) { }
            loadGameIcon(currentGame);

            input.onButtonPressed(Button.A, () => {
                setSelectedGame(currentGame - 1);
            })
            input.onButtonPressed(Button.B, () => {
                setSelectedGame(currentGame + 1);
            })
            input.onButtonPressed(Button.AB, () => {
                startCurrentGame();
            })
        })
    }

    function loadGameIcon(gameIndex: number) {
        clearSprites();
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                let dot = game.createSprite(x, y)
                dot.setBrightness(games[gameIndex].icon.pixelBrightness(x, y))
                image_sprites.push(dot)
            }
        }
    }

    function clearSprites() {
        for (let sprite of image_sprites) {
            sprite.delete()
        }
        image_sprites = []
    }

    //% block="set selected game to$delta"
    export function setSelectedGame(delta: number) {
        currentGame = Math.max(0, Math.min(games.length - 1, delta));
        loadGameIcon(currentGame);
    }

    //% block="start current game"
    export function startCurrentGame() {
        clearSprites();
        input.onButtonPressed(Button.A, () => { })
        input.onButtonPressed(Button.B, () => { })
        input.onButtonPressed(Button.AB, () => { })
        games[currentGame].behavior();
    }

    //% block="start game #$id"
    export function startGame(id: number) {
        currentGame = id
        startCurrentGame()
    }

    //% block="create game with id$id icon$icon"
    //% icon.defl=myImage
    //% icon.shadow=variables_get
    //% blockAllowMultiple=1 afterOnStart=true
    export function setGame(id: number, icon: Image, a: () => void) {
        for (let game of games) {
            if (game.id === id) {
                game.behavior = a;
                game.icon = icon;
                _init = true;
                return;
            }
        }
        games.push({ id: id, behavior: a, icon: icon });
        _init = true;
    }

}