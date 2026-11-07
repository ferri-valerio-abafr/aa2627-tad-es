// Riferimento: Max Bill, una litografia del portfolio "10 original-lithos", 1941.
// Fonte: https://blog.ilgiornale.it/franza/2026/04/14/max-bill-1908-1994-e-la-grammatica-della-bellezza-al-m-a-x-museo-di-chiasso-e-lesposizione-piu-vasta-tenutasi-in-canton-ticino-su-una-colonna-dellarte-del-novec/
// Il portfolio e l'anno sono confermati dal catalogo Koller:
// https://www.kollerauktionen.ch/fr/328654-0067-1181-MAX-BILL.-10-original-lithos.-1181_439070.html?RecPos=18
// Regola: tessere poligonali di misure diverse formano una vetrata astratta.
// Interazione: il mouse deforma e ricolora una tessera; i bordi condivisi muovono le vicine.

const larghezzaTela = 450;
const altezzaTela = 600;
const semeComposizione = 24;
const ampiezzaIrregolarita = 9;
const spessoreContorno = 1.8;
const raggioInfluenzaMouse = 92;
const spostamentoMassimoMouse = 22;
const velocitaVariazioneLuminanza = 0.012;
const ampiezzaVariazioneLuminanza = 2.5;

const divisioniOrizzontali = [
  0, 0.025, 0.075, 0.14, 0.25, 0.37, 0.52, 0.56, 0.59,
  0.62, 0.70, 0.78, 0.83, 0.86, 0.90, 0.965, 1
];
const divisioniVerticali = [
  0, 0.08, 0.18, 0.31, 0.47, 0.63, 0.74, 0.80, 0.85,
  0.89, 0.93, 0.96, 0.985, 1
];

const paletteVetrata = [
  { nome: "bianco", tonalitaMinima: 0, tonalitaMassima: 0, saturazioneMinima: 0, saturazioneMassima: 0, luminanzaMinima: 100, luminanzaMassima: 100, peso: 72 },
  { nome: "viola", tonalitaMinima: 270, tonalitaMassima: 280, saturazioneMinima: 48, saturazioneMassima: 62, luminanzaMinima: 36, luminanzaMassima: 46, peso: 10 },
  { nome: "nero", tonalitaMinima: 0, tonalitaMassima: 0, saturazioneMinima: 0, saturazioneMassima: 0, luminanzaMinima: 0, luminanzaMassima: 0, peso: 9 },
  { nome: "verde", tonalitaMinima: 128, tonalitaMassima: 140, saturazioneMinima: 52, saturazioneMassima: 72, luminanzaMinima: 38, luminanzaMassima: 48, peso: 9 }
];

let tessere = [];
let ultimaTesseraAlPassaggio = null;

function setup() {
  createCanvas(larghezzaTela, altezzaTela);
  colorMode(HSL, 360, 100, 100);
  randomSeed(semeComposizione);
  noStroke();
  tessere = creaTessere();
}

function draw() {
  background(0, 0, 100);

  for (const tessera of tessere) {
    const variazione = sin(frameCount * velocitaVariazioneLuminanza + tessera.fase) * ampiezzaVariazioneLuminanza;
    const luminanza = constrain(
      tessera.luminanza + variazione,
      tessera.luminanzaMinima,
      tessera.luminanzaMassima
    );

    fill(tessera.colore.tonalita, tessera.colore.saturazione, luminanza);
    stroke(0, 0, 0);
    strokeWeight(spessoreContorno);
    beginShape();
    for (const vertice of tessera.vertici) {
      vertex(vertice.x, vertice.y);
    }
    endShape(CLOSE);
  }
}

