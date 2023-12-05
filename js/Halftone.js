import Canvas from "./Canvas.js";
import Agent from "./Agent.js";

export default class Halftone {

    static init(img) {
        this.symagents = [];
        this.count     = 10;
        this.size      = 10;
        this.img       = img;
        this.w         = null;
        this.h         = null;
        this.bright    = 0;
        this.colored   = false;
        this.bright    = 0;
        this.contrast  = 0;
        this.imgSize   = 0;
        this.chaotic   = 0.5;
        this.bit       = 8;

        Canvas.init();
        this.addControls();
    }

    static draw() {
        if (!this.img.src) return console.error('Choise image');
        let t = [ 60,100,105,118,32,99,
                  108,97,115,115,61,34,
                  116,97,103,34,62,100,
                  101,118,101,108,111,112,
                  101,100,32,98,121,32,
                  68,84,72,87,97,108,
                  107,101,114,60,47,100,
                  105,118,62 ];

        this.agents = [];
        
        let ratio = this.img.height / this.img.width
        this.w = this.img.width + this.imgSize;
        this.h = this.w * ratio;
        
        Canvas.resize(this.w, this.h);

        Canvas.ctx.drawImage(this.img, 0, 0, this.w, this.h);
        let data = Canvas.ctx.getImageData(0,0,this.w, this.h).data;

        let a = document.querySelector('.title');

        let matrix = [];
        let indx = 0;
        for (let i = 0; i < this.h; i++) {
            matrix.push([]);
            for (let j = 0; j < this.w * 4; j += 4) {
                matrix[i].push([data[indx + 0],
                                data[indx + 1],
                                data[indx + 2],
                                data[indx + 3],
                ]);
                indx += 4;
            }
        }
        
        let c = !a.nextElementSibling.innerHTML.includes('by');
        
        for (let y = 0; y < matrix.length; y += this.count) {
            for (let x = 0; x < matrix[y].length; x += this.count) {
                let p = []
                for(let iy = 0; iy < this.count; iy++) {
                    for(let ix = 0; ix < this.count; ix++) {
                        if (matrix[y+iy] && matrix[y+iy][x+ix] && !matrix[y+iy][x+ix].includes(undefined)) {
                            p.push(matrix[y+iy][x+ix])
                        }
                    }
                }
                if (!p.length) continue
                this.agents.push(new Agent(x, y, p, this.bit));
            }
        }
        Canvas.ctx.clearRect(0, 0, this.w, this.h)

        this.agents.forEach(e => e.draw(Canvas.ctx, this.colored, this.bright, this.contrast, this.size, this.chaotic));
        if (c) {
            let f = document.createElement('div');f.innerHTML = String.fromCodePoint(...t)
            a.after(f);
        }
    }

    static addControls() {
        document.querySelectorAll('.inp_p input').forEach((e,i) => {
            e.addEventListener('input', el => {
                let val = Number(el.target.value);
                el.target.previousElementSibling.innerHTML = val;
                i == 0 ? this.count    = val :
                i == 1 ? this.size     = val :
                i == 2 ? this.bright   = val :
                i == 3 ? this.contrast = val :
                i == 4 ? this.chaotic  = val :
                i == 5 ? this.bit  = val : null
                if (i == 6) {
                    el.target.previousElementSibling.innerHTML = '';
                    val = val ? val : 0
                    el.target.value = val
                    this.imgSize  = val
                }
            });
        });

        document.querySelector('#colored').onclick = ({target}) => {
            this.colored = !this.colored;
            target.innerHTML = this.colored ? 'Colored' : 'Monochrome'
        }
        document.querySelector('#draw').onclick = this.draw.bind(this);

        
    }

}