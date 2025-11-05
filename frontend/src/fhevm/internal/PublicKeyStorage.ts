const STORAGE_KEY_PREFIX = "fhevm_public_key_";

export interface PublicKeyData {
  publicKey: string;
  publicParams: string;
}

export async function publicKeyStorageGet(
  aclAddress: string
): Promise<PublicKeyData> {
  const key = `${STORAGE_KEY_PREFIX}${aclAddress.toLowerCase()}`;
  const stored = localStorage.getItem(key);

  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.publicKey && data.publicParams) {
        return data;
      }
    } catch (e) {
      console.warn("Failed to parse stored public key", e);
    }
  }

  // Return empty strings if not found, will be fetched from network
  return {
    publicKey: "",
    publicParams: "",
  };
}

export async function publicKeyStorageSet(
  aclAddress: string,
  publicKey: string,
  publicParams: string
): Promise<void> {
  const key = `${STORAGE_KEY_PREFIX}${aclAddress.toLowerCase()}`;
  const data: PublicKeyData = {
    publicKey,
    publicParams,
  };
  localStorage.setItem(key, JSON.stringify(data));
}
