// ============================================================
// Draggable, Resizable & Minimizable Panels Engine
// ============================================================

function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    let header = element.querySelector(".panel-header");
    if (!header) header = element.querySelector("h3");
    if (!header) return; 

    if (!header.classList.contains('panel-header')) {
        header.classList.add('panel-header');
    }

    header.style.cursor = "grab";
    header.addEventListener('mousedown', dragMouseDown);

    function dragMouseDown(e) {
        if (['INPUT', 'BUTTON', 'SELECT', 'CANVAS'].includes(e.target.tagName)) return;
        e.preventDefault();

        element.style.zIndex = "9999";
        element.classList.add('dragging');
        header.style.cursor = "grabbing";

        pos3 = e.clientX;
        pos4 = e.clientY;
        document.addEventListener('mouseup', closeDragElement);
        document.addEventListener('mousemove', elementDrag);
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
        element.style.right = "auto";
        element.style.bottom = "auto";
        element.style.transform = "none"; 
        element.style.margin = "0";
    }

    function closeDragElement() {
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('mousemove', elementDrag);
        element.classList.remove('dragging');
        header.style.cursor = "grab";
    }
}

function makeResizable(element) {
    let resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.style.cssText = `
        position: absolute; bottom: 0; right: 0; width: 20px; height: 20px;
        cursor: nwse-resize; z-index: 10000;
        background: linear-gradient(135deg, transparent 50%, rgba(74,158,255,0.5) 50%);
        border-bottom-right-radius: 14px;
    `;
    
    element.style.position = 'fixed';
    element.style.overflow = 'auto';
    element.appendChild(resizeHandle);

    let startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        startX = e.clientX; startY = e.clientY;
        startWidth = element.offsetWidth; startHeight = element.offsetHeight;
        element.classList.add('resizing');
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });

    function resize(e) {
        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);
        if (newWidth > 200) element.style.width = newWidth + 'px';
        if (newHeight > 150) element.style.height = newHeight + 'px';
    }

    function stopResize() {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
        element.classList.remove('resizing');
    }
}

function addMinimizeButton(element) {
    const header = element.querySelector('.panel-header');
    if (!header) return;
    if (header.querySelector('.minimize-btn')) return;

    const minBtn = document.createElement('button');
    minBtn.className = 'minimize-btn';
    minBtn.innerHTML = '➖';
    minBtn.title = 'Minimize / Restore';
    minBtn.style.cssText = `
        background: rgba(255,255,255,0.1); border: none; color: #fff;
        cursor: pointer; font-size: 0.8rem; padding: 4px 8px;
        border-radius: 4px; margin-left: 8px; transition: all 0.2s;
    `;
    
    header.appendChild(minBtn);

    const originalContent = [];
    Array.from(element.children).forEach(child => {
        if (child !== header && !child.classList.contains('resize-handle')) {
            originalContent.push(child);
        }
    });

    let isMinimized = false;

    minBtn.onclick = (e) => {
        e.stopPropagation();
        isMinimized = !isMinimized;

        if (isMinimized) {
            originalContent.forEach(child => child.style.display = 'none');
            element.style.height = 'auto';
            element.style.width = '200px';
            minBtn.innerHTML = '🔲';
            minBtn.style.background = '#4a9eff';
        } else {
            originalContent.forEach(child => child.style.display = '');
            element.style.height = '';
            minBtn.innerHTML = '➖';
            minBtn.style.background = 'rgba(255,255,255,0.1)';
        }
    };
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const panelsToHandle = [
            document.getElementById('simulatorPanel'),
            document.getElementById('comparisonPanel'),
            document.getElementById('plannerPanel'),
            document.getElementById('liveData'),
            document.getElementById('issTracker'),
            document.getElementById('multiplayerPanel'),
            document.getElementById('pakistanSolar'),
            document.getElementById('moonPhase'),
            document.getElementById('panel')
        ];

        panelsToHandle.forEach(panel => {
            if (panel) {
                makeDraggable(panel);
                makeResizable(panel);
                addMinimizeButton(panel);
            }
        });

        const closeMp = document.getElementById('closeMultiplayer');
        if (closeMp) {
            closeMp.addEventListener('click', () => {
                document.getElementById('multiplayerPanel').style.display = 'none';
            });
        }
    }, 500);
});