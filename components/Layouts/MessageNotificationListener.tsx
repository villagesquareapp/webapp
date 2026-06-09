"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMessageWebSocket } from "context/MessageWebSocketContext";

/**
 * Global listener that shows a toast-style notification when a new message
 * arrives and the user is NOT on the /messages page.
 * 
 * This component renders nothing visible by default — it only renders the
 * floating notification when triggered.
 */
export default function MessageNotificationListener() {
  const pathname = usePathname();
  const router = useRouter();
  const { subscribe } = useMessageWebSocket();
  const notifRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const dismiss = useCallback(() => {
    if (notifRef.current) {
      notifRef.current.style.transform = "translateX(120%)";
      notifRef.current.style.opacity = "0";
      setTimeout(() => {
        if (notifRef.current) {
          notifRef.current.style.display = "none";
        }
      }, 350);
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showNotification = useCallback(
    (senderName: string, message: string, avatarUrl?: string) => {
      if (!notifRef.current) return;

      const el = notifRef.current;

      // Build inner HTML
      const avatarHtml = avatarUrl
        ? `<img src="${avatarUrl}" alt="" style="width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0;" />`
        : `<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#0D52D2,#4F8EF7);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px;flex-shrink:0;">${(senderName || "?")[0].toUpperCase()}</div>`;

      const truncMsg =
        message.length > 60 ? message.substring(0, 60) + "…" : message;

      el.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;flex:1;min-width:0;cursor:pointer;" data-action="navigate">
          ${avatarHtml}
          <div style="flex:1;min-width:0;">
            <div style="font-weight:600;font-size:14px;color:var(--foreground, #111);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${senderName || "New Message"}</div>
            <div style="font-size:13px;color:var(--muted-foreground, #888);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;">${truncMsg}</div>
          </div>
        </div>
        <button data-action="dismiss" style="background:none;border:none;padding:4px;cursor:pointer;color:var(--muted-foreground, #888);flex-shrink:0;font-size:18px;line-height:1;" aria-label="Dismiss">✕</button>
      `;

      // Show with animation
      el.style.display = "flex";
      // Force reflow
      void el.offsetWidth;
      el.style.transform = "translateX(0)";
      el.style.opacity = "1";

      // Play a subtle sound if possible
      try {
        const audioCtx = new AudioContext();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 800;
        osc.type = "sine";
        gain.gain.value = 0.08;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.stop(audioCtx.currentTime + 0.15);
      } catch {}

      // Auto dismiss after 5 seconds
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(dismiss, 5000);
    },
    [dismiss],
  );

  useEffect(() => {
    // Create the notification container once
    if (!notifRef.current) {
      const el = document.createElement("div");
      el.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99999;
        display: none;
        align-items: center;
        gap: 8px;
        max-width: 380px;
        width: calc(100vw - 40px);
        padding: 14px 16px;
        background: var(--background, #fff);
        border: 1px solid var(--border, #e5e5e5);
        border-radius: 16px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
        transform: translateX(120%);
        opacity: 0;
        transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease;
        font-family: inherit;
      `;
      el.addEventListener("click", (e) => {
        const target = (e.target as HTMLElement).closest("[data-action]");
        if (!target) return;
        const action = target.getAttribute("data-action");
        if (action === "navigate") {
          dismiss();
          router.push("/messages");
        } else if (action === "dismiss") {
          dismiss();
        }
      });
      document.body.appendChild(el);
      notifRef.current = el;
    }

    return () => {
      // Don't remove on unmount — it persists across navigations
    };
  }, [dismiss, router]);

  useEffect(() => {
    const unsubscribe = subscribe((data: any) => {
      // Only show notification when NOT on the messages page
      if (pathname.startsWith("/messages")) return;

      if (data.event === "received-message" && data.message_data) {
        const msgData = data.message_data;
        // const senderName = msgData.sender_name || msgData.display_name || "Someone";
        const message = "New Message";
        const avatar = msgData.sender_avatar || msgData.profile_picture || "";
        showNotification(message, avatar);
      }
    });

    return unsubscribe;
  }, [subscribe, pathname, showNotification]);

  // This component renders nothing in the React tree
  return null;
}
