export const MIC_ERROR_MESSAGES: Record<string, string> = {
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

    SecurityError: 'Microphone access blocked by security settings. Make sure you are on HTTPS (or localhost).',

    AbortError: 'Microphone request was aborted. Please try again.',
};

export function getMicErrorMessageForName(name: string): string {
    return MIC_ERROR_MESSAGES[name] ?? `Microphone error: ${name}`;
}
