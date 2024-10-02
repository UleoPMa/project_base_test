// Inicializa el emulador
var nes = new jsnes.NES({
    onFrame: function (frameBuffer) {
        drawFrame(frameBuffer);
    },
    onAudioSample: function (left, right) {
        // Audio
        playAudioSample(left, right);
    }
});

let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer = [];
let sampleRate = 44100;  // Tasa de muestreo

function playAudioSample(left, right) {
    audioBuffer.push(left, right);

    if (audioBuffer.length >= sampleRate /4) {
        let buffer = audioCtx.createBuffer(2, audioBuffer.length / 2, sampleRate);
        let channelLeft = buffer.getChannelData(0);
        let channelRight = buffer.getChannelData(1);


        for (let i = 0; i < audioBuffer.length / 2; i++) {
            channelLeft[i] = audioBuffer[2 * i];
            channelRight[i] = audioBuffer[2 * i + 1];
        }

        let source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();

        audioBuffer = [];
    }
}

// Función para dibujar los frames en el canvas
function drawFrame(frameBuffer) {
    var canvas = document.getElementById('screen');
    var ctx = canvas.getContext('2d');
    var imageData = ctx.createImageData(256, 240);

    // Coloca los datos del frame buffer en el imageData
    for (var i = 0; i < frameBuffer.length; i++) {
        imageData.data[i * 4 + 0] = frameBuffer[i] & 0xFF;        // Rojo
        imageData.data[i * 4 + 1] = (frameBuffer[i] >> 8) & 0xFF;  // Verde
        imageData.data[i * 4 + 2] = (frameBuffer[i] >> 16) & 0xFF; // Azul
        imageData.data[i * 4 + 3] = 255;                          // Alpha (opacidad)
    }

    // Dibuja el frame en el canvas
    ctx.putImageData(imageData, 0, 0);

    // Escala el canvas para ajustarlo al tamaño definido
    ctx.drawImage(canvas, 0, 0, 256, 240, 0, 0, canvas.width, canvas.height);
}


//Carga de los roms
document.getElementById('rom-input').addEventListener('change', function (event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function () {
        var romData = reader.result;
        nes.loadROM(romData);
        startEmulation(); //Una vez cargada la rom, inicializa el jeugo
    };

    // La lectura de la rom, se maneja de forma binaria
    reader.readAsBinaryString(file);
});

// Para correr el juego a 60 fps
function startEmulation() {
    let lastFrameTime = 0;
    const fps = 60;
    const frameInterval = 1000 / fps;

    function frame(time) {
        // Calcula el tiempo transcurrido desde el último frame
        const timeSinceLastFrame = time - lastFrameTime;

        if (timeSinceLastFrame >= frameInterval) {
            // Ejecuta un frame de la emulación
            nes.frame();
            lastFrameTime = time;
        }

        // Sigue el ciclo de frames
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}

//Controles
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            nes.buttonDown(1, jsnes.Controller.BUTTON_UP);
            break;
        case 'ArrowDown':
            nes.buttonDown(1, jsnes.Controller.BUTTON_DOWN);
            break;
        case 'ArrowLeft':
            nes.buttonDown(1, jsnes.Controller.BUTTON_LEFT);
            break;
        case 'ArrowRight':
            nes.buttonDown(1, jsnes.Controller.BUTTON_RIGHT);
            break;
        case 'z':  // Botón A
            nes.buttonDown(1, jsnes.Controller.BUTTON_A);
            break;
        case 'x':  // Botón B
            nes.buttonDown(1, jsnes.Controller.BUTTON_B);
            break;
        case 'Enter':  // Start
            nes.buttonDown(1, jsnes.Controller.BUTTON_START);
            break;
        case 'Shift':  // Select
            nes.buttonDown(1, jsnes.Controller.BUTTON_SELECT);
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            nes.buttonUp(1, jsnes.Controller.BUTTON_UP);
            break;
        case 'ArrowDown':
            nes.buttonUp(1, jsnes.Controller.BUTTON_DOWN);
            break;
        case 'ArrowLeft':
            nes.buttonUp(1, jsnes.Controller.BUTTON_LEFT);
            break;
        case 'ArrowRight':
            nes.buttonUp(1, jsnes.Controller.BUTTON_RIGHT);
            break;
        case 'z':  // Botón A
            nes.buttonUp(1, jsnes.Controller.BUTTON_A);
            break;
        case 'x':  // Botón B
            nes.buttonUp(1, jsnes.Controller.BUTTON_B);
            break;
        case 'Enter':  // Start
            nes.buttonUp(1, jsnes.Controller.BUTTON_START);
            break;
        case 'Shift':  // Select
            nes.buttonUp(1, jsnes.Controller.BUTTON_SELECT);
            break;
    }
});
