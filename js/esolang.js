function bf(code, input = "") {
    code = code.replace(/[^\+\-\<\>\[\]\.,]/g, "");
    const mem = new Uint8Array(30000);
    let ptr = 0;
    let pc = 0;
    let inputPtr = 0;
    let output = "";
    const loopMap = {};
    const stack = [];
    for (let i = 0; i < code.length; i++) {
        if (code[i] === "[") {
            stack.push(i);
        } else if (code[i] === "]") {
            if (stack.length === 0) {
                throw new Error("Unmatched ] at " + i);
            }
            const start = stack.pop();
            loopMap[start] = i;
            loopMap[i] = start;
        }
    }
    if (stack.length !== 0) {
        throw new Error("Unmatched [ at " + stack.pop());
    }
    while (pc < code.length) {
        const cmd = code[pc];
        switch (cmd) {
            case ">":
                ptr++;
                if (ptr >= mem.length) {
                    throw new Error("Pointer overflow");
                }
                break;
            case "<":
                ptr--;
                if (ptr < 0) {
                    throw new Error("Pointer underflow");
                }
                break;
            case "+":
                mem[ptr] = (mem[ptr] + 1) & 255;
                break;
            case "-":
                mem[ptr] = (mem[ptr] - 1) & 255;
                break;
            case ".":
                output += String.fromCharCode(mem[ptr]);
                break;
            case ",":
                mem[ptr] = inputPtr < input.length ? input.charCodeAt(inputPtr++) : 0;
                break;
            case "[":
                if (mem[ptr] === 0) {
                    pc = loopMap[pc];
                }
                break;
            case "]":
                if (mem[ptr] !== 0) {
                    pc = loopMap[pc];
                }
                break;
        }
        pc++;
    }
    return output;
}
const malbolge = (function() {
    const xlat1 = "+b(29e*j1VMEKLyC})8&m#~W>qxdRp0wkrUo[D7,XTcA\"lI.v%{gJh4G\\-=O@5`_3i<?Z';FNQuY]szf$!BS/|t:Pn6^Ha";
    const xlat2 = "5z]&gqtyfr$(we4{WP)H-Zn,[%\\3dL+Q;>U!pJS72FhOA1CB6v^=I_0/8|jsb9m<.TVac`uY*MK'X~xDl}REokN:#?G\"i@";

    function op(x, y) {
        const p9 = [1, 9, 81, 729, 6561];
        const o = [
            [4,3,3,1,0,0,1,0,0],
            [4,3,5,1,0,2,1,0,2],
            [5,5,4,2,2,1,2,2,1],
            [4,3,3,1,0,0,7,6,6],
            [4,3,5,1,0,2,7,6,8],
            [5,5,4,2,2,1,8,8,7],
            [7,6,6,7,6,6,4,3,3],
            [7,6,8,7,6,8,4,3,5],
            [8,8,7,8,8,7,5,5,4]
        ];
        let i = 0;
        for (let j = 0; j < 5; j++) {
            i += o[Math.floor(y / p9[j]) % 9][Math.floor(x / p9[j]) % 9] * p9[j];
        }
        return i % 59049;
    }

    return function(code, input="") {
        const MEM_SIZE = 59049;
        const mem = new Uint16Array(MEM_SIZE);
        let i = 0;

        for (let ch of code) {
            if (/\s/.test(ch)) continue;
            let x = ch.charCodeAt(0);
            if (i >= MEM_SIZE) throw new Error("input too long");
            mem[i++] = x;
        }

        while (i < MEM_SIZE) {
            mem[i] = op(mem[i-1], mem[i-2]);
            i++;
        }

        let a = 0, c = 0, d = 0;
        let output = "";
        let inputPtr = 0;

        while (true) {
            let v = mem[c];

            if (v < 33 || v > 126) {
                c = (c + 1) % MEM_SIZE;
                d = (d + 1) % MEM_SIZE;
                continue;
            }

            let cmd = xlat1[(v - 33 + c) % 94];

            switch(cmd) {
                case 'j':
                    d = mem[d] % MEM_SIZE;
                    break;

                case 'i':
                    c = mem[d] % MEM_SIZE;
                    break;

                case '*':
                    mem[d] = (Math.floor(mem[d] / 3) + (mem[d] % 3) * 19683) % MEM_SIZE;
                    a = mem[d];
                    break;

                case 'p':
                    mem[d] = op(a, mem[d]);
                    a = mem[d];
                    break;

                case '<':
                    output += String.fromCharCode(a & 0xFF);
                    break;

                case '/':
                    if (inputPtr >= input.length) {
                        a = 59048;
                    } else {
                        a = input.charCodeAt(inputPtr++);
                    }
                    break;

                case 'v':
                    return output;
            }

            mem[c] = 33 + (xlat2[mem[c] - 33].charCodeAt(0) - 33) % 94;

            c = (c + 1) % MEM_SIZE;
            d = (d + 1) % MEM_SIZE;
        }
    };
})();
function befunge(code, input = "") {
    const WIDTH = 80;
    const HEIGHT = 25;
    const grid = Array.from({length: HEIGHT}, () => Array(WIDTH).fill(' '));

    const lines = code.split('\n');

    for (let y = 0; y < Math.min(HEIGHT, lines.length); y++) {
        for (let x = 0; x < Math.min(WIDTH, lines[y].length); x++) {
            grid[y][x] = lines[y][x];
        }
    }

    const stack = [];

    const push = v => stack.push(v);
    const pop = () => stack.length > 0 ? stack.pop() : 0;

    let x = 0;
    let y = 0;

    let dx = 1;
    let dy = 0;

    let stringMode = false;

    let inputPtr = 0;

    let output = "";

    while (true) {
        let instr = grid[y][x];

        if (stringMode && instr !== '"') {
            push(instr.charCodeAt(0));
        } else {
            switch(instr) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    push(parseInt(instr));
                    break;

                case '+':
                    push(pop() + pop());
                    break;

                case '-': {
                    const b = pop();
                    const a = pop();
                    push(a - b);
                    break;
                }

                case '*':
                    push(pop() * pop());
                    break;

                case '/': {
                    const b = pop();
                    const a = pop();
                    push(b === 0 ? 0 : Math.floor(a / b));
                    break;
                }

                case '%': {
                    const b = pop();
                    const a = pop();
                    push(b === 0 ? 0 : a % b);
                    break;
                }

                case '!':
                    push(pop() === 0 ? 1 : 0);
                    break;

                case '`': {
                    const b = pop();
                    const a = pop();
                    push(a > b ? 1 : 0);
                    break;
                }

                case '>':
                    dx = 1;
                    dy = 0;
                    break;

                case '<':
                    dx = -1;
                    dy = 0;
                    break;

                case '^':
                    dx = 0;
                    dy = -1;
                    break;

                case 'v':
                    dx = 0;
                    dy = 1;
                    break;

                case '?': {
                    const dirs = [
                        [1,0],
                        [-1,0],
                        [0,1],
                        [0,-1]
                    ];

                    [dx, dy] = dirs[Math.floor(Math.random() * 4)];
                    break;
                }

                case '_': {
                    const a = pop();
                    dx = a === 0 ? 1 : -1;
                    dy = 0;
                    break;
                }

                case '|': {
                    const a = pop();
                    dy = a === 0 ? 1 : -1;
                    dx = 0;
                    break;
                }

                case ':':
                    push(stack.length > 0 ? stack[stack.length - 1] : 0);
                    break;

                case '\\': {
                    const a = pop();
                    const b = pop();
                    push(a);
                    push(b);
                    break;
                }

                case '$':
                    pop();
                    break;

                case '.':
                    output += pop().toString() + " ";
                    break;

                case ',':
                    output += String.fromCharCode(pop());
                    break;

                case '"':
                    stringMode = !stringMode;
                    break;

                case '#':
                    x = (x + dx + WIDTH) % WIDTH;
                    y = (y + dy + HEIGHT) % HEIGHT;
                    break;

                case '@':
                    return output;

                case '&': {
                    let val = inputPtr < input.length
                        ? parseInt(input[inputPtr++])
                        : 0;

                    push(val);
                    break;
                }

                case '~': {
                    let ch = inputPtr < input.length
                        ? input.charCodeAt(inputPtr++)
                        : 0;

                    push(ch);
                    break;
                }

                case ' ':
                    break;

                default:
                    break;
            }
        }

        x = (x + dx + WIDTH) % WIDTH;
        y = (y + dy + HEIGHT) % HEIGHT;
    }
}
