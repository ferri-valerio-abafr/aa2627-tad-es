// Illusione: anelli concentrici in un reticolo sfalsato
// Fonte: immagine fornita in chat (URL non disponibile)
// Regola: anelli bianchi e neri si ripetono su centri sfalsati; vicino agli altri centri
// le fasce si incontrano e fanno apparire forme angolari.
// Parametri critici:
// passoOrizzontale e passoVerticale: distanza fra i centri
// spessoreFascia: distanza fra gli anelli
// ampiezzaMovimento: spostamento massimo del reticolo
// velocitaMovimento: velocità dello spostamento

const larghezzaTela = 800;
const altezzaTela = 600;
const passoOrizzontale = 150;
const passoVerticale = 130;
const spessoreFascia = 5;
const ampiezzaMovimento = 8;
const velocitaMovimento = 0.02;
const raggioMassimo = 100;

function setup() {
  createCanvas(larghezzaTela, altezzaTela);
}

function draw() {
  background(255);

  const spostamento = sin(frameCount * velocitaMovimento) * ampiezzaMovimento;
  noFill();

  for (let y = -passoVerticale; y <= height + passoVerticale; y += passoVerticale) {
    const sfalsamento = (round(y / passoVerticale) % 2) * passoOrizzontale / 2;

    for (let x = -passoOrizzontale; x <= width + passoOrizzontale; x += passoOrizzontale) {
      const centroX = x + sfalsamento + spostamento;
      let numeroAnello = 0;

      for (let raggio = spessoreFascia / 2; raggio <= raggioMassimo; raggio += spessoreFascia) {
        const anelloNero = numeroAnello % 2 === 0;
        stroke(anelloNero ? 20 : 255);
        strokeWeight(spessoreFascia);
        circle(centroX, y, raggio * 2);
        numeroAnello++;
      }
    }
  }
}
