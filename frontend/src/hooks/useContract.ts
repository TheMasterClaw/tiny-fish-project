import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

export interface ContractState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useContract() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProvider = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask or another Web3 wallet');
    }
    return new ethers.BrowserProvider(window.ethereum!);
  }, []);

  const getSigner = useCallback(async () => {
    const provider = await getProvider();
    return provider.getSigner();
  }, [getProvider]);

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const provider = await getProvider();
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      
      return {
        address,
        chainId: Number(network.chainId),
        signer,
        provider,
      };
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [getProvider]);

  const callContract = useCallback(async <T>(
    contract: ethers.Contract,
    method: string,
    args: any[] = []
  ): Promise<T> => {
    try {
      const result = await contract[method](...args);
      return result as T;
    } catch (err: any) {
      console.error(`Contract call failed: ${method}`, err);
      throw new Error(err.reason || err.message || 'Contract call failed');
    }
  }, []);

  const sendTransaction = useCallback(async (
    contract: ethers.Contract,
    method: string,
    args: any[] = [],
    value?: string
  ): Promise<ethers.TransactionReceipt> => {
    try {
      const tx = value 
        ? await contract[method](...args, { value: ethers.parseEther(value) })
        : await contract[method](...args);
      
      const receipt = await tx.wait();
      if (!receipt) throw new Error('Transaction failed');
      return receipt;
    } catch (err: any) {
      console.error(`Transaction failed: ${method}`, err);
      throw new Error(err.reason || err.message || 'Transaction failed');
    }
  }, []);

  const switchNetwork = useCallback(async (chainId: number) => {
    try {
      await window.ethereum?.request?.({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (err: any) {
      if (err.code === 4902) {
        // Chain not added, need to add it
        throw new Error('Please add this network to your wallet');
      }
      throw err;
    }
  }, []);

  return {
    isConnecting,
    error,
    connectWallet,
    getProvider,
    getSigner,
    callContract,
    sendTransaction,
    switchNetwork,
  };
}

export default useContract;
