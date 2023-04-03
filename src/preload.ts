const doPreload = async () => {
    const getCanvas = () => document.querySelector<HTMLCanvasElement>("#layaCanvas");
    const getContext = () => getCanvas().getContext("webgl2");

    window.addEventListener("online", (event) => {
        console.log(event);
    });
};

doPreload().catch(console.error);
