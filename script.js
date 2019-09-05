const colorBtn = $('#color'),
      sizeBtn = $('#size'),
      saveBtn = $('#save'),
      loadBtn = $('#load'),
      resetBtn = $('#reset'),
      layerBtn = $('#layer'),
      tools = $('#tools');

var canvas = $('.canvas'),
    layer = $('.layer'),
    brushes = $('.brushes'),
    ctx = canvas[0].getContext('2d'),
    isPainting = false,
    firstClick = true,
    currentPos = {x : 0, y: 0},
    brush = {
        color: colorBtn.val(),
        size : sizeBtn.val(),
        type : 'crayon',
    },
    layerId = 0,
    layerIndex = 1,
    layerCxt = [],
    currentCanvas = canvas;

canvas.attr({
    height: window.innerHeight,
    width: window.innerWidth
})

function init() {
    currentCanvas.mousedown(function() {
        if(brush.type !== 'line') ctx.beginPath();
        isPainting = true;
    })
    .mouseup(function() {
        isPainting = false;
    })
    .mousemove(function(e) {
        if (brush.type == 'crayon') paint(e);
        if (brush.type == 'eraser') erase(e);
    })
    .mouseleave(function(){
        isPainting = false;
    })
    .click(function(e) {
        if (brush.type === 'crayon' || brush.type === 'eraser') return;
    
        if (firstClick) {
            firstClick = false;
            currentPos.x = e.offsetX;
            currentPos.y = e.offsetY;
    
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        } else {
            firstClick = true;
            let a = currentPos.x - e.offsetX;
            let b = currentPos.y - e.offsetY;
    
            brushStyle();
    
            switch(brush.type) {
                case 'line':
                    ctx.lineTo(e.offsetX, e.offsetY);
                    ctx.stroke();
                    ctx.closePath();
                    break;
                case 'rec':
                    ctx.strokeRect(currentPos.x, currentPos.y, (e.offsetX - currentPos.x), (e.offsetY - currentPos.y));
                    break;
                case 'fillRec':
                    ctx.fillRect(currentPos.x, currentPos.y, (e.offsetX - currentPos.x), (e.offsetY - currentPos.y));
                    break;
                case 'cir':
                    ctx.arc(currentPos.x, currentPos.y, Math.hypot(a,b), 0, ( 2 * Math.PI));
                    ctx.stroke();
                    break;
                case 'fillCir':
                    ctx.arc(currentPos.x, currentPos.y, Math.hypot(a,b), 0, ( 2 * Math.PI));
                    ctx.fill();
                    break;
            }
        }
    });


    $('.visibility-btn').click(function() {
        let layerNumber = $(this).val();
        ($('#canvas-' + layerNumber).toggleClass('hide'));
        (currentCanvas);
    });
}

function paint(e) {
    if (!isPainting) return;
    brushStyle();
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}

function erase(e) {
    if (!isPainting) return;
    ctx.clearRect(e.offsetX, e.offsetY, brush.size, brush.size);
}

function brushStyle() {
    ctx.lineCap = 'round';
    ctx.lineWidth = brush.size;
    ctx.strokeStyle = brush.color;
    ctx.fillStyle = brush.color;
}

init();

brushes.click(function() {
    brush.type = $(this).attr('id');
});

sizeBtn.change(function() {
    brush.size = $(this).val();
});

colorBtn.change(function() {
    brush.color = $(this).val();
});

saveBtn.click(function() {
    $('#link').attr('href', canvas[0].toDataURL());
});

loadBtn.change(function(e) {
    let img = new Image();

    img.onload = function() {
        ctx.drawImage(img, 0, 0);
    };
    img.src = URL.createObjectURL($('#load')[0].files[0]);
});

resetBtn.click(function(e) {
    ctx.clearRect(0, 0, canvas.width(), canvas.height());
});

layerBtn.click(function() {
    layerId ++;
    layerIndex ++;
    
    let newCanvas = 
    $('<canvas id="canvas-'+ layerId +'" class="canvas"></canvas>')
    .appendTo($('#warp'))
    .attr({
        height: window.innerHeight,
        width: window.innerWidth
    })
    .css({
        'position': 'absolute',
        'top': 0,
        'left': 0,
        'z-index': layerIndex,
    });
    
    tools.append(
        '<p>' +
            'Calque ' + layerId +
            '<button id="layer-' + layerId +'" class="visibility-btn" value="' + layerId + '"' + '>Afficher' + '</button>' +
        '</p>'
    );

    ctx = newCanvas[0].getContext('2d');
    currentCanvas = newCanvas;
    
    layerCxt["ctx"+layerId] = newCanvas[0].getContext('2d');
    canvas.push(newCanvas[0]);
    
    init();
});

canvas.on('drop', function(e) {
    e.preventDefault();
    (e.originalEvent.dataTransfer.files);
    
    let file = e.originalEvent.dataTransfer.files,
    img = new Image();
    
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        (file);
        ('load');
    };
    img.src = URL.createObjectURL(file[0]);
})
.on('dragover', function(e) {
    e.preventDefault();
});
