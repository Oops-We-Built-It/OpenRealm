import { useCallback, useEffect, useRef, useState } from 'react';
import { BaseError, type Address } from 'viem';
import { configurationError, isMock, monadTestnet } from '../chain/config';
import { createTestnetGateway, getWallet, switchToMonad } from '../chain/client';
import { createMockGateway, MOCK_PLAYER } from '../chain/mock';
import type { TransactionState, WorldGateway, WorldState } from '../types/world';
const message = (e: unknown) => e instanceof BaseError ? e.shortMessage : e instanceof Error ? e.message : '操作失败，请重试';
export function useWorld() {
  const gateway = useRef<WorldGateway>(isMock ? createMockGateway() : createTestnetGateway());
  const [address, setAddress] = useState<Address | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [state, setState] = useState<WorldState | null>(null);
  const [loading, setLoading] = useState(false);
  const [walletBusy, setWalletBusy] = useState(false);
  const [error, setError] = useState<string | null>(configurationError);
  const [tx, setTx] = useState<TransactionState>({ status: 'idle', label: '' });
  const generation = useRef(0); const readId = useRef(0); const busy = useRef(false);
  const identity = useRef<Address | null>(null);
  const changeAccount = useCallback((next: Address | null) => {
    generation.current++; readId.current++; identity.current = next;
    setAddress(next); setState(null); setLoading(false); setError(configurationError); setTx({ status: 'idle', label: '' });
  }, []);
  const refresh = useCallback(async () => {
    const request = ++readId.current; const account = identity.current;
    if (!account || configurationError || (!isMock && chainId !== monadTestnet.id)) return;
    setLoading(true);
    try { const next = await gateway.current.read(account); if (request === readId.current) { setState(next); setError(null); } }
    catch (e) { if (request === readId.current) { setState(null); setError(message(e)); } }
    finally { if (request === readId.current) setLoading(false); }
  }, [chainId]);
  useEffect(() => {
    void refresh();
    const timer = setInterval(() => void refresh(), 15_000);
    return () => { clearInterval(timer); readId.current++; };
  }, [address, refresh]);
  useEffect(() => {
    if (isMock || !window.ethereum) return;
    const provider = window.ethereum;
    const accounts = (values: Address[]) => changeAccount(values[0] || null);
    const chain = (value: string) => { generation.current++; readId.current++; setChainId(Number(value)); setState(null); setLoading(false); };
    const disconnect = () => { changeAccount(null); setChainId(null); };
    provider.on?.('accountsChanged', accounts); provider.on?.('chainChanged', chain); provider.on?.('disconnect', disconnect);
    return () => { provider.removeListener?.('accountsChanged', accounts); provider.removeListener?.('chainChanged', chain); provider.removeListener?.('disconnect', disconnect); };
  }, [changeAccount]);
  async function connect() {
    setWalletBusy(true); setError(configurationError);
    try {
      if (isMock) { changeAccount(MOCK_PLAYER); setChainId(monadTestnet.id); }
      else { const wallet = getWallet(); const [account] = await wallet.requestAddresses(); changeAccount(account || null); setChainId(await wallet.getChainId()); }
    } catch (e) { setError(message(e)); } finally { setWalletBusy(false); }
  }
  async function switchNetwork() {
    setWalletBusy(true);
    try { await switchToMonad(); setChainId(await getWallet().getChainId()); setError(null); }
    catch (e) { setError(message(e)); } finally { setWalletBusy(false); }
  }
  async function transact(label: string, action: (account: Address, onHash: (hash: `0x${string}`) => void) => Promise<void>) {
    if (busy.current) return;
    if (!address || !state || configurationError || chainId !== monadTestnet.id) { setError('请连接正确网络并等待状态加载完成'); return; }
    busy.current = true; const version = generation.current;
    setError(null); setTx({ status: 'pending', label: `${label}：${isMock ? '模拟执行中' : '请在钱包确认，等待链上回执'}` });
    try {
      await action(address, hash => { if (version === generation.current) setTx(t => ({ ...t, hash })); });
      if (version === generation.current) { setTx(t => ({ ...t, status: 'success', label: `${label}：${isMock ? '模拟完成' : '链上已确认'}` })); await refresh(); }
    } catch (e) { if (version === generation.current) setTx(t => ({ ...t, status: 'failed', label: `${label}：${message(e)}` })); }
    finally { busy.current = false; }
  }
  return {
    address, chainId, state, loading, walletBusy, error, tx, refresh, connect, switchNetwork,
    disconnect: () => { changeAccount(null); setChainId(null); },
    reset: () => { gateway.current = createMockGateway(); changeAccount(null); setChainId(null); },
    mint: () => transact('领取 Passport', (a, h) => gateway.current.mint(a, h)),
    buy: () => transact('解锁 Arcane Forge', (a, h) => gateway.current.buy(a, 2, h)),
    withdraw: () => transact('提取收益', (a, h) => gateway.current.withdraw(a, h)),
  };
}
export type WorldController = ReturnType<typeof useWorld>;
