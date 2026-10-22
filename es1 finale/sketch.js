// Illusione: anelli concentrici in un reticolo sfalsato
// Fonte: immagine fornita in chat (URL non disponibile)
// Regola: anelli bianchi e neri si ripetono su centri sfalsati; vicino agli altri centri
// le fasce si incontrano e fanno apparire forme angolari.
// Parametri critici:
// passoOrizzontale e passoVerticale: distanza fra i centri
// spessoreFascia: distanza fra gli anelli
// ampiezzaMovimento: spostamento massimo dei centri
// velocitaMovimento: velocità dello spostamento

const larghezzaTela = 800;
const altezzaTela = 600;
const passoOrizzontale = 150;
const passoVerticale = 130;
const spessoreFascia = 5;
const ampiezzaMovimento = 14;
const velocitaMovimento = 0.04;
const raggioMassimo = 100;

function setup() {
  createCanvas(larghezzaTela, altezzaTela);
}

function draw() {
  background(255);

  noFill();

  for (let y = -passoVerticale; y <= height + passoVerticale; y += passoVerticale) {
    const sfalsamento = (round(y / passoVerticale) % 2) * passoOrizzontale / 2;
    const indiceRiga = round(y / passoVerticale);

    for (let x = -passoOrizzontale; x <= width + passoOrizzontale; x += passoOrizzontale) {
      const centroX = x + sfalsamento;
      const indiceColonna = round(centroX / passoOrizzontale);
      const fase = indiceRiga * 1.3 + indiceColonna * 0.8;
      const spostamentoX = sin(frameCount * velocitaMovimento + fase) * ampiezzaMovimento;
      const spostamentoY = sin(frameCount * velocitaMovimento + fase + HALF_PI) * ampiezzaMovimento / 2;
      let numeroAnello = 0;

      for (let raggio = spessoreFascia / 2; raggio <= raggioMassimo; raggio += spessoreFascia) {
        const anelloNero = numeroAnello % 2 === 0;
        stroke(anelloNero ? 20 : 255);
        strokeWeight(spessoreFascia);
        circle(centroX + spostamentoX, y + spostamentoY, raggio * 2);
        numeroAnello++;
      }
    }
  }
}
