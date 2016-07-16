window.onload = function() {
    // Create WebAudio context
    var ctx = new AudioContext();
    // Create gain node
    var node = ctx.createGain();
    // Connect gain node to context (output)
    node.connect(ctx.destination);

    // Add handler for play button
    var btn = document.getElementById('play');
    btn.onclick = function() {
        play(ctx, node);
    };
};

function play(ctx, node) {
    // Get current time in seconds
    var startTime = ctx.currentTime;
    // Set duration in seconds
    var duration = 1.0;
    // Get sample rate
    var rate = ctx.sampleRate;
    // Compute buffer length
    var length = rate * duration;
    // Create buffer
    var buffer = ctx.createBuffer(1, length, rate);
    // Grab channel for inserting samples
    var data = buffer.getChannelData(0);

    // Generate white noise
    for (var i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
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
