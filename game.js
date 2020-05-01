const greenVirus = { color: "green", image: "images/virus-green.svg", active: false };
const redVirus = { color: "red", image: "images/virus-red.svg", active: false };
const brownVirus = { color: "brown", image: "images/virus-brown.svg", active: false };


const flask = { viruses: [], active: false, image: "images/flask.svg" };

const classicalGame = {
  flasksNumber: 5,
  virusTypes: [
    { type: greenVirus, amount: 4 },
    { type: redVirus, amount: 4 },
    { type: brownVirus, amount: 4 }
  ]
};

const randomNumber = number => Math.floor(Math.random() * number);

const virusNumberPerFlask = gameType =>
  gameType.virusTypes.reduce(
    (accum, virusType) => accum + virusType.amount,
    0
  ) /
  (gameType.flasksNumber - 1);

const assignVirusToFlask = (virus, flasks, virusNumberPerFlask) => {
  const index = randomNumber(flasks.length - 1);
  if (flasks[index].viruses.length == virusNumberPerFlask) {
    const notFullFlasks = [
      ...flasks.slice(0, index),
      ...flasks.slice(index + 1, flasks.length)
    ];

    return assignVirusToFlask(virus, notFullFlasks, virusNumberPerFlask);
  }

  return flasks[index].viruses.push(virus);
};

const initializeGame = gameType => {
  const viruses = gameType.virusTypes
    .map(virus =>
      Array.from({ length: virus.amount }, () =>
        JSON.parse(JSON.stringify(virus.type))
      )
    )
    .flat();

  const flasks = Array.from({ length: gameType.flasksNumber }, () =>
    JSON.parse(JSON.stringify(flask))
  );
  flasks[0].active = true;
  viruses.map(virus =>
    assignVirusToFlask(virus, flasks, virusNumberPerFlask(gameType))
  );
  return flasks;
};

const renderVirus = virus => {
  const virusElement = document.createElement("img");
  virusElement.classList.add("virus");
  virusElement.src = virus.image;
  virusElement.alt = "virus";
  return virusElement;
};

const renderFlask = flask => {
  const flaskElement = document.createElement("div");
  flaskElement.classList.add("flask");
  if (flask.active) {
    flaskElement.classList.add("flask--active");
  }
  const imgElement = document.createElement("img");
  imgElement.src = flask.image;
  imgElement.alt = "flask";
  flaskElement.appendChild(imgElement);
  const virusContainer = document.createElement("div");
  virusContainer.classList.add("virus-container");
  flaskElement.appendChild(virusContainer);
  flask.viruses.map(virus => virusContainer.appendChild(renderVirus(virus)));
  return flaskElement;
};

const render = flasks => {
  const gameContainer = document.querySelector(".flask-container");
  gameContainer.innerHTML = '';
  flasks.map(flask => gameContainer.appendChild(renderFlask(flask)));
};

const flasks = initializeGame(classicalGame);
render(flasks);

