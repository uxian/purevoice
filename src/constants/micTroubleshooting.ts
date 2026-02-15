export type MicTroubleshootingTip = {
  label: string;
  text: string;
};

// Keep this in sync with README.md “Microphone troubleshooting”.
export const MIC_TROUBLESHOOTING_TIPS: MicTroubleshootingTip[] = [
  {
    label: 'Permissions',
    text: 'click the lock icon in the address bar → allow Microphone, then reload.',
  },
  {
    label: 'Secure context',
    text: 'use HTTPS (or http://localhost).',
  },
  {
    label: 'Device selection',
    text: 'confirm the correct input is selected in your OS sound settings.',
  },
  {
    label: 'Device busy',
    text: 'close other apps using the mic (Zoom/Meet/Discord) and refresh.',
  },
];
