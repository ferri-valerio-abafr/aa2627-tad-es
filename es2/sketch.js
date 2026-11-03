// Quadro: autore, titolo e anno non noti
// Fonte: immagine fornita dall'utente; pagina originale non nota
// Regola cromatica: rosso e giallo cambiano lentamente entro intervalli ridotti;
//   nero, grigio e bianco tengono stabile il contrasto.

const larghezzaTela = 800;
const altezzaTela = 600;
const tonoRossoMinimo = 12;
const tonoRossoMassimo = 22;
const tonoGialloMinimo = 48;
const tonoGialloMassimo = 58;
const saturazioneRosso = 76;
const luminositaRosso = 46;
const saturazioneGiallo = 78;
const luminositaGiallo = 56;
const ampiezzaVariazioneTono = 6;
const velocitaVariazioneTono = 0.012;
const ingrandimentoMinimo = 0.8;
const ingrandimentoMassimo = 1.2;
const fotogrammiMinimiFraCambi = 180;
const fotogrammiMassimiFraCambi = 360;
const velocitaAvvicinamento = 0.025;

const forme = {
  cuneoRosso: [[0, 0], [0.46, 0], [0.82, 0.31], [0.67, 0.48], [0, 0.1]],
  massaNera: [[0.08, 0.31], [0.36, 0.25], [0.61, 0.34], [1, 0.12], [1, 1], [0.34, 1], [0.08, 0.74]],
  fasciaGrigia: [[0.22, 0.16], [0.3, 0.13], [1, 0.47], [1, 0.59]],
  cuneoBianco: [[0, 0.1], [0.52, 0.36], [0.29, 0.68], [0, 0.65]],
  formaGiallaCentro: [[0.36, 0.37], [0.56, 0.48], [0.38, 0.72]],
  formaBiancaDestra: [[0.6, 0.6], [0.91, 0.56], [0.77, 0.9], [0.55, 0.82]],
  formaGiallaBassa: [[0.73, 0.9], [0.88, 0.68], [1, 0.77], [1, 1], [0.76, 1]],
  fasciaNeraSinistra: [[0.08, 0.31], [0.14, 0.32], [0.14, 0.9], [0.08, 0.82]],
  triangoloNero: [[0.31, 0.47], [0.42, 0.48], [0.31, 0.7]]
};

let tonoRosso;
let tonoGiallo;
const animazioniForme = {};

function setup() {
  createCanvas(larghezzaTela, altezzaTela);
  colorMode(HSL, 360, 100, 100);
  frameRate(30);
  noStroke();

  tonoRosso = random(tonoRossoMinimo, tonoRossoMassimo);
  tonoGiallo = random(tonoGialloMinimo, tonoGialloMassimo);

  for (const nomeForma of Object.keys(forme)) {
    animazioniForme[nomeForma] = {
      ingrandimento: 1,
      obiettivo: random(ingrandimentoMinimo, ingrandimentoMassimo),
      prossimoCambio: frameCount + random(fotogrammiMinimiFraCambi, fotogrammiMassimiFraCambi)
    };
  }
}

function draw() {
  const variazioneTono = sin(frameCount * velocitaVariazioneTono) * ampiezzaVariazioneTono;
  const rosso = color(tonoRosso + variazioneTono, saturazioneRosso, luminositaRosso);
  const giallo = color(tonoGiallo + variazioneTono, saturazioneGiallo, luminositaGiallo);
  const bianco = color(40, 12, 96);
  const grigio = color(0, 0, 66);
  const nero = color(0, 0, 8);

  background(bianco);
  disegnaPoligono('massaNera', nero);
  disegnaPoligono('cuneoRosso', rosso);
  disegnaPoligono('cuneoBianco', bianco);
  disegnaPoligono('fasciaGrigia', grigio);
  disegnaPoligono('formaGiallaCentro', giallo);
  disegnaPoligono('formaBiancaDestra', bianco);
  disegnaPoligono('formaGiallaBassa', giallo);
  disegnaPoligono('fasciaNeraSinistra', nero);
  disegnaPoligono('triangoloNero', nero);
}

function disegnaPoligono(nomeForma, colore) {
  const punti = forme[nomeForma];
  const animazione = animazioniForme[nomeForma];

  if (frameCount >= animazione.prossimoCambio) {
    animazione.obiettivo = random(ingrandimentoMinimo, ingrandimentoMassimo);
    animazione.prossimoCambio = frameCount + random(fotogrammiMinimiFraCambi, fotogrammiMassimiFraCambi);
  }
  animazione.ingrandimento = lerp(animazione.ingrandimento, animazione.obiettivo, velocitaAvvicinamento);

  const centroX = punti.reduce((somma, punto) => somma + punto[0], 0) / punti.length;
  const centroY = punti.reduce((somma, punto) => somma + punto[1], 0) / punti.length;

  fill(colore);
  beginShape();
  for (const [x, y] of punti) {
    const xAnimato = centroX + (x - centroX) * animazione.ingrandimento;
    const yAnimato = centroY + (y - centroY) * animazione.ingrandimento;
    vertex(xAnimato * width, yAnimato * height);
  }
  endShape(CLOSE);
}
