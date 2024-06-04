import { fabricGif } from "./fabricGif";
import "./style.css";
import { fabric } from "fabric";

let canvas: fabric.Canvas;
let selectedText: fabric.Text | null = null;

document.addEventListener("DOMContentLoaded", async () => {
  canvas = new fabric.Canvas("canvas");

  if (canvas) {
    //@ts-ignore
    const gif = await fabricGif("/birthday.gif", canvas.width, canvas.height);
    //@ts-ignore
    gif.set({ top: 0, left: 0, right: 0, bottom: 0, selectable: false });
    //@ts-ignore
    canvas.add(gif);

    fabric.util.requestAnimFrame(function render() {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });

    // Add click event listener to each thumbnail image
    let thumbnails = document.querySelectorAll(".thumbnail");
    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener("click", () => {
        let imageUrl = thumbnail.getAttribute("src") as string;
        addGifToCanvas(imageUrl);
      });
    });
  }
});

const addTextToCanvas = () => {
  if (!canvas) {
    canvas = new fabric.Canvas("canvas");
  }

  let text = new fabric.Text("Hello World!!", {
    left: 50,
    top: 100,
    fontSize: 30,
    fill: "black",
    fontFamily: "Lato",
  });

  canvas.add(text);

  text.on("selected", () => {
    selectedText = text;
    let editor = document.getElementById("editor");
    let editorInput = document.getElementById(
      "editorInput"
    ) as HTMLInputElement;
    let fontSelect = document.getElementById("fontSelect") as HTMLSelectElement;
    let fontSizeSlider = document.getElementById(
      "fontSizeSlider"
    ) as HTMLInputElement;
    let colorInput = document.getElementById("colorInput") as HTMLInputElement;

    if (editor && editorInput && fontSelect && fontSizeSlider && colorInput) {
      editor.classList.remove("hidden");
      editorInput.value = text.text || "";
      fontSelect.value = text.fontFamily || "Lato";
      fontSizeSlider.value = text.fontSize?.toString() || "30";
      colorInput.value = text.fill?.toString() || "#000000";
    }
  });

  canvas.renderAll();
};

const updateText = () => {
  let editorInput = document.getElementById("editorInput") as HTMLInputElement;
  if (selectedText && editorInput) {
    selectedText.text = editorInput.value;
    canvas.renderAll();
  }
};

const updateFont = () => {
  let fontSelect = document.getElementById("fontSelect") as HTMLSelectElement;
  if (selectedText && fontSelect) {
    selectedText.set("fontFamily", fontSelect.value);
    canvas.renderAll();
  }
};

const updateFontSize = () => {
  let fontSizeSlider = document.getElementById(
    "fontSizeSlider"
  ) as HTMLInputElement;
  if (selectedText && fontSizeSlider) {
    selectedText.set("fontSize", parseInt(fontSizeSlider.value));
    canvas.renderAll();
  }
};

const updateFontColor = () => {
  let colorInput = document.getElementById("colorInput") as HTMLInputElement;
  if (selectedText && colorInput) {
    selectedText.set("fill", colorInput.value);
    canvas.renderAll();
  }
};

const exportCanvasToImage = () => {
  // Get data URL of canvas
  const dataURL = canvas.toDataURL({
    format: "png", // You can change the format to "jpeg" or "webp" if needed
    quality: 1, // Quality of the image (0 to 1)
  });

  // Create a temporary anchor element to download the image
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "canvas_image.gif"; // Change the filename if needed
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

document.getElementById("addText")!.onclick = addTextToCanvas;
document.getElementById("editorInput")!.oninput = updateText;
document.getElementById("fontSelect")!.onchange = updateFont;
document.getElementById("fontSizeSlider")!.oninput = updateFontSize;
document.getElementById("colorInput")!.oninput = updateFontColor;
document.getElementById("exportButton")!.onclick = exportCanvasToImage;

const addGifToCanvas = async (gifUrl: string) => {
  //@ts-ignore
  const gif = await fabricGif(gifUrl, 200, 200);
  //@ts-ignore
  gif.set({ top: 0, left: 0, right: 0, bottom: 0 });
  //@ts-ignore
  canvas.add(gif);

  fabric.util.requestAnimFrame(function render() {
    canvas.renderAll();
    fabric.util.requestAnimFrame(render);
  });
};
