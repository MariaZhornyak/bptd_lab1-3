const BLOCK_SIZE = 64;
const ASCII = 8;
const UNICODE = 16;
const KEY = '11001100001100011101001110100100001110100011001100101011';
const ENTROPY_BLOCK_SIZE = 8;

const IPTable = [
  58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46, 38,
  30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9, 1,
  59, 51, 43, 35, 27, 19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39,
  31, 23, 15, 7,
];

const backIPTable = [
  40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14,
  54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60, 28,
  35, 3, 43, 11, 51, 19, 59, 27, 34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9,
  49, 17, 57, 25,
];

const PTable = [
  16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14, 32,
  27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25,
];

const ETable = [
  32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16,
  17, 16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25, 24, 25, 26, 27, 28, 29,
  28, 29, 30, 31, 32, 1,
];

const STables = [
  [
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
    [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
  ],
  [
    [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
    [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
    [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
    [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],
  ],
  [
    [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
    [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
    [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
    [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12],
  ],
  [
    [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
    [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
    [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
    [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14],
  ],
  [
    [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
    [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
    [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
    [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3],
  ],
  [
    [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
    [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
    [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
    [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13],
  ],
  [
    [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
    [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
    [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
    [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12],
  ],
  [
    [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
    [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
    [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11],
  ],
];

const C0 = [
  57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35,
  27, 19, 11, 3, 60, 52, 44, 36,
];

const D0 = [
  63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37,
  29, 21, 13, 5, 28, 20, 12, 4,
];

const shifts = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

const keyTable = [
  14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27,
  20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34,
  53, 46, 42, 50, 36, 29, 32,
];

const encrypt = (text) => {
  const binText = textToBinary(text);
  const blocks = splitBinTextByBlocks(binText);
  const IPBlocks = blocks.map((block) => initialPermutation(block));
  const encryptedBlocks = [];
  for (let block of IPBlocks) {
    let encryptedBlock = feistelCycles(block);
    encryptedBlocks.push(finalPermutation(encryptedBlock));
  }
  const encryptedText = encryptedBlocks.join('');

  console.warn('Original:', binaryToText(binText));
  console.warn('Encrypted:', binaryToText(encryptedText));

  const blocks_2 = splitBinTextByBlocks(encryptedText);
  const IPBlocks_2 = blocks_2.map((block) => initialPermutation(block));

  const decryptedBlocks = [];
  for (let block of IPBlocks_2) {
    let decryptedBlock = feistelCyclesDecrypt(block);
    decryptedBlocks.push(finalPermutation(decryptedBlock));
  }
  const decryptedText = decryptedBlocks.join('');

  console.warn('Decrypted:', binaryToText(decryptedText));
};

// checked
const textToBinary = (text) => {
  return text
    .split('')
    .map((char) => extendBinChar(char.charCodeAt(0).toString(2)))
    .join('');
};

// checked
const binaryToText = (text) => {
  let unicodeText = '';
  for (let i = 0; i < text.length; i += ASCII) {
    const binChar = text.slice(i, i + ASCII);
    unicodeText += String.fromCharCode(parseInt(binChar, 2));
  }
  return unicodeText;
};

// checked
const extendBinChar = (charBin) => {
  let result = charBin;
  if (charBin.length < ASCII) {
    while (result.length !== ASCII) {
      result = '0' + result;
    }
  }
  return result;
};

// checked
const extendBinToFour = (bin) => {
  let result = bin;
  if (bin.length < 4) {
    while (result.length !== 4) {
      result = '0' + result;
    }
  }
  return result;
};

// checked
const splitBinTextByBlocks = (binText) => {
  let blocks = [];
  let temp = '';
  for (let char of binText) {
    temp += char;
    if (temp.length === 64) {
      blocks.push(temp);
      temp = [];
    }
  }
  if (temp.length && temp.length < 64) {
    blocks.push(extendBlock(temp));
  }
  return blocks;
};

// checked
const extendBlock = (block) => {
  while (block.length < 64) {
    block += '0';
  }
  return block;
};

// checked
const initialPermutation = (block) => {
  let permutatedBlock = '';
  for (let bit of IPTable) {
    permutatedBlock += block[bit - 1];
  }
  return permutatedBlock;
};

// checked
const finalPermutation = (block) => {
  let permutatedBlock = [];
  for (let bit of backIPTable) {
    permutatedBlock.push(block[bit - 1]);
  }
  return permutatedBlock.join('');
};

// checked
const feistelCycles = (block) => {
  let temp = [block.slice(0, 32), block.slice(32, 64)];
  const preparedKey = prepareKey(KEY);

  let { C, D } = createInitialKeyBlocks(preparedKey);
  const keys = generateKeys(C, D);
  let entropyArray = calculateEntropy(temp.join(''));
  console.warn(
    `Round 0:`,
    entropyArray,
    (
      entropyArray.reduce((accum, value) => (accum += +value), 0) /
      ENTROPY_BLOCK_SIZE
    ).toFixed(3)
  );

  for (let i = 0; i < 16; i++) {
    const generatedKey = keys[i];
    let L = temp[1];
    let R = bitXor(temp[0], feistelFunc(temp[1], generatedKey));
    temp = [L, R];
    entropyArray = calculateEntropy(temp.join(''));
    console.warn(
      `Round ${i + 1}:`,
      entropyArray,
      (
        entropyArray.reduce((accum, value) => (accum += +value), 0) /
        ENTROPY_BLOCK_SIZE
      ).toFixed(3)
    );
  }
  temp = [temp[1], temp[0]];
  const blockBits = temp.join('');
  console.warn('-------------');

  return blockBits;
};

const feistelCyclesDecrypt = (block) => {
  let temp = [block.slice(0, 32), block.slice(32, 64)];
  const preparedKey = prepareKey(KEY);
  let { C, D } = createInitialKeyBlocks(preparedKey);
  const keys = generateKeys(C, D);
  temp = [temp[1], temp[0]];

  for (let i = 15; i >= 0; i--) {
    const generatedKey = keys[i];
    let R = temp[0];
    let L = bitXor(temp[1], feistelFunc(temp[0], generatedKey));
    temp = [L, R];
  }
  const blockBits = temp.join('').split('');

  return blockBits;
};

// checked
const bitXor = (a, b) => {
  let result = '';
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) {
      result += '0';
    } else {
      result += '1';
    }
  }
  return result;
};

// checked
const feistelFunc = (R, key) => {
  const extendedR = extendRight(R).join('');
  const rXorKey = bitXor(extendedR, key);
  const sixBitBlocks = [];
  for (let i = 0; i < rXorKey.length; i += 6) {
    sixBitBlocks.push(rXorKey.slice(i, i + 6));
  }
  const fourBitBlocks = converToFourBits(sixBitBlocks);
  const joinedFourBitBlocks = fourBitBlocks.join('');
  const permutedBlock = blockPermutation(joinedFourBitBlocks);
  return permutedBlock;
};

// checked
const extendRight = (block) => {
  let result = [];
  for (let bit of ETable) {
    result.push(block[bit - 1]);
  }
  return result;
};

// checked
const converToFourBits = (sixBitBlocks) => {
  let fourBitBlocks = [];
  for (let i = 0; i < sixBitBlocks.length; i++) {
    const block = sixBitBlocks[i];
    const lastIndex = block.length - 1;
    const firstLast = parseInt(block[0] + block[lastIndex], 2);
    const medium = parseInt(block.slice(1, lastIndex), 2);
    const newBlock = STables[i][firstLast][medium].toString(2);
    fourBitBlocks.push(extendBinToFour(newBlock));
  }
  return fourBitBlocks;
};

// checked
const blockPermutation = (block) => {
  let permuted = [];
  for (let bit of PTable) {
    permuted.push(block[bit - 1]);
  }
  return permuted.join('');
};

// checked
const prepareKey = (key) => {
  if (key.length !== 56) return;
  let keyBytes = [];
  let temp = '';
  let onesInByte = 0;
  for (let i = 0; i < key.length; i++) {
    temp += key[i];
    if (key[i] === '1') {
      onesInByte++;
    }
    if (temp.length === 7) {
      if (onesInByte % 2 == 0) {
        temp += '1';
      } else {
        temp += '0';
      }
      keyBytes.push(temp);
      temp = '';
      onesInByte = 0;
    }
  }
  return keyBytes.join('');
};

// checked
const createInitialKeyBlocks = (key) => {
  let permutedKey = [];
  const C0D0 = C0.concat(D0);
  for (let i = 0; i < C0D0.length; i++) {
    permutedKey[i] = key[C0D0[i] - 1];
  }
  const permutedKeyString = permutedKey.join('');

  return {
    C: permutedKeyString.slice(0, 28).split(''),
    D: permutedKeyString.slice(28, 56).split(''),
  };
};

// checked
const generateKeys = (C, D) => {
  let keys = [];
  for (let i = 0; i < 16; i++) {
    keys.push(generateKey(i, C, D));
  }
  return keys;
};

// checked
const generateKey = (round, C, D) => {
  const shift = shifts[round];
  for (let i = 0; i < shift; i++) {
    C.push(C.shift());
    D.push(D.shift());
  }
  let key = [];
  const CD = C.concat(D);
  for (let bit of keyTable) {
    key.push(CD[bit - 1]);
  }
  return key.join('');
};

const calculateEntropy = (block) => {
  let bytes = [];
  let entropies = [];
  for (let i = 0; i < block.length; i += ENTROPY_BLOCK_SIZE) {
    bytes.push(block.slice(i, i + ENTROPY_BLOCK_SIZE));
  }
  for (let i = 0; i < ENTROPY_BLOCK_SIZE; i++) {
    let zeros = 0;
    let ones = 0;
    for (let byte of bytes) {
      if (byte[i] === '1') {
        ones++;
      } else {
        zeros++;
      }
    }
    let p0 = zeros / (zeros + ones);
    let p1 = ones / (zeros + ones);
    let logp0 = p0 !== 0 ? Math.log2(p0) : 0;
    let logp1 = p1 !== 0 ? Math.log2(p1) : 0;
    entropies.push((-(p0 * logp0 + p1 * logp1)).toFixed(3));
  }
  return entropies;
};
