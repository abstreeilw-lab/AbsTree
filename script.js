
// CLASSE NODE

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.height = 1;
    this.color = "black";

    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
  }
}

// ==========================
let root = null;
let path = [];
let insertedNode = null;
let treeType = "bst";
let currentCodeType = "bst";

const ANIMATION_STEP = 0.05;
const FAST_DELAY = 700;
const REGULAR_DELAY = 1400;
const LONG_DELAY = 2400;

let traversalPath = [];
let currentStep = -1;

function showCode(type, focusPatterns = []) {
  
}

function updateCodeStatus(text) {
  const statusElement = document.getElementById("codeStatus");
  if (statusElement) {
    statusElement.innerText = text;
  }
}

function setCodeForType(type) {
  updateCodeStatus(`Selecionado: ${type.toUpperCase()}`);
}



// ==========================
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ==========================
function log(msg) {
  let terminal = document.getElementById("terminal");
  terminal.innerHTML += "> " + msg + "<br>";
  terminal.scrollTop = terminal.scrollHeight;
}


//  TROCAR ÁRVORE

function setTreeType(type) {
  treeType = type;
  root = null;
  path = [];
  traversalPath = [];
  currentStep = -1;

  document.getElementById("terminal").innerHTML = "";
  log(`Árvore selecionada: ${type.toUpperCase()}`);
  setCodeForType(type);

  drawTree();
}


// POSIÇÕES
function setPositions(node, x, y, offset) {
  if (!node) return;

  node.targetX = x;
  node.targetY = y;

  setPositions(node.left, x - offset, y + 80, offset / 2);
  setPositions(node.right, x + offset, y + 80, offset / 2);
}

// ANIMAÇÃO SUAVE
function animate() {
  let moving = false;

  function update(node) {
    if (!node) return;

    if (node.x === 0 && node.y === 0) {
      node.x = node.targetX;
      node.y = node.targetY;
    }

    let dx = node.targetX - node.x;
    let dy = node.targetY - node.y;

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      node.x += dx * ANIMATION_STEP;
      node.y += dy * ANIMATION_STEP;
      moving = true;
    }

    update(node.left);
    update(node.right);
  }

  update(root);
  drawTree();

  if (moving) requestAnimationFrame(animate);
}

// ==========================
// 🌳 BST
// ==========================
async function insertBST(node, value) {

  if (path.length === 0) {
    updateCodeStatus("Inserindo nó na BST...");
    showCode(currentCodeType, ["if (root == NULL)", "return createNode(value);"]);
    log(`Inserindo nó ${value}`);
    await sleep(FAST_DELAY);
  }

  if (!node) {
    insertedNode = new Node(value);
    updateCodeStatus("Nó inserido no ponto correto");
    showCode(currentCodeType, ["return createNode(value);"]);
    log("Inserido!");
    return insertedNode;
  }

  path.push(node);
  drawTree();
  await sleep(FAST_DELAY);

  updateCodeStatus("Comparando e seguindo o ramo");
  showCode(currentCodeType, ["if (value < root->value)", "root->left = insert(root->left, value);", "root->right = insert(root->right, value);"]);
  log(`Compara com ${node.value}`);

  if (value < node.value) {
    log("Vai para esquerda");
    await sleep(FAST_DELAY);
    node.left = await insertBST(node.left, value);
  } else {
    log("Vai para direita");
    await sleep(FAST_DELAY);
    node.right = await insertBST(node.right, value);
  }

  return node;
}

// ==========================
// AVL AUX
// ==========================
function getHeight(node) {
  return node ? node.height : 0;
}