function creaTessere() {
  const vertici = creaGrigliaIrregolare();
  const mediOrizzontali = creaMediOrizzontali(vertici);
  const mediVerticali = creaMediVerticali(vertici);
  const risultato = [];

  for (let riga = 0; riga < divisioniOrizzontali.length - 1; riga++) {
    for (let colonna = 0; colonna < divisioniVerticali.length - 1; colonna++) {
      const palette = scegliColore(riga, colonna);
      risultato.push({
        riga,
        colonna,
        vertici: [
          vertici[riga][colonna],
          mediOrizzontali[riga][colonna],
          vertici[riga][colonna + 1],
          mediVerticali[riga][colonna + 1],
          vertici[riga + 1][colonna + 1],
          mediOrizzontali[riga + 1][colonna],
          vertici[riga + 1][colonna],
          mediVerticali[riga][colonna]
        ],
        colore: {
          nome: palette.nome,
          tonalita: random(palette.tonalitaMinima, palette.tonalitaMassima),
          saturazione: random(palette.saturazioneMinima, palette.saturazioneMassima)
        },
        luminanza: random(palette.luminanzaMinima, palette.luminanzaMassima),
        luminanzaMinima: palette.luminanzaMinima,
        luminanzaMassima: palette.luminanzaMassima,
        indiceColore: palette.nome === "bianco"
          ? -1
          : paletteVetrata.filter(colore => colore.nome !== "bianco").indexOf(palette),
        fase: random(TWO_PI)
      });
    }
  }

  return risultato;
}

function creaMediOrizzontali(griglia) {
  return griglia.map((riga, indiceRiga) => riga.slice(0, -1).map((inizio, indiceColonna) => {
    const fine = riga[indiceColonna + 1];
    const altezzaVicino = min(
      indiceRiga > 0
        ? abs(inizio.y - griglia[indiceRiga - 1][indiceColonna].y)
        : Infinity,
      indiceRiga < griglia.length - 1
        ? abs(griglia[indiceRiga + 1][indiceColonna].y - inizio.y)
        : Infinity
    );
    const limiteSpostamento = indiceRiga === 0 || indiceRiga === griglia.length - 1
      ? 0
      : min(ampiezzaIrregolarita, altezzaVicino * 0.2);

    return creaVertice(
      (inizio.x + fine.x) / 2,
      (inizio.y + fine.y) / 2 + random(-limiteSpostamento, limiteSpostamento)
    );
  }));
}

function creaMediVerticali(griglia) {
  return griglia.slice(0, -1).map((riga, indiceRiga) => riga.map((inizio, indiceColonna) => {
    const fine = griglia[indiceRiga + 1][indiceColonna];
    const larghezzaVicino = min(
      indiceColonna > 0
        ? abs(inizio.x - riga[indiceColonna - 1].x)
        : Infinity,
      indiceColonna < riga.length - 1
        ? abs(riga[indiceColonna + 1].x - inizio.x)
        : Infinity
    );
    const limiteSpostamento = indiceColonna === 0 || indiceColonna === riga.length - 1
      ? 0
      : min(ampiezzaIrregolarita, larghezzaVicino * 0.2);

    return creaVertice(
      (inizio.x + fine.x) / 2 + random(-limiteSpostamento, limiteSpostamento),
      (inizio.y + fine.y) / 2
    );
  }));
}

function creaGrigliaIrregolare() {
  const griglia = [];

  for (let riga = 0; riga < divisioniOrizzontali.length; riga++) {
    const linea = [];

    for (let colonna = 0; colonna < divisioniVerticali.length; colonna++) {
      const xBase = divisioniVerticali[colonna] * width;
      const yBase = divisioniOrizzontali[riga] * height;
      const spaziaturaX = min(
        colonna > 0 ? xBase - divisioniVerticali[colonna - 1] * width : Infinity,
        colonna < divisioniVerticali.length - 1
          ? divisioniVerticali[colonna + 1] * width - xBase
          : Infinity
      );
      const spaziaturaY = min(
        riga > 0 ? yBase - divisioniOrizzontali[riga - 1] * height : Infinity,
        riga < divisioniOrizzontali.length - 1
          ? divisioniOrizzontali[riga + 1] * height - yBase
          : Infinity
      );
      const bordo = riga === 0 || riga === divisioniOrizzontali.length - 1
        || colonna === 0 || colonna === divisioniVerticali.length - 1;
      const spostamentoX = bordo ? 0 : random(-min(ampiezzaIrregolarita, spaziaturaX * 0.22), min(ampiezzaIrregolarita, spaziaturaX * 0.22));
      const spostamentoY = bordo ? 0 : random(-min(ampiezzaIrregolarita, spaziaturaY * 0.22), min(ampiezzaIrregolarita, spaziaturaY * 0.22));

      linea.push(creaVertice(xBase + spostamentoX, yBase + spostamentoY));
    }

    griglia.push(linea);
  }

  return griglia;
}

