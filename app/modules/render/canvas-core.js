// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';
import d3 from '../../vendor/d3.js';
import { requestDraw } from './loop.js';

const gfxCanvas = document.getElementById("graphCanvas");

const ctx = gfxCanvas.getContext("2d");

const gfxSvg = d3.select(gfxCanvas);

const pickCanvas = document.createElement("canvas");

const pickCtx = pickCanvas.getContext("2d", { willReadFrequently: true });

const PICK_LINK_WIDTH = 10;

let dpr = window.devicePixelRatio || 1;

function resizeCanvas() {
      dpr = window.devicePixelRatio || 1;
      gfxCanvas.width  = Math.max(1, Math.round(S.viewWidth  * dpr));
      gfxCanvas.height = Math.max(1, Math.round(S.viewHeight * dpr));
      gfxCanvas.style.width  = S.viewWidth  + "px";
      gfxCanvas.style.height = S.viewHeight + "px";
      pickCanvas.width  = gfxCanvas.width;
      pickCanvas.height = gfxCanvas.height;
      S.pickDirty = true;
      requestDraw();
    }

const renderState = {
      transform: d3.zoomIdentity,
      nodeClasses: {},      // dimmed / highlighted / selected -> Set<id>
      linkClasses: {},      // dimmed / highlighted / selected / path-highlight -> Set<link>
      hoveredNode: null,
      hoveredLink: null,
      uniformLinkWidth: false,
      radius: new Map(),    // текущий радиус узла
      labelDy: new Map(),     // текущее смещение подписи
      anim: null,         // { from, to, dyFrom, dyTo, t0, dur }
    };

export { PICK_LINK_WIDTH, ctx, dpr, gfxCanvas, gfxSvg, pickCanvas, pickCtx, renderState, resizeCanvas };
