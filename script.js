let array = [];
const arraySize = 50;
const arrayContainer = document.getElementById('array-container');
let speed = 50;

function generateArray() {
    array = [];
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    renderArray();
}

function renderArray(activeIndices = [], sortedIndices = []) {
    arrayContainer.innerHTML = '';
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.style.height = `${value * 3}px`;
        bar.classList.add('bar');
        if (activeIndices.includes(index)) {
            bar.classList.add('active');
        } else if (sortedIndices.includes(index)) {
            bar.classList.add('sorted');
        }
        arrayContainer.appendChild(bar);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort() {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            renderArray([j, j + 1], []);
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                renderArray([j, j + 1], []);
                await sleep(speed);
            }
        }
        renderArray([], array.slice(array.length - i - 1));
    }
    renderArray([], array);
}

async function selectionSort() {
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            renderArray([minIndex, j], []);
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
            await sleep(speed);
        }
        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
        }
        renderArray([], array.slice(0, i + 1));
    }
    renderArray([], array);
}

async function insertionSort() {
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            j = j - 1;
            renderArray([j + 1, j + 2], []);
            await sleep(speed);
        }
        array[j + 1] = key;
        renderArray([], array.slice(0, i + 1));
    }
    renderArray([], array);
}

async function partition(low, high) {
    let pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        renderArray([j, high], []);
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            renderArray([i, j], []);
            await sleep(speed);
        }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    renderArray([i + 1, high], []);
    await sleep(speed);
    return i + 1;
}

async function quickSort(low, high) {
    if (low < high) {
        let pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
    renderArray([], array);
}

async function merge(left, mid, right) {
    let n1 = mid - left + 1;
    let n2 = right - mid;

    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = array[left + i];
    for (let j = 0; j < n2; j++) R[j] = array[mid + 1 + j];

    let i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        renderArray([left + i, mid + 1 + j], []);
        if (L[i] <= R[j]) {
            array[k] = L[i];
            i++;
        } else {
            array[k] = R[j];
            j++;
        }
        renderArray([k], []);
        await sleep(speed);
        k++;
    }

    while (i < n1) {
        array[k] = L[i];
        i++;
        k++;
        renderArray([k], []);
        await sleep(speed);
    }

    while (j < n2) {
        array[k] = R[j];
        j++;
        k++;
        renderArray([k], []);
        await sleep(speed);
    }
}

async function mergeSort(left, right) {
    if (left < right) {
        let mid = Math.floor((left + right) / 2);

        await mergeSort(left, mid);
        await mergeSort(mid + 1, right);
        await merge(left, mid, right);
    }
    renderArray([], array);
}

async function sortArray() {
    const algorithm = document.getElementById('algorithm-select').value;
    switch (algorithm) {
        case 'bubble':
            await bubbleSort();
            break;
        case 'selection':
            await selectionSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'quick':
            await quickSort(0, array.length - 1);
            break;
        case 'merge':
            await mergeSort(0, array.length - 1);
            break;
        default:
            break;
    }
}

function updateSpeed() {
    const speedInput = document.getElementById('speed').value;
    speed = 101 - speedInput; // Adjust speed to match the input range (1-100)
}

generateArray();