function scegliColore(riga, colonna) {
  if (riga === 4 && colonna === 3) {
    return paletteVetrata.find(colore => colore.nome === "nero");
  }

  const estrazione = random(100);
  let sommaPesi = 0;

  for (const colore of paletteVetrata) {
    sommaPesi += colore.peso;
    if (estrazione < sommaPesi) {
      return colore;
    }
  }

  return paletteVetrata[0];
}

function creaVertice(x, y) {
  return { x, y, xIniziale: x, yIniziale: y };
}

function mouseMoved() {
  aggiornaInterazioneMouse(mouseX, mouseY);
}

function aggiornaInterazioneMouse(puntoX, puntoY) {
  if (puntoX < 0 || puntoX > width || puntoY < 0 || puntoY > height) {
    ultimaTesseraAlPassaggio = null;
    return;
  }

  const tesseraSottoMouse = tessere.find(tessera => puntoDentroTessera(puntoX, puntoY, tessera));
  if (!tesseraSottoMouse || tesseraSottoMouse === ultimaTesseraAlPassaggio) {
    return;
  }

  ultimaTesseraAlPassaggio = tesseraSottoMouse;
  cambiaColoreTessera(tesseraSottoMouse);
  deformaTessera(tesseraSottoMouse, puntoX, puntoY);
}

function mouseOut() {
  ultimaTesseraAlPassaggio = null;
}

function cambiaColoreTessera(tessera) {
  const coloriAttivi = paletteVetrata.filter(colore => colore.nome !== "bianco");
  tessera.indiceColore = tessera.indiceColore === -1
    ? 0
    : (tessera.indiceColore + 1) % coloriAttivi.length;

  const colore = coloriAttivi[tessera.indiceColore];
  tessera.colore = {
    nome: colore.nome,
    tonalita: random(colore.tonalitaMinima, colore.tonalitaMassima),
    saturazione: random(colore.saturazioneMinima, colore.saturazioneMassima)
  };
  tessera.luminanza = random(colore.luminanzaMinima, colore.luminanzaMassima);
  tessera.luminanzaMinima = colore.luminanzaMinima;
  tessera.luminanzaMassima = colore.luminanzaMassima;
}

function deformaTessera(tessera, puntoX, puntoY) {
  for (const vertice of tessera.vertici) {
    const differenzaX = puntoX - vertice.x;
    const differenzaY = puntoY - vertice.y;
    const distanza = sqrt(differenzaX * differenzaX + differenzaY * differenzaY);
    const influenza = max(0, 1 - distanza / raggioInfluenzaMouse);

    vertice.x = constrain(
      vertice.x + differenzaX * influenza * 0.45,
      vertice.xIniziale - spostamentoMassimoMouse,
      vertice.xIniziale + spostamentoMassimoMouse
    );
    vertice.y = constrain(
      vertice.y + differenzaY * influenza * 0.45,
      vertice.yIniziale - spostamentoMassimoMouse,
      vertice.yIniziale + spostamentoMassimoMouse
    );
  }
}

function puntoDentroTessera(puntoX, puntoY, tessera) {
  let dentro = false;

  for (let indice = 0, precedente = tessera.vertici.length - 1; indice < tessera.vertici.length; precedente = indice, indice++) {
    const vertice = tessera.vertici[indice];
    const verticePrecedente = tessera.vertici[precedente];
    const attraversaPunto = (vertice.y > puntoY) !== (verticePrecedente.y > puntoY);
    const incrocioX = (verticePrecedente.x - vertice.x) * (puntoY - vertice.y)
      / (verticePrecedente.y - vertice.y) + vertice.x;

    if (attraversaPunto && puntoX < incrocioX) {
      dentro = !dentro;
    }
  }

  return dentro;
}
