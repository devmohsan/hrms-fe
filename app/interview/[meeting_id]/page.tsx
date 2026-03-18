'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { Loader2, Video, XCircle } from 'lucide-react';

if (typeof window !== 'undefined') {
  const ReactInstance = require('react');
  const ReactDOMInstance = require('react-dom');
  const ReactDOMClient = require('react-dom/client');
  
  // Expose to window for UMD/Global scripts
  (window as any).React = ReactInstance;
  (window as any).ReactDOM = {
    ...ReactDOMInstance,
    createRoot: ReactDOMClient.createRoot,
    hydrateRoot: ReactDOMClient.hydrateRoot
  };

  // Deeply inject secret internals if they are missing or hidden
  const secret = ReactInstance.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED || {};
  if (!secret.ReactCurrentOwner) {
    secret.ReactCurrentOwner = { current: null };
  }
  
  // Ensure the instance itself has the secret property
  (ReactInstance as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = secret;
  
  // Some versions of the SDK look for this directly on window
  (window as any).ReactCurrentOwner = secret.ReactCurrentOwner;
}

export default function ZoomMeetingPage() {
  const { meeting_id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMeetingActive, setIsMeetingActive] = useState(false);

  const initialized = useRef(false);

  const userName = searchParams.get('name') || 'User';
  const role = searchParams.get('role') || '0';
  const password = searchParams.get('pwd') || '';

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initZoom = async () => {
      try {
        setLoading(true);

        // dynamic import (client side only)
        const ZoomSDK = await import('@zoom/meetingsdk/embedded');
        const client = ZoomSDK.default.createClient();

        const meetingElement = document.getElementById('meetingSDKElement');

        if (!meetingElement) {
          throw new Error('Zoom container not found.');
        }

        // fetch signature from backend
        const signatureResponse = await axiosInstance.post('/interviews/signature', {
          meeting_number: meeting_id,
          role: Number(role)
        });

        console.log(signatureResponse.data)

        // console.log(signatureResponse.data)

        if (!signatureResponse.data.success) {
          throw new Error('Signature generation failed');
        }

        const { signature, sdk_key } = signatureResponse.data;

        // console.log(signature)

        // init sdk
        await client.init({
          zoomAppRoot: meetingElement,
          language: 'en-US',
          patchJsMedia: true
        });

        // join meeting
        const joinResponse = await client.join({
          sdkKey: sdk_key,
          signature: signature,
          meetingNumber: meeting_id as string,
          password: password,
          userName: userName
        });

        console.log(joinResponse)

        setIsMeetingActive(true);
        setLoading(false);

      } catch (err: any) {
        console.error('Zoom SDK Error:', err);
        setError(err.message || 'Failed to initialize Zoom meeting.');
        setLoading(false);
      }
    };

    initZoom();
  }, [meeting_id, role, userName, password]);

  // ─── TEMPORARILY HIDDEN ───────────────────────────────────────────────────
  // Meeting embed is disabled for now. Emails have already been sent to
  // participants with their Zoom join links. Uncomment the block below to
  // restore the embedded meeting experience.
  return (
    <div className="h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center p-10 bg-white/5 border border-white/10 rounded-3xl shadow-2xl max-w-md w-full mx-4">
        <Video size={48} className="text-blue-400 mx-auto mb-5" />
        <h2 className="text-white text-2xl font-semibold mb-3">Meeting Invitation Sent</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Meeting details and join links have been emailed to all participants.
          Please check your inbox to join the Zoom meeting.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  /* ── ORIGINAL ZOOM EMBED (restore when ready) ────────────────────────────
  return (
    <div className="h-screen bg-[#050505] overflow-hidden relative">

      {/* Zoom container * /}
      <div id="meetingSDKElement" className="absolute inset-0 z-10"></div>

      {loading && (
        <div className="absolute inset-0 bg-gray-900 z-[999] flex flex-col items-center justify-center">
          <Video size={40} className="text-white mb-6" />
          <Loader2 className="animate-spin text-white mb-4" size={40} />
          <p className="text-white text-sm">Initializing Zoom Meeting...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-gray-100 z-[1000] flex items-center justify-center p-6 text-center">
          <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg">
            <XCircle size={40} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-3">Meeting Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white px-6 py-3 rounded-lg mr-3"
            >
              Reload
            </button>

            <button
              onClick={() => router.back()}
              className="bg-gray-200 px-6 py-3 rounded-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {isMeetingActive && (
        <div className="absolute top-4 left-4 text-white text-xs opacity-40">
          Zoom Embedded Meeting Active
        </div>
      )}
    </div>
  );
  ── END ORIGINAL ZOOM EMBED ─────────────────────────────────────────────── */
}