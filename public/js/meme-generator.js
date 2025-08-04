let selectedImage = '';
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');

const topInput = document.getElementById('topText');
const bottomInput = document.getElementById('bottomText');
const colorPicker = document.getElementById('textColor');
const fontSelect = document.getElementById('fontSelect');
const fontSizeInput = document.getElementById('fontSize');
const downloadBtn = document.getElementById('downloadMeme');
const searchInput = document.getElementById('searchInput');
const memeItems = document.querySelectorAll('.meme-item');

let textElements = [
    { text: '', x: 150, y: 40, isDragging: false },
    { text: '', x: 150, y: 100, isDragging: false }
];

let dragIndex = -1;

window.selectMeme = function (url) {
    selectedImage = url;
    loadMeme();
};

function loadMeme() {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedImage;
    img.onload = () => {
        canvas.width = img.width > 500 ? 500 : img.width;
        canvas.height = (img.height / img.width) * canvas.width;
        document.getElementById('placeholderText').style.display = 'none';
        drawMeme(img);
    };
}

function drawMeme(img) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const fontSize = parseInt(fontSizeInput.value);
    ctx.font = `${fontSize}px ${fontSelect.value}`;
    ctx.fillStyle = colorPicker.value;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';

    textElements[0].text = topInput.value.toUpperCase();
    textElements[1].text = bottomInput.value.toUpperCase();

    textElements.forEach(el => {
        ctx.fillText(el.text, el.x, el.y);
        ctx.strokeText(el.text, el.x, el.y);
    });
}

function updateMeme() {
    if (!selectedImage) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedImage;
    img.onload = () => drawMeme(img);
}

[topInput, bottomInput, colorPicker, fontSelect, fontSizeInput].forEach(el => {
    el.addEventListener('input', updateMeme);
});

// Drag functionality
canvas.addEventListener('mousedown', (e) => {
    const mousePos = getMousePos(canvas, e);
    textElements.forEach((el, i) => {
        if (ctx.measureText(el.text).width > 0) {
            const textWidth = ctx.measureText(el.text).width;
            const textHeight = parseInt(fontSizeInput.value);
            if (
                mousePos.x > el.x - textWidth / 2 &&
                mousePos.x < el.x + textWidth / 2 &&
                mousePos.y > el.y - textHeight &&
                mousePos.y < el.y
            ) {
                el.isDragging = true;
                dragIndex = i;
            }
        }
    });
});

canvas.addEventListener('mousemove', (e) => {
    if (dragIndex !== -1) {
        const mousePos = getMousePos(canvas, e);
        textElements[dragIndex].x = mousePos.x;
        textElements[dragIndex].y = mousePos.y;
        updateMeme();
    }
});

canvas.addEventListener('mouseup', () => {
    if (dragIndex !== -1) {
        textElements[dragIndex].isDragging = false;
        dragIndex = -1;
    }
});

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// Download
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Search filter
searchInput.addEventListener('input', function () {
    const keyword = this.value.toLowerCase();
    memeItems.forEach(item => {
        const memeName = item.getAttribute('data-name');
        item.style.display = memeName.includes(keyword) ? 'block' : 'none';
    });
});
