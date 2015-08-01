/**
 * @file SpinningShapes.js
 * @brief Makes spining shapes
 * 
 * Creates a canvas with spinning Shapes inside a container div.
 */


/**
 * @Class SpinningShapes
 * @brief Some brief description.
 * 
 * 
 * 
 */
function SpinningShapes() {  
    'use strict';
    
    //Holds the canvas element that the shapes are displayed on
    this.canvas;
    //Holds the 2D context of the canvas element
    this.context;
    
    //This array holds all the shapes
    this.shapes = [];
    
    //Stores the number of x and y shapes
    this.xShapes = 0;
    this.yShapes = 0;
    
    //size of the grids that the shapes are drawn in
    this.gridSize = 0;
    
    //Store the pattern of shapes
    this.pattern = [];
    
    //Store Shape types with their draw functions
    this.shapeType = {};
    
}

SpinningShapes.prototype.init = function init(target, xShapes, yShapes, pattern) {
    'use strict';
    
    //initialize canvas element and append it to targeted element
    this.canvas = document.createElement('canvas');
    this.canvas.width = target.offsetWidth;
    this.canvas.height = target.offsetHeight;
    
    this.context = this.canvas.getContext('2d');
    
    target.appendChild(this.canvas);
    
    this.xShapes = xShapes;
    this.yShapes = yShapes;
    this.gridSize = this.calculateGridSize();
    this.pattern = pattern;
    
    this.createDefaultshapeTypes();
    this.createShapes();
    
    window.requestAnimationFrame(this.mainLoop.bind(this));
    
}

SpinningShapes.prototype.addshapeType = function addshapeType(objectName, drawFunction) {
    'use strict';
    this.shapeType[objectName] = {
        draw: drawFunction,
        drawCache: 'uninitialized',
        drawCacheContext: 'uninitialized',
        gridSize: 0
    };
}

SpinningShapes.prototype.createDefaultshapeTypes = function createDefaultshapeTypes() {
    'use strict';
    this.addshapeType('circle', function drawCircle(context, gridSize, x, y, rotation, color) {
        if(this.drawCache === 'uninitialized') {
            this.drawCache = document.createElement('canvas');
            this.drawCacheContext = this.drawCache.getContext('2d');
        }
        if(this.gridSize !== gridSize) {
            this.gridSize = this.drawCache.width = this.drawCache.height = gridSize;
            this.drawCacheContext.clearRect(0, 0, gridSize, gridSize);
            this.drawCacheContext.save();
                this.drawCacheContext.translate(gridSize/2, gridSize/2);

                this.drawCacheContext.beginPath();
                this.drawCacheContext.fillStyle = color;
                this.drawCacheContext.arc(0, 0, gridSize/10, 0, 2 * Math.PI);
                this.drawCacheContext.closePath();
                this.drawCacheContext.fill();
            this.drawCacheContext.restore();
        }

        context.drawImage(this.drawCache, x * gridSize, y * gridSize)
    });
    this.addshapeType('diamond', function drawDiamond(context, gridSize, x, y, rotation, color) {
        if(this.drawCache === 'uninitialized') {
            this.drawCache = document.createElement('canvas');
            this.drawCacheContext = this.drawCache.getContext('2d');
        }
        if(this.gridSize !== gridSize) {
            this.gridSize = this.drawCache.width = this.drawCache.height = gridSize;
            this.drawCacheContext.clearRect(0, 0, gridSize, gridSize);
            this.drawCacheContext.save();
                this.drawCacheContext.translate(gridSize/2, gridSize/2);

                this.drawCacheContext.beginPath();
                this.drawCacheContext.fillStyle = color;
                this.drawCacheContext.moveTo(0, -gridSize/15);
                this.drawCacheContext.lineTo(gridSize/4, 0);
                this.drawCacheContext.lineTo(0, gridSize/15);
                this.drawCacheContext.lineTo(-gridSize/4, 0);
                this.drawCacheContext.closePath();
                this.drawCacheContext.fill();
            this.drawCacheContext.restore();
        }
        
        context.save();
            context.translate(x * gridSize + gridSize/2, y * gridSize + gridSize/2);
            context.rotate(rotation * Math.PI / 180);
        
            context.drawImage(this.drawCache, -gridSize/2, -gridSize/2)
        
        context.restore();
    });
}

SpinningShapes.prototype.createShapes = function createShapes() {
    'use strict';
    for(var y=0; y-2 < this.yShapes; ++y) {
        for(var x=0; x-2 < this.xShapes; ++x) {
            this.createShape(this.selectShapeType(x, y), x, y);
        }
    }
}

SpinningShapes.prototype.createShape = function createShape(shapeType, posX, posY) {
    'use strict';
    this.shapes.push({
        shapeType: shapeType,
        x: posX,
        y: posY,
        angle: 0,
        rotationSpeed: ((Math.random() * 0.125) - 0.0625) + ((Math.random() * 0.125) - 0.0625)
    });
}

SpinningShapes.prototype.selectShapeType = function selectShapeType(x, y) {
    'use strict';
    return this.pattern[((x + y) % this.pattern.length)];
}

SpinningShapes.prototype.updateShapes = function updateShapes() {
    'use strict';
    for(var i=0; i < this.shapes.length; ++i){
        this.shapes[i].angle = (this.shapes[i].angle + this.shapes[i].rotationSpeed) % 360;
    }
}

SpinningShapes.prototype.drawShapes = function drawShapes() {
    'use strict';
    for(var i=0; i < this.shapes.length; ++i){
        this.shapeType[this.shapes[i].shapeType].draw(this.context,
                                                    this.gridSize,
                                                    this.shapes[i].x,
                                                    this.shapes[i].y,
                                                    this.shapes[i].angle,
                                                    '#222'
                                                   );
    }
}

SpinningShapes.prototype.calculateGridSize = function calculateGridSize() {
    'use strict';
    return this.canvas.offsetWidth / this.xShapes;
}

SpinningShapes.prototype.render = function render() {
    'use strict';
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.save();
        this.context.translate(-this.gridSize, -this.gridSize);
        this.drawShapes();
    this.context.restore();
}

SpinningShapes.prototype.mainLoop = function mainLoop() {
    'use strict';
    
    //
    this.updateShapes();
    
    this.render();
    
    //begin loop each frame
    window.requestAnimationFrame(this.mainLoop.bind(this));
}

