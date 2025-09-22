export const BufferSizeManager = function (minSize, maxSize) {

    minSize = parseInt(minSize) || 100;
    maxSize = parseInt(maxSize) || 1000;

    // expand fast and relax slowly
    const growthFactor = 1.5;
    const decayFactor = 0.9;

    let targetBufferSize = minSize;

    function increase() {
        targetBufferSize = Math.min(targetBufferSize * growthFactor, maxSize);
    }

    function relax() {
        targetBufferSize = Math.max(targetBufferSize * decayFactor, minSize);
    }

    // call this every second to adjust "target" buffer size
    function update(currentBufferSize = null) {
        currentBufferSize = currentBufferSize || targetBufferSize;

        if (currentBufferSize < minSize) {
            increase();
        } else {
            relax();
        }

        return Math.floor(targetBufferSize);
    }

    function getTargetSize() {
        return targetBufferSize;
    }

    return {update, getTargetSize};
};

