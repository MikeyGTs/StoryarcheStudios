/* Animated rotating-color "S" favicon */
(function () {
  var colors = [
    '#ffffff',  // white
    '#f5b731',  // gold
    '#f07c4a',  // orange
    '#e05088',  // pink
    '#a66de8',  // purple
    '#6b5b95',  // dark purple
    '#4a6fa5',  // blue
    '#b56b8a',  // rose
    '#4a5a7a',  // dark blue
  ];

  var size = 64;
  var canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  var ctx = canvas.getContext('2d');

  var link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  document.head.appendChild(link);

  var index = 0;

  function draw() {
    ctx.clearRect(0, 0, size, size);

    // Black background with rounded corners
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, 10);
    ctx.fill();

    // Draw "S"
    ctx.fillStyle = colors[index];
    ctx.font = 'bold 46px Manrope, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('S', size / 2, size / 2 + 2);

    link.href = canvas.toDataURL('image/png');
    index = (index + 1) % colors.length;
  }

  draw();
  setInterval(draw, 1500);
})();
