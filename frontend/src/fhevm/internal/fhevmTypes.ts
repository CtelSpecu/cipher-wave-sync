import type { Eip1193Provider } from "ethers";

export interface FhevmRelayerSDKType {
  initSDK: (options?: { debug?: boolean }) => Promise<boolean>;
  createInstance: (config: FhevmInstanceConfig) => Promise<FhevmInstance>;
  SepoliaConfig: {
    network: string;
    chainId: number;
    aclContractAddress: `0x${string}`;
    relayerUrl: string;
  };
  __initialized__?: boolean;
}

export interface FhevmWindowType extends Window {
  relayerSDK: FhevmRelayerSDKType;
}

export interface FhevmInstanceConfig {
  network: Eip1193Provider | string;
  chainId?: number;
  aclContractAddress: `0x${string}`;
  relayerUrl: string;
  publicKey?: string;
  publicParams?: string;
}

export interface FhevmInstance {
  createEncryptedInput(
    contractAddress: string,
    userAddress: string
  ): EncryptedInput;
  decrypt(contractAddress: string, ciphertext: unknown): Promise<bigint>;
  getPublicKey(): string;
  getPublicParams(bits?: number): string;
  reencrypt(
    handle: bigint,
    privateKey: string,
    publicKey: string,
    signature: string,
    contractAddress: string,
    userAddress: string
  ): Promise<string>;
}

export interface EncryptedInput {
  add4(value: number): EncryptedInput;
  add8(value: number): EncryptedInput;
  add16(value: number): EncryptedInput;
  add32(value: number): EncryptedInput;
  add64(value: bigint | number): EncryptedInput;
  add128(value: bigint): EncryptedInput;
  add256(value: bigint): EncryptedInput;
  addAddress(value: string): EncryptedInput;
  addBytes64(value: Uint8Array): EncryptedInput;
  addBytes128(value: Uint8Array): EncryptedInput;
  addBytes256(value: Uint8Array): EncryptedInput;
  encrypt(): {
    handles: Uint8Array[];
    inputProof: Uint8Array;
  };
}

export interface FhevmInitSDKOptions {
  debug?: boolean;
}

export type FhevmInitSDKType = (
  options?: FhevmInitSDKOptions
) => Promise<boolean>;

export type FhevmLoadSDKType = () => Promise<void>;
