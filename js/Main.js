import Loader from "./Loader.js";
import Halftone from "./Halftone.js";


class Main {

    static init() {
        Loader.init();
        Halftone.init(Loader.img);
        Loader.draw = Halftone.draw.bind(Halftone);
    }

}

Main.init();