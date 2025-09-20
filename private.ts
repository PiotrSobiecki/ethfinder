import * as crypto from "crypto";
import EthereumHDKey from "ethereumjs-wallet/dist/hdkey";
import { Buffer } from "buffer";
import * as readline from "readline";
import * as fs from "fs";

async function generateEthereumAddress(): Promise<{
  address: string;
  privateKey: string;
}> {
  const seed = crypto.randomBytes(16).toString("hex");
  const masterKey = EthereumHDKey.fromMasterSeed(Buffer.from(seed, "hex"));
  const addrNode = masterKey.derivePath("m/44'/60'/0'/0/0");
  const privateKey = addrNode
    .getWallet()
    .getPrivateKeyString()
    .replace("0x", "");
  return {
    address: addrNode.getWallet().getChecksumAddressString(),
    privateKey,
  };
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function askForOutput(): Promise<void> {
  const output = await new Promise<string>((resolve) => {
    rl.question(
      "Czy chcesz zapisać adresy do pliku, czy wyświetlić je w konsoli? (p=plik/k=konsola): ",
      (output: string) => {
        resolve(output.toLowerCase());
      }
    );
  });

  // Wprowadzenie prefiksu i sufiksu
  const prefix = await new Promise<string>((resolve) => {
    rl.question(
      "Podaj dodatkowe znaki po '0x' (puste oznacza dowolnie): ",
      (input: string) => {
        resolve(input.toLowerCase());
      }
    );
  });

  const suffix = await new Promise<string>((resolve) => {
    rl.question(
      "Podaj sufiks adresu (puste oznacza dowolnie): ",
      (input: string) => {
        resolve(input.toLowerCase());
      }
    );
  });

  const startTime = new Date(); // Zapisz czas rozpoczęcia

  if (output === "p") {
    const filename = await new Promise<string>((resolve) => {
      rl.question("Podaj nazwę pliku wyjściowego: ", (filename: string) => {
        resolve(filename);
      });
    });

    const numKeys = await new Promise<string>((resolve) => {
      rl.question(
        "Ile kluczy prywatnych chcesz wygenerować? ",
        (numKeys: string) => {
          resolve(numKeys);
        }
      );
    });

    const num = parseInt(numKeys);

    if (isNaN(num) || num <= 0 || num > 100000) {
      console.log("Nieprawidłowa liczba kluczy. Podaj liczbę od 1 do 100000.");
      rl.close();
      return;
    }

    const stream = fs.createWriteStream(filename);
    let totalChecked = 0; // Licznik sprawdzonych adresów

    for (let i = 0; i < num; i++) {
      const { address, privateKey } = await generateEthereumAddress();
      const addressLower = address.toLowerCase();
      const isValidAddress =
        (prefix === "" || addressLower.startsWith("0x" + prefix)) &&
        (suffix === "" || addressLower.endsWith(suffix));

      totalChecked++; // Zwiększamy licznik

      if (isValidAddress) {
        stream.write(`Address ${i + 1}: ${address}\n`);
        stream.write(`Private Key ${i + 1}: ${privateKey}\n\n`);
      } else {
        i--;
      }

      // Log co 10 000 sprawdzonych adresów
      if (totalChecked % 50000 === 0) {
        const elapsedTime = new Date().getTime() - startTime.getTime();
        const totalSeconds = Math.floor(elapsedTime / 1000);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        console.log(
          `Sprawdzono ${totalChecked} adresów w czasie ${hours} godz:${minutes} min:${seconds} sekund...`
        );
      }
    }

    stream.close();
    console.log(`Klucze prywatne zapisane do pliku ${filename}`);
  } else if (output === "k") {
    const numKeys = await new Promise<string>((resolve) => {
      rl.question(
        "Ile kluczy prywatnych chcesz wygenerować? ",
        (numKeys: string) => {
          resolve(numKeys);
        }
      );
    });

    const num = parseInt(numKeys);

    if (isNaN(num) || num <= 0 || num > 1000) {
      console.log("Nieprawidłowa liczba kluczy. Podaj liczbę od 1 do 1000.");
      rl.close();
      return;
    }

    let totalChecked = 0; // Licznik sprawdzonych adresów

    for (let i = 0; i < num; i++) {
      const { address, privateKey } = await generateEthereumAddress();
      const addressLower = address.toLowerCase();
      const isValidAddress =
        (prefix === "" || addressLower.startsWith("0x" + prefix)) &&
        (suffix === "" || addressLower.endsWith(suffix));

      totalChecked++; // Zwiększamy licznik

      if (isValidAddress) {
        console.log(`Address ${i + 1}: ${address}`);
        console.log(`Private Key ${i + 1}: ${privateKey}\n`);
      } else {
        i--;
      }

      // Log co 10 000 sprawdzonych adresów
      if (totalChecked % 50000 === 0) {
        const elapsedTime = new Date().getTime() - startTime.getTime();
        const totalSeconds = Math.floor(elapsedTime / 1000);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        console.log(
          `Sprawdzono ${totalChecked} adresów w czasie ${hours} godz:${minutes} min:${seconds} sekund...`
        );
      }
    }
  } else {
    console.log('Nieprawidłowa opcja. Wpisz "p=plik" lub "k=konsola"');
  }

  rl.close();
}

askForOutput();
