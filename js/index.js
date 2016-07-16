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
}
