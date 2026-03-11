/* Static "S" favicon — pink on blue */
(function () {
  var size = 64;
  var canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  var ctx = canvas.getContext('2d');

  var link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  document.head.appendChild(link);

  // Blue background with rounded corners
  ctx.fillStyle = '#4a6fa5';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, 10);
  ctx.fill();

  // Pink "S"
  ctx.fillStyle = '#e05088';
  ctx.font = 'bold 46px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('S', size / 2, size / 2 + 2);

  link.href = canvas.toDataURL('image/png');
})();
