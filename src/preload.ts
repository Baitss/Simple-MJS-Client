const doPreload = async () => {
    const getCanvas = () => document.querySelector<HTMLCanvasElement>("#layaCanvas");
    const getContext = () => getCanvas().getContext("webgl2");
};

doPreload();
