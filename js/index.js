window.onload = function() {
    // Create WebAudio context
    var ctx = new AudioContext();
    // Create gain node
    var node = ctx.createGain();
    // Connect gain node to context (output)
    node.connect(ctx.destination);

    // Add handler for volume slider
    var volume = document.getElementById('volume');
    volume.onchange = function() {
        node.gain.value = volume.value / 100;
    };

    // Add handler for play button
    var btn = document.getElementById('play');
    btn.onclick = function() {
        play(ctx, node);
    };
};

function play(ctx, node) {
    // Get current time in seconds
    var startTime = ctx.currentTime;
    // Set duration in seconds (of each note, sustain)
    var duration = 1.0;
    // Time between each note in seconds
    var speed = 0.25;
    // Sequence of frequencies
    var sequence = [220, 330, 440, 550, 660, 550, 440, 330];
    // Play sequence of notes
    for (var i = 0; i < sequence.length; i++) {
        var freq = sequence[i];
        playNote(ctx, node, freq, startTime, duration);
        startTime += speed;
    }
    // Finish with longer note
    playNote(ctx, node, 220, startTime, duration * 4);
}

function playNote(ctx, node, freq, startTime, duration) {
    // Get sample rate
    var rate = ctx.sampleRate;
    // Compute buffer length
    var length = rate * duration;
    // Create buffer
    var buffer = ctx.createBuffer(1, length, rate);
    // Grab channel for inserting samples
    var data = buffer.getChannelData(0);
    // Get wave period
    var period = Math.floor(rate / freq);

    // Generate white noise (random excitation)
    for (var i = 0; i < period; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    // Decay of feedback loop
    var decay = 0.993;
    // Length of buffer beyond initial excitation
    var len = data.length - period;

    // Feedback loop
    for (var i = 0; i < len; i++) {
        data[i + period] = (data[i] + data[i + 1]) * decay * 0.5;
    }

    // Create audio source
    var source = ctx.createBufferSource();
    // Set buffer to our created one
    source.buffer = buffer;
    // Connect to gain node
    source.connect(node);
    // Play audio source at startTime
    source.start(startTime);
}
