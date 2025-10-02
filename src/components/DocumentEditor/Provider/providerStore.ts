// src/collab/providerStore.ts
import { HocuspocusProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';

type ProviderWrapper = {
  provider: HocuspocusProvider;
  isConnected: boolean;
};

//Singleton design pattern
const providers: Record<string, ProviderWrapper> = {};

export function getProvider(room: string): ProviderWrapper {
  if (!providers[room]) {
    const ydoc = new Y.Doc();

    let isConnected = false;

    const provider = new HocuspocusProvider({
      url: 'ws://localhost:1234', // or your server URL
      name: room,
      document: ydoc,

      onConnect() {
        isConnected = true;
        console.log(`[${room}] Connected`);
      },
      onDisconnect() {
        isConnected = false;
        console.log(`[${room}] Disconnected`);
      },
      onDestroy() {
        isConnected = false;
        console.log(`[${room}] Destroyed`);
      },
    });

    providers[room] = {
      provider,
      get isConnected() {
        return isConnected;
      },
    };
  }

  return providers[room];
}

export function destroyProvider(room: string) {
  const wrapper = providers[room];
  if (wrapper) {
    wrapper.provider.awareness?.destroy();
    wrapper.provider.destroy();
    delete providers[room];
    console.log(`[${room}] Provider destroyed`);
  }
}