function updateHeight(node) {
  node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

function getBalance(node) {
  return node ? getHeight(node.left) - getHeight(node.right) : 0;
}

function isRed(node) {
  return node && node.color === "red";
}

function setColor(node, color) {
  if (node) node.color = color;
}

function getGrandparent(node) {
  return node && node.parent ? node.parent.parent : null;
}

function getUncle(node) {
  let grandparent = getGrandparent(node);
  if (!grandparent) return null;
  if (node.parent === grandparent.left) return grandparent.right;
  return grandparent.left;
}

async function rotateLeftRB(x) {
  log("Rotação à esquerda (Rubro-Negra)");

  let y = x.right;
  x.right = y.left;
  if (y.left) y.left.parent = x;

  y.parent = x.parent;
  if (!x.parent) {
    root = y;
  } else if (x === x.parent.left) {
    x.parent.left = y;
  } else {
    x.parent.right = y;
  }

  y.left = x;
  x.parent = y;

  await sleep(FAST_DELAY);
  setPositions(root, 300, 40, 120);
  animate();
  await sleep(REGULAR_DELAY);

  return y;
}

async function rotateRightRB(y) {
  log("Rotação à direita (Rubro-Negra)");

  let x = y.left;
  y.left = x.right;
  if (x.right) x.right.parent = y;

  x.parent = y.parent;
  if (!y.parent) {
    root = x;
  } else if (y === y.parent.left) {
    y.parent.left = x;
  } else {
    y.parent.right = x;
  }

  x.right = y;
  y.parent = x;

  await sleep(FAST_DELAY);
  setPositions(root, 300, 40, 120);
  animate();
  await sleep(REGULAR_DELAY);

  return x;
}

async function fixInsertRB(node) {
  while (node.parent && isRed(node.parent)) {
    let uncle = getUncle(node);
    let grandparent = getGrandparent(node);
    path = [node, node.parent, grandparent, uncle].filter(Boolean);
    drawTree();
    await sleep(REGULAR_DELAY);

    if (isRed(uncle)) {
      log("Caso 1: tio vermelho — recolore");
      setColor(node.parent, "black");
      setColor(uncle, "black");
      setColor(grandparent, "red");
      node = grandparent;
      setPositions(root, 300, 40, 120);
      animate();
      await sleep(LONG_DELAY);
    } else {
      if (node.parent === grandparent.left) {
        if (node === node.parent.right) {
          log("Caso 2: nó interno — rotaciona à esquerda");
          node = node.parent;
          await rotateLeftRB(node);
        }

        log("Caso 3: nó externo — rotaciona à direita");
        setColor(node.parent, "black");
        setColor(grandparent, "red");
        await rotateRightRB(grandparent);
      } else {
        if (node === node.parent.left) {
          log("Caso 2: nó interno — rotaciona à direita");
          node = node.parent;
          await rotateRightRB(node);
        }

        log("Caso 3: nó externo — rotaciona à esquerda");
        setColor(node.parent, "black");
        setColor(grandparent, "red");
        await rotateLeftRB(grandparent);
      }
    }
  }

  setColor(root, "black");
  path = [];
  setPositions(root, 300, 40, 120);
  animate();
  await sleep(REGULAR_DELAY);
}

async function insertRB(value) {
  updateCodeStatus("Inserindo nó na Rubro-Negra...");
  showCode(currentCodeType, ["Node* node = createNode(value);", "fixInsert(&root, node);"]);
  log(`Inserindo nó ${value}`);
  await sleep(FAST_DELAY);

  if (!root) {
    root = new Node(value);
    root.color = "black";
    insertedNode = root;
    updateCodeStatus("Raiz criada como preta");
    log("Inserido como raiz preta!");
    return root;
  }

  let node = root;
  let parent = null;

  while (node) {
    parent = node;
    path.push(node);
    drawTree();
    await sleep(FAST_DELAY);

    updateCodeStatus("Comparando e descendo pela árvore");
    showCode(currentCodeType, ["if (value < current->value)", "current = current->left;", "current = current->right;"]);
    log(`Compara com ${node.value}`);
    if (value < node.value) {
      log("Vai para esquerda");
      node = node.left;
    } else {
      log("Vai para direita");
      node = node.right;
    }
  }

  let newNode = new Node(value);
  newNode.color = "red";
  newNode.parent = parent;

  if (value < parent.value) {
    parent.left = newNode;
  } else {
    parent.right = newNode;
  }

  insertedNode = newNode;
  updateCodeStatus("Nó inserido; iniciando correção de cores");
  log("Inserido! Agora ajustando equilíbrio...");
  setPositions(root, 300, 40, 120);
  animate();
  await sleep(REGULAR_DELAY);

  await fixInsertRB(newNode);
  return root;
}

function findMin(node) {
  while (node && node.left) {
    node = node.left;
  }
  return node;
}

async function removeBST(node, value) {
  if (!node) {
    updateCodeStatus("Valor não encontrado na BST");
    log(`Valor ${value} não encontrado`);
    return null;
  }

  path.push(node);
  drawTree();
  await sleep(FAST_DELAY);

  updateCodeStatus("Comparando para remoção na BST");
  showCode(currentCodeType, ["if (value < root->value)", "else if (value > root->value)", "if (!root->left)"]);
  log(`Compara com ${node.value}`);

  if (value < node.value) {
    log("Vai para esquerda");
    node.left = await removeBST(node.left, value);
  } else if (value > node.value) {
    log("Vai para direita");
    node.right = await removeBST(node.right, value);
  } else {
    log("Nó encontrado para remoção");
    if (!node.left) {
      return node.right;
    }
    if (!node.right) {
      return node.left;
    }

    let successor = findMin(node.right);
    node.value = successor.value;
    node.right = await removeBST(node.right, successor.value);
  }

  return node;
}

async function removeAVL(node, value) {
  if (!node) {
    updateCodeStatus("Valor não encontrado na AVL");
    log(`Valor ${value} não encontrado`);
    return null;
  }

  path.push(node);
  drawTree();
  await sleep(FAST_DELAY);

  updateCodeStatus("Comparando para remoção na AVL");
  showCode(currentCodeType, ["if (value < node->value)", "else if (value > node->value)", "if (!node->left)"]);
  log(`Compara com ${node.value}`);

  if (value < node.value) {
    node.left = await removeAVL(node.left, value);
  } else if (value > node.value) {
    node.right = await removeAVL(node.right, value);
  } else {
    log("Nó encontrado; removendo com rebalanceamento");
    if (!node.left || !node.right) {
      let temp = node.left ? node.left : node.right;
      if (!temp) {
        node = null;
      } else {
        node = temp;
      }
    } else {
      let successor = findMin(node.right);
      node.value = successor.value;
      node.right = await removeAVL(node.right, successor.value);
    }
  }

  if (!node) return node;

  updateHeight(node);
  let balance = getBalance(node);

  if (balance > 1 && getBalance(node.left) >= 0) {
    updateCodeStatus("Rotação à direita após remoção");
    return await rotateRight(node);
  }

  if (balance > 1 && getBalance(node.left) < 0) {
    node.left = await rotateLeft(node.left);
    return await rotateRight(node);
  }

  if (balance < -1 && getBalance(node.right) <= 0) {
    updateCodeStatus("Rotação à esquerda após remoção");
    return await rotateLeft(node);
  }

  if (balance < -1 && getBalance(node.right) > 0) {
    node.right = await rotateRight(node.right);
    return await rotateLeft(node);
  }

  return node;
}

function rbTransplant(u, v) {
  if (!u.parent) {
    root = v;
  } else if (u === u.parent.left) {
    u.parent.left = v;
  } else {
    u.parent.right = v;
  }

  if (v) {
    v.parent = u.parent;
  }
}

async function fixDeleteRB(x) {
  while (x !== root && (!x || x.color === "black")) {
    let w = x && x.parent ? (x === x.parent.left ? x.parent.right : x.parent.left) : null;
    if (!w) break;

    if (w.color === "red") {
      log("Caso 1: irmão vermelho");
      w.color = "black";
      x.parent.color = "red";
      if (x === x.parent.left) {
        await rotateLeftRB(x.parent);
      } else {
        await rotateRightRB(x.parent);
      }
      w = x === x.parent.left ? x.parent.right : x.parent.left;
    }

    if (w && (!w.left || w.left.color === "black") && (!w.right || w.right.color === "black")) {
      log("Caso 2: irmão preto com filhos pretos");
      w.color = "red";
      x = x.parent;
    } else {
      if (x === x.parent.left) {
        if (w && (!w.right || w.right.color === "black")) {
          log("Caso 3: rotaciona irmão");
          if (w.left) w.left.color = "black";
          w.color = "red";
          await rotateRightRB(w);
          w = x.parent.right;
        }
        if (w) {
          log("Caso 4: finaliza correção");
          w.color = x.parent.color;
          x.parent.color = "black";
          if (w.right) w.right.color = "black";
          await rotateLeftRB(x.parent);
          x = root;
        }
      } else {
        if (w && (!w.left || w.left.color === "black")) {
          log("Caso 3: rotaciona irmão");
          if (w.right) w.right.color = "black";
          w.color = "red";
          await rotateLeftRB(w);
          w = x.parent.left;
        }
        if (w) {
          log("Caso 4: finaliza correção");
          w.color = x.parent.color;
          x.parent.color = "black";
          if (w.left) w.left.color = "black";
          await rotateRightRB(x.parent);
          x = root;
        }
      }
    }
  }

  if (x) x.color = "black";
}

async function removeRB(value) {
  updateCodeStatus("Removendo nó na Rubro-Negra...");
  log(`Removendo nó ${value}`);

  let z = root;
  while (z && z.value !== value) {
    path.push(z);
    drawTree();
    await sleep(FAST_DELAY);
    updateCodeStatus("Comparando para remoção na Rubro-Negra");
    if (value < z.value) {
      log(`Compara com ${z.value}, vai para esquerda`);
      z = z.left;
    } else {
      log(`Compara com ${z.value}, vai para direita`);
      z = z.right;
    }
  }

  if (!z) {
    updateCodeStatus("Valor não encontrado");
    log(`Valor ${value} não encontrado`);
    return root;
  }

  let y = z;
  let yOriginalColor = y.color;
  let x = null;

  if (!z.left) {
    x = z.right;
    rbTransplant(z, z.right);
  } else if (!z.right) {
    x = z.left;
    rbTransplant(z, z.left);
  } else {
    y = findMin(z.right);
    yOriginalColor = y.color;
    x = y.right;
    if (y.parent !== z) {
      rbTransplant(y, y.right);
      y.right = z.right;
      if (y.right) y.right.parent = y;
    }
    rbTransplant(z, y);
    y.left = z.left;
    if (y.left) y.left.parent = y;
    y.color = z.color;
  }

  if (yOriginalColor === "black") {
    await fixDeleteRB(x);
  }

  setPositions(root, 300, 40, 120);
  animate();
  await sleep(REGULAR_DELAY);
  return root;
}


// ROTAÇÕES AVL

async function rotateLeft(x) {

  log("Rotação à esquerda");

  let y = x.right;
  let T2 = y.left;

  y.left = x;
  x.right = T2;

  updateHeight(x);
  updateHeight(y);

  await sleep(FAST_DELAY);

  setPositions(root, 300, 40, 120);
  animate();
  await sleep(900);

  return y;
}

async function rotateRight(y) {

  log("Rotação à direita");

  let x = y.left;
  let T2 = x.right;

  x.right = y;
  y.left = T2;

  updateHeight(y);
  updateHeight(x);

  await sleep(FAST_DELAY);

  setPositions(root, 300, 40, 120);
  animate();
  await sleep(REGULAR_DELAY);

  return x;
}


//  AVL

async function insertAVL(node, value) {

  if (path.length === 0) {
    updateCodeStatus("Inserindo nó na AVL...");
    showCode(currentCodeType, ["if (node == NULL) return createNode(value);", "int balance = getBalance(node);"]);
    log(`Inserindo nó ${value}`);
  }

  if (!node) {
    insertedNode = new Node(value);
    updateCodeStatus("Nó inserido; ajustando alturas");
    showCode(currentCodeType, ["return createNode(value);"]);
    log("Inserido!");
    return insertedNode;
  }

  path.push(node);
  drawTree();
  await sleep(FAST_DELAY);

  updateCodeStatus("Comparando e escolhendo filho");
  showCode(currentCodeType, ["if (value < node->value)", "node->left = insert(node->left, value);", "node->right = insert(node->right, value);"]);
  log(`Compara com ${node.value}`);

  if (value < node.value) {
    log("Vai para esquerda");
    node.left = await insertAVL(node.left, value);
  } else {
    log("Vai para direita");
    node.right = await insertAVL(node.right, value);
  }

  updateHeight(node);
  let balance = getBalance(node);

  if (balance > 1 && value < node.left.value) {
    updateCodeStatus("Rotação à direita: caso LL");
    showCode(currentCodeType, ["return rightRotate(node);"]);
    return await rotateRight(node);
  }

  if (balance < -1 && value > node.right.value) {
    updateCodeStatus("Rotação à esquerda: caso RR");
    showCode(currentCodeType, ["return leftRotate(node);"]);
    return await rotateLeft(node);
  }

  if (balance > 1 && value > node.left.value) {
    updateCodeStatus("Rotação dupla: caso LR");
    showCode(currentCodeType, ["node->left = leftRotate(node->left);", "return rightRotate(node);"]);
    node.left = await rotateLeft(node.left);
    return await rotateRight(node);
  }

  if (balance < -1 && value < node.right.value) {
    updateCodeStatus("Rotação dupla: caso RL");
    showCode(currentCodeType, ["node->right = rightRotate(node->right);", "return leftRotate(node);"]);
    node.right = await rotateRight(node.right);
    return await rotateLeft(node);
  }

  return node;
}


// INSERIR

async function insertValue() {
  let value = document.getElementById("value").value;
  if (value === "") return;

  path = [];
  insertedNode = null;

  log(`Inserindo valor ${value}`);

  if (treeType === "bst") {
    root = await insertBST(root, Number(value));
  } else if (treeType === "avl") {
    root = await insertAVL(root, Number(value));
  } else if (treeType === "rb") {
    root = await insertRB(Number(value));
  } else {
    log("Tipo de árvore desconhecido");
    return;
  }

  setPositions(root, 300, 40, 120);
  animate();
}

async function removeValue() {
  let value = document.getElementById("value").value;
  if (value === "") return;

  path = [];
  insertedNode = null;

  log(`Removendo valor ${value}`);

  if (treeType === "bst") {
    root = await removeBST(root, Number(value));
  } else if (treeType === "avl") {
    root = await removeAVL(root, Number(value));
  } else if (treeType === "rb") {
    root = await removeRB(Number(value));
  } else {
    log("Tipo de árvore desconhecido");
    return;
  }

  setPositions(root, 300, 40, 120);
  animate();
}


// DESENHO

function drawTree() {
  let svg = document.getElementById("tree");
  svg.innerHTML = "";

  function draw(node) {
    if (!node) return;

    let color = "lightblue";
    let textColor = "black";

    if (traversalPath[currentStep] === node && currentStep >= 0) {
      svg.innerHTML += `
        <circle class="traversal-highlight" cx="${node.x}" cy="${node.y}" r="24" />
      `;
      color = "#f9a8d4";
      textColor = "#111827";
    } else if (path.includes(node)) {
      color = "yellow";
      textColor = "black";
    } else if (node === insertedNode) {
      color = "green";
      textColor = "white";
    } else if (node.color === "red") {
      color = "tomato";
      textColor = "white";
    } else if (node.color === "black") {
      color = "#222";
      textColor = "white";
    }

    if (node.left) {
      svg.innerHTML += `
        <line x1="${node.x}" y1="${node.y}" 
              x2="${node.left.x}" y2="${node.left.y}" 
              stroke="black"/>
      `;
    }

    if (node.right) {
      svg.innerHTML += `
        <line x1="${node.x}" y1="${node.y}" 
              x2="${node.right.x}" y2="${node.right.y}" 
              stroke="black"/>
      `;
    }

    svg.innerHTML += `
      <circle cx="${node.x}" cy="${node.y}" r="20" fill="${color}" />
      <text x="${node.x}" y="${node.y}" text-anchor="middle" dy=".3em" fill="${textColor}">${node.value}</text>
    `;

    draw(node.left);
    draw(node.right);
  }

  draw(root);
}


// PERCURSOS

function preOrder(node, result = []) {
  if (!node) return result;
  result.push(node.value);
  preOrder(node.left, result);
  preOrder(node.right, result);
  return result;
}

function inOrder(node, result = []) {
  if (!node) return result;
  inOrder(node.left, result);
  result.push(node.value);
  inOrder(node.right, result);
  return result;
}

function postOrder(node, result = []) {
  if (!node) return result;
  postOrder(node.left, result);
  postOrder(node.right, result);
  result.push(node.value);
  return result;
}

// VERSÕES VERBOSAS PARA EXPLICAR PASSOS

function preOrderVerbose(node, result = [], depth = 0) {
  if (!node) return result;
  const indent = "  ".repeat(depth);
  log(`${indent}→ Visitando nó ${node.value} (raiz)`);
  result.push(node.value);
  if (node.left) {
    log(`${indent}  Descendo para subárvore esquerda...`);
    preOrderVerbose(node.left, result, depth + 1);
  }
  if (node.right) {
    log(`${indent}  Descendo para subárvore direita...`);
    preOrderVerbose(node.right, result, depth + 1);
  }
  return result;
}

function inOrderVerbose(node, result = [], depth = 0) {
  if (!node) return result;
  const indent = "  ".repeat(depth);
  if (node.left) {
    log(`${indent}  Descendo para subárvore esquerda...`);
    inOrderVerbose(node.left, result, depth + 1);
  }
  log(`${indent}→ Visitando nó ${node.value} (raiz)`);
  result.push(node.value);
  if (node.right) {
    log(`${indent}  Descendo para subárvore direita...`);
    inOrderVerbose(node.right, result, depth + 1);
  }
  return result;
}

function postOrderVerbose(node, result = [], depth = 0) {
  if (!node) return result;
  const indent = "  ".repeat(depth);
  if (node.left) {
    log(`${indent}  Descendo para subárvore esquerda...`);
    postOrderVerbose(node.left, result, depth + 1);
  }
  if (node.right) {
    log(`${indent}  Descendo para subárvore direita...`);
    postOrderVerbose(node.right, result, depth + 1);
  }
  log(`${indent}→ Visitando nó ${node.value} (raiz)`);
  result.push(node.value);
  return result;
}

function getNodeOrder(node, type, result = []) {
  if (!node) return result;

  if (type === "pre") {
    result.push(node);
    getNodeOrder(node.left, type, result);
    getNodeOrder(node.right, type, result);
  }

  if (type === "in") {
    getNodeOrder(node.left, type, result);
    result.push(node);
    getNodeOrder(node.right, type, result);
  }

  if (type === "post") {
    getNodeOrder(node.left, type, result);
    getNodeOrder(node.right, type, result);
    result.push(node);
  }

  return result;
}

async function animateTraversal(orderList) {
  traversalPath = orderList;
  currentStep = -1;

  for (let i = 0; i < traversalPath.length; i++) {
    currentStep = i;
    drawTree();
    await sleep(REGULAR_DELAY);
  }

  currentStep = -1;
  drawTree();
}

function runTraversal(type) {
  if (!root) {
    log("Árvore vazia!");
    updateCodeStatus("Sem percurso: árvore vazia");
    return;
  }

  let result = [];

  if (type === "pre") {
    updateCodeStatus("Executando percurso Pré-Ordem");
    showCode(currentCodeType, ["void preOrder(Node* root)", "print(root->value);", "preOrder(root->left);", "preOrder(root->right);"]);
    log("╔════════════════════════════════════════╗");
    log("║    PERCURSO PRÉ-ORDEM (Raiz-ESQ-DIR)   ║");
    log("╚════════════════════════════════════════╝");
    log("Ordem: 1º Nó Raiz → 2º Subárvore Esquerda → 3º Subárvore Direita");
    log("");
    result = preOrderVerbose(root);
    log("");
    log("Sequência de visita: " + result.join(" → "));
    log("Resultado final: [" + result.join(", ") + "]");
  }

  if (type === "in") {
    updateCodeStatus("Executando percurso Em Ordem");
    showCode(currentCodeType, ["void inOrder(Node* root)", "inOrder(root->left);", "print(root->value);", "inOrder(root->right);"]);
    log("╔════════════════════════════════════════╗");
    log("║     PERCURSO EM ORDEM (ESQ-RAIZ-DIR)   ║");
    log("╚════════════════════════════════════════╝");
    log("Ordem: 1º Subárvore Esquerda → 2º Nó Raiz → 3º Subárvore Direita");
    log("");
    result = inOrderVerbose(root);
    log("");
    log("Sequência de visita: " + result.join(" → "));
    log("Resultado final: [" + result.join(", ") + "]");
  }

  if (type === "post") {
    updateCodeStatus("Executando percurso Pós-Ordem");
    showCode(currentCodeType, ["void postOrder(Node* root)", "postOrder(root->left);", "postOrder(root->right);", "print(root->value);"]);
    log("╔════════════════════════════════════════╗");
    log("║    PERCURSO PÓS-ORDEM (ESQ-DIR-RAIZ)   ║");
    log("╚════════════════════════════════════════╝");
    log("Ordem: 1º Subárvore Esquerda → 2º Subárvore Direita → 3º Nó Raiz");
    log("");
    result = postOrderVerbose(root);
    log("");
    log("Sequência de visita: " + result.join(" → "));
    log("Resultado final: [" + result.join(", ") + "]");
  }

  animateTraversal(getNodeOrder(root, type));
}


window.setTreeType = setTreeType;
window.insertValue = insertValue;
window.removeValue = removeValue;
window.runTraversal = runTraversal;