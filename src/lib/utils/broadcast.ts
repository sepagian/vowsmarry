import { browser } from "$app/environment";

const CHANNEL_NAME = "vowsmarry-sync";

let broadcastChannel: BroadcastChannel | null = null;

export function getBroadcastChannel(): BroadcastChannel | null {
  if (!browser) return null;
  if (!broadcastChannel) {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
    console.log("[Broadcast] Channel created:", CHANNEL_NAME);
  }
  return broadcastChannel;
}

export function broadcastInvalidate(queryKeys: string[]): void {
  if (!browser) return;

  const channel = getBroadcastChannel();
  if (!channel) {
    console.warn("[Broadcast] No channel available");
    return;
  }

  const event = {
    type: "invalidate",
    queryKeys,
    timestamp: Date.now(),
  };

  console.log("[Broadcast] Sending:", queryKeys);
  channel.postMessage(JSON.stringify(event));
}

type BroadcastCallback = (queryKeys: string[]) => void;

let listenerCallback: BroadcastCallback | null = null;

export function onBroadcastMessage(callback: BroadcastCallback): void {
  if (!browser) return;

  listenerCallback = callback;
  console.log("[Broadcast] Listener registered");

  const channel = getBroadcastChannel();
  if (channel) {
    channel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "invalidate" && data.queryKeys) {
          console.log("[Broadcast] Received:", data.queryKeys);
          if (listenerCallback) {
            listenerCallback(data.queryKeys);
          }
        }
      } catch (error) {
        console.error("[Broadcast] Parse error:", error);
      }
    };
  }
}
