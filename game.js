const greenVirus = {
  color: "green",
  image: "images/virus-green.svg",
  active: false,
};
const redVirus = { color: "red", image: "images/virus-red.svg", active: false };
const brownVirus = {
  color: "brown",
  image: "images/virus-brown.svg",
  active: false,
};
const flask = { viruses: [], active: false, image: "images/flask.svg" };

const classicalGame = {
  flasksNumber: 4,
  virusTypes: [
    { type: greenVirus, amount: 4 },
    { type: redVirus, amount: 4 },
    { type: brownVirus, amount: 4 },
  ],
};

const gameContainer = document.querySelector(".flask-container");

const randomNumber = (number) => Math.floor(Math.random() * number);

const virusNumberPerFlask = (gameType) =>
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
      ...flasks.slice(index + 1, flasks.length),
    ];

    return assignVirusToFlask(virus, notFullFlasks, virusNumberPerFlask);
  }

  return flasks[index].viruses.push(virus);
};

const initializeGame = (gameType) => {
  const viruses = gameType.virusTypes
    .map((virus) =>
      Array.from({ length: virus.amount }, () =>
        JSON.parse(JSON.stringify(virus.type))
      )
    )
    .flat();

  const flasks = Array.from({ length: gameType.flasksNumber }, () =>
    JSON.parse(JSON.stringify(flask))
  );
  flasks[0].active = true;
  viruses.map((virus) =>
    assignVirusToFlask(virus, flasks, virusNumberPerFlask(gameType))
  );

  const game = { flasks, gameType, selectedVirus: null };

  if (gameNotValid(game)) {
    console.log("game is not valid");
    return initializeGame(classicalGame);
  }

  return game;
};

const renderVirus = (virus) => {
  const virusElement = document.createElement("img");
  virusElement.classList.add("virus");
  if (virus.active) {
    virusElement.classList.add("virus--active");
  }
  virusElement.src = virus.image;
  virusElement.alt = "virus";
  return virusElement;
};

const renderFlask = (flask) => {
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
  flask.viruses.map((virus) => virusContainer.appendChild(renderVirus(virus)));
  return flaskElement;
};

const renderMessage = () => {
  const messageContainer = document.createElement("div");
  const messageText = document.createElement("h2");
  const messageBtn = document.createElement("button");

  messageContainer.classList.add("message--end-game");

  messageText.classList.add("text");
  messageText.innerHTML = "WELL DONE!";
  messageContainer.appendChild(messageText);

  messageBtn.classList.add("btn");
  messageBtn.innerHTML = "next level";
  messageContainer.appendChild(messageBtn);

  return messageContainer;
};

const render = (game) => {
  gameContainer.innerHTML = "";
  game.flasks.map((flask) => gameContainer.appendChild(renderFlask(flask)));
};

function moveVirus(flaskIndex) {
  if (game.selectedVirus !== null) {
    game.flasks[flaskIndex].viruses.unshift(game.selectedVirus);
  }
}

function takeVirus(flaskIndex) {
  if (game.selectedVirus !== null) {
    game.flasks[flaskIndex].viruses.shift(game.selectedVirus);
  }
}

function handleRight() {
  let currentFlaskIndex = game.flasks.findIndex((flask) => flask.active);
  game.flasks[currentFlaskIndex].active = false;
  takeVirus(currentFlaskIndex);

  if (game.flasks.length - 1 == currentFlaskIndex) {
    game.flasks[0].active = true;
    moveVirus(0);
  } else {
    game.flasks[currentFlaskIndex + 1].active = true;
    moveVirus(currentFlaskIndex + 1);
  }
  render(game);
}

function handleLeft() {
  let currentFlaskIndex = game.flasks.findIndex((flask) => flask.active);
  game.flasks[currentFlaskIndex].active = false;

  takeVirus(currentFlaskIndex);
  if (0 == currentFlaskIndex) {
    game.flasks[game.flasks.length - 1].active = true;
    moveVirus(game.flasks.length - 1);
  } else {
    game.flasks[currentFlaskIndex - 1].active = true;
    moveVirus(currentFlaskIndex - 1);
  }
  render(game);
}

function handleSpace() {
  let currentFlaskIndex = game.flasks.findIndex((flask) => flask.active);

  if (game.selectedVirus == null) {
    if (game.flasks[currentFlaskIndex].viruses.length !== 0) {
      game.selectedVirus = game.flasks[currentFlaskIndex].viruses[0];
      game.selectedVirus.active = true;
    }
  } else {
    if (game.flasks[currentFlaskIndex].viruses.length !== 5) {
      game.selectedVirus.active = false;
      game.selectedVirus = null;
    }
  }

  render(game);
  if (isEndGame(game)) {
    console.log("end game");
    gameContainer.appendChild(renderMessage());
  }
}

function handleKey(e) {
  e.preventDefault();
  switch (e.key) {
    case "ArrowLeft":
      handleLeft();
      break;
    case "ArrowRight":
      handleRight();
      break;
    case " ":
      handleSpace(e);
      break;
  }
}

window.addEventListener("keydown", handleKey);

function compareViruses(game) {
  const isFull = (flask) =>
    flask.viruses.length == virusNumberPerFlask(game.gameType);
  const sameColor = (flask) =>
    flask.viruses.every((virus) => virus.color == flask.viruses[0].color);
  return game.flasks.filter((flask) => isFull(flask) && sameColor(flask))
    .length;
}

function isEndGame(game) {
  return compareViruses(game) == game.flasks.length - 1;
}

function gameNotValid(game) {
  return compareViruses(game) > 1;
}

const game = initializeGame(classicalGame);
render(game);
