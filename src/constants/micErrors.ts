export type MicErrorName =
    | 'NotAllowedError'
    | 'PermissionDeniedError'
    | 'NotFoundError'
    | 'DevicesNotFoundError'
    | 'NotReadableError'
    | 'TrackStartError'
    | 'OverconstrainedError'
    | 'ConstraintNotSatisfiedError'
    | 'SecurityError'
    | 'AbortError';

export type MicErrorDetails = {
    message: string;
    fixes: string[];
};

// Shared table so UI + docs can’t drift.
export const MIC_ERROR_DETAILS = {
    NotAllowedError: {
        message: 'Microphone permission denied. Please allow access in your browser settings and try again.',
        fixes: [
            'Click the lock icon in your browser address bar and allow Microphone.',
            'If on iOS/Safari: Settings → Safari → Microphone → Allow.',
            'Reload the page after changing permissions.',
        ],
    },
    PermissionDeniedError: {
        message: 'Microphone permission denied. Please allow access in your browser settings and try again.',
        fixes: [
            'Click the lock icon in your browser address bar and allow Microphone.',
            'Reload the page after changing permissions.',
        ],
    },

    NotFoundError: {
        message: 'No microphone found. Please connect a mic or check your OS input settings.',
        fixes: [
            'Check your OS sound settings and select an input device.',
            'Plug in / reconnect your microphone (or Bluetooth headset) and try again.',
        ],
    },
    DevicesNotFoundError: {
        message: 'No microphone found. Please connect a mic or check your OS input settings.',
        fixes: [
            'Check your OS sound settings and select an input device.',
            'Plug in / reconnect your microphone (or Bluetooth headset) and try again.',
        ],
    },

    NotReadableError: {
        message:
            'Microphone is in use by another app, or could not be started. Close other apps (Zoom, Meet) and try again.',
        fixes: [
            'Close other apps/tabs that might be using the mic (Zoom/Meet/Teams).',
            'Try switching input devices in your OS settings.',
        ],
    },
    TrackStartError: {
        message:
            'Microphone is in use by another app, or could not be started. Close other apps (Zoom, Meet) and try again.',
        fixes: [
            'Close other apps/tabs that might be using the mic (Zoom/Meet/Teams).',
            'Try switching input devices in your OS settings.',
        ],
    },

    OverconstrainedError: {
        message: 'Your microphone does not support the requested audio constraints. Try a different input device.',
        fixes: ['Try a different microphone/input device.', 'Refresh the page and try again.'],
    },
    ConstraintNotSatisfiedError: {
        message: 'Your microphone does not support the requested audio constraints. Try a different input device.',
        fixes: ['Try a different microphone/input device.', 'Refresh the page and try again.'],
    },

    SecurityError: {
        message: 'Microphone access blocked by security settings. Make sure you are on HTTPS (or localhost).',
        fixes: ['Use https:// (or http://localhost) — mic access is blocked on insecure origins.', 'Disable overly strict privacy extensions for this site.'],
    },

    AbortError: {
        message: 'Microphone request was aborted. Please try again.',
        fixes: ['Try again.', 'Reload the page if it keeps happening.'],
    },
} satisfies Record<MicErrorName, MicErrorDetails>;

export const MIC_ERROR_MESSAGES = {
    NotAllowedError: 'Microphone permission denied. Please allow access in your browser settings and try again.',
    PermissionDeniedError:
        'Microphone permission denied. Please allow access in your browser settings and try again.',

    NotFoundError: 'No microphone found. Please connect a mic or check your OS input settings.',
    DevicesNotFoundError: 'No microphone found. Please connect a mic or check your OS input settings.',

    NotReadableError:
        'Microphone is in use by another app, or could not be started. Close other apps (Zoom, Meet) and try again.',
    TrackStartError:
        'Microphone is in use by another app, or could not be started. Close other apps (Zoom, Meet) and try again.',

    OverconstrainedError:
        'Your microphone does not support the requested audio constraints. Try a different input device.',
    ConstraintNotSatisfiedError:
        'Your microphone does not support the requested audio constraints. Try a different input device.',

    SecurityError: 'Microphone access blocked by security settings. Make sure you are on HTTPS (or localhost).',

    AbortError: 'Microphone request was aborted. Please try again.',
} satisfies Record<MicErrorName, string>;

export function getMicErrorMessageForName(name: string): string {
    if (name in MIC_ERROR_MESSAGES) {
        return MIC_ERROR_MESSAGES[name as MicErrorName];
    }

    return `Microphone error: ${name}`;
}
