// Base dos stories premium da Tirvo: ícones, molduras chanfradas, régua, logotipo, vinheta e grão.
// Carregue no fim do <body> com <script src="../base.js"></script>, depois do script da peça (se houver).

(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const AQUI = document.currentScript.src;

  // Ícones no traço do Lucide (24 x 24), usados com <svg class="ico"><use href="#i-nome"/></svg>
  const ICONES = {
    'arrow-right': '<path d="M5 12h14M12 5l7 7-7 7"/>',
    'arrow-up-right': '<path d="M7 17 17 7M7 7h10v10"/>',
    'arrow-down-right': '<path d="M7 7l10 10M17 9v8H9"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'mail': '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    'globe': '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
    'send': '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    'chat': '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>',
    'pin': '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    'crosshair': '<circle cx="12" cy="12" r="10"/><path d="M22 12h-4M6 12H2M12 6V2M12 22v-4"/>',
    'target': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    'code': '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    'x': '<path d="M18 6 6 18M6 6l12 12"/>',
    'circle-x': '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
    'ban': '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
    'check': '<path d="M20 6 9 17l-5-5"/>',
    'circle-check': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    'shield': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    'lock': '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    'flask': '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2M8.5 2h7M7 16h10"/>',
    'factory': '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2ZM17 18h1M12 18h1M7 18h1"/>',
    'layers': '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
    'brain': '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4M17.599 6.5a3 3 0 0 0 .399-1.375M6.003 5.125A3 3 0 0 0 6.401 6.5M3.477 10.896a4 4 0 0 1 .585-.396M19.938 10.5a4 4 0 0 1 .585.396M6 18a4 4 0 0 1-1.967-.516M19.967 17.484A4 4 0 0 1 18 18"/>',
    'cpu': '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
    'sparkles': '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4M22 5h-4M4 17v2M5 18H3"/>',
    'bot': '<path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/>',
    'terminal': '<path d="m4 17 6-6-6-6M12 19h8"/>',
    'clock': '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    'hourglass': '<path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>',
    'timer': '<path d="M10 2h4M12 14l3-3"/><circle cx="12" cy="14" r="8"/>',
    'trending-up': '<path d="M22 7 13.5 15.5 8.5 10.5 2 17M16 7h6v6"/>',
    'activity': '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
    'eye': '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    'user': '<circle cx="12" cy="7" r="4"/><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>',
    'users': '<circle cx="9" cy="7" r="4"/><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.13a4 4 0 0 1 0 7.75M22 21v-2a4 4 0 0 0-3-3.87"/>',
    'zap': '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    'gauge': '<path d="m12 14 4-4M3.34 19a10 10 0 1 1 17.32 0"/>',
    'gem': '<path d="M6 3h12l4 6-10 13L2 9ZM11 3 8 9l4 13 4-13-3-6M2 9h20"/>',
    'mountain': '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
    'flag': '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
    'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    'microscope': '<path d="M6 18h8M3 22h18M14 22a7 7 0 1 0 0-14h-1M9 14h2M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2ZM12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',
    'scissors': '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/>',
    'ruler': '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0ZM14.5 12.5l2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2"/>',
    'pen-tool': '<path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414zM18 13l-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18M2.3 2.3l7.286 7.286"/><circle cx="11" cy="11" r="2"/>',
    'pointer': '<path d="M12.586 12.586 19 19M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z"/>',
    'refresh': '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5"/>',
    'infinity': '<path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/>',
    'compass': '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/>',
    'telescope': '<path d="m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44M13.56 11.747l4.332-.924M16 21l-3.105-6.21M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455zM6.158 8.633l1.114 4.456M8 21l3.105-6.21"/><circle cx="12" cy="13" r="2"/>',
    'landmark': '<path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l8 5H4z"/>',
    'server': '<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/>',
    'db': '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0"/>',
    'waves': '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
    'award': '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    'funnel': '<path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"/>',
    'scan': '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>',
    'copy': '<rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    'template': '<rect x="3" y="3" width="18" height="7" rx="1"/><rect x="3" y="14" width="9" height="7" rx="1"/><rect x="16" y="14" width="5" height="7" rx="1"/>',
    'square': '<rect x="3" y="3" width="18" height="18" rx="2"/>',
    'minus': '<path d="M5 12h14"/>',
    'package': '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73zM12 22V12M3.29 7 12 12l8.71-5M7.5 4.27l9 5.15"/>',
    'workflow': '<rect x="3" y="3" width="8" height="8" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect x="13" y="13" width="8" height="8" rx="2"/>',
    'network': '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3M12 12V8"/>',
    'smartphone': '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
    'browser': '<rect x="2.5" y="4" width="19" height="16" rx="2"/><path d="M2.5 8.5h19M6 6.25h.01M8.5 6.25h.01M6.5 12.5h6M6.5 15.5h9"/>',
    'file-code': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M10 12l-2 2 2 2M14 16l2-2-2-2"/>',
    'git-commit': '<circle cx="12" cy="12" r="3"/><path d="M3 12h6M15 12h6"/>',
    'cart': '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
    'whatsapp': '<path fill="currentColor" stroke="none" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>',
    'instagram': '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"/>',
    'quote': '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2zM5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
    'plus': '<path d="M5 12h14M12 5v14"/>',
    'move-up': '<path d="M8 6 12 2l4 4M12 2v20"/>',
    'arrow-down': '<path d="M12 5v14M19 12l-7 7-7-7"/>',
    'fingerprint': '<path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4M14 13.12c0 2.38 0 6.38-1 8.88M17.29 21.02c.12-.6.43-2.3.5-3.02M2 12a10 10 0 0 1 18-6M2 16h.01M21.8 16c.2-2 .131-5.354 0-6M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2M8.65 22c.21-.66.45-1.32.57-2M9 6.8a6 6 0 0 1 9 5.2v2"/>',
  };

  const TONS = {
    laranja: [[0, '#ff7a33', 1], [.32, '#ff5500', .3], [.7, '#ff5500', .16], [1, '#ff6a1f', .8]],
    neon: [[0, '#ff7a33', 1], [.4, '#ff5500', .95], [.62, '#ff5500', .35], [1, '#ff7a33', 1]],
    branco: [[0, '#ffffff', .3], [.5, '#ffffff', .08], [1, '#ffffff', .22]],
    quente: [[0, '#ffd0b4', .95], [.5, '#ff7a33', .5], [1, '#ffb28a', .9]],
    brasa: [[0, '#ff5500', .15], [.5, '#ff7a33', .85], [1, '#ff5500', .15]],
  };
  const BRILHO = { laranja: .55, neon: .9, quente: .6, brasa: .6, branco: 0 };
  const GROSSURA = { neon: 2.4 };

  function sprite() {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', 0); svg.setAttribute('height', 0);
    svg.style.position = 'absolute';
    svg.innerHTML = '<defs>' + Object.entries(ICONES).map(([n, d]) => `<symbol id="i-${n}" viewBox="0 0 24 24">${d}</symbol>`).join('') + '</defs>';
    document.body.prepend(svg);
  }

  const cantos = (w, h, [a, b, c, d]) => [[a, 0], [w - b, 0], [w, b], [w, h - c], [w - c, h], [d, h], [0, h - d], [0, a]];

  let contador = 0;
  function molduras() {
    document.querySelectorAll('[data-frame]').forEach(el => {
      const w = el.offsetWidth, h = el.offsetHeight;
      const corte = el.dataset.frame.split(',').map(Number);
      let fundo = el.querySelector(':scope > .f-bg');
      if (!fundo) { fundo = document.createElement('div'); fundo.className = 'f-bg'; el.prepend(fundo); }
      fundo.style.clipPath = `polygon(${cantos(w, h, corte).map(([x, y]) => `${x}px ${y}px`).join(',')})`;

      let svg = el.querySelector(':scope > svg.f-line');
      if (!svg) { svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'f-line'); el.prepend(svg); }
      svg.setAttribute('width', w); svg.setAttribute('height', h); svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      const d = 'M' + cantos(w - 1.6, h - 1.6, corte).map(([x, y]) => `${(x + .8).toFixed(1)} ${(y + .8).toFixed(1)}`).join(' L') + ' Z';
      const tom = el.dataset.tone || 'branco';
      const id = 'fm' + (contador++);
      const ang = el.dataset.angulo === 'v' ? `x1="0" y1="0" x2="0" y2="${h}"` : el.dataset.angulo === 'h' ? `x1="0" y1="0" x2="${w}" y2="0"` : `x1="0" y1="0" x2="${w}" y2="${h}"`;
      const paradas = TONS[tom].map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('');
      let html = `<defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" ${ang}>${paradas}</linearGradient>
        <filter id="${id}b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${tom === 'neon' ? 9 : 7}"/></filter>
        <filter id="${id}c" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
      if (BRILHO[tom]) html += `<path d="${d}" fill="none" stroke="url(#${id})" stroke-width="${tom === 'neon' ? 12 : 8}" opacity="${BRILHO[tom]}" filter="url(#${id}b)"/>`;
      html += `<path d="${d}" fill="none" stroke="url(#${id})" stroke-width="${GROSSURA[tom] || 1.6}"/>`;

      const acentos = (el.dataset.acento || '').split(',');
      const traco = (p) => `<path d="${p}" stroke="#ff8a4c" stroke-width="3" stroke-linecap="round" fill="none" filter="url(#${id}c)"/>`;
      if (acentos.includes('barra')) html += traco(`M${corte[0] + 30} 1.2H${corte[0] + 230}`) + traco(`M${w - 1.2} ${h - corte[2] - 40}V${h - corte[2] - 170}`);
      if (acentos.includes('topo')) html += traco(`M${corte[0] + 30} 1.2H${corte[0] + 200}`);
      if (acentos.includes('base')) html += traco(`M${w - corte[2] - 210} ${h - 1.2}H${w - corte[2] - 30}`);
      if (acentos.includes('lado')) html += traco(`M1.2 ${corte[0] + 30}V${Math.min(h - corte[3] - 20, corte[0] + 150)}`);
      if (acentos.includes('riscos')) {
        for (let k = 0; k < 5; k++) html += `<path d="M${w - 190 + k * 16} ${h - 14}l10 -12" stroke="#ff6a1f" stroke-opacity=".75" stroke-width="2.4" stroke-linecap="round"/>`;
      }
      if (acentos.includes('riscos-topo')) {
        for (let k = 0; k < 4; k++) html += `<path d="M${corte[0] + 26 + k * 16} 26l10 -12" stroke="#ff6a1f" stroke-opacity=".7" stroke-width="2.4" stroke-linecap="round"/>`;
      }
      if (acentos.includes('aba')) html += `<path d="M${w / 2 - 70} 0.8H${w / 2 + 70}L${w / 2 + 56} 14H${w / 2 - 56}Z" fill="#ff5500" opacity=".9" filter="url(#${id}c)"/>`;
      svg.innerHTML = html;
    });
  }

  function reguas() {
    document.querySelectorAll('svg.regua').forEach(r => {
      const largura = Number(r.getAttribute('width')) || 912;
      let html = `<path d="M0 7H${largura}" stroke="rgba(255,255,255,.10)" stroke-width="1"/>`;
      for (let x = 0; x <= largura; x += 24) {
        const maior = x % 96 === 0;
        html += `<path d="M${x + .5} ${maior ? 1 : 4}V${maior ? 13 : 10}" stroke="rgba(255,255,255,${maior ? .22 : .10})" stroke-width="1"/>`;
      }
      html += '<path d="M0 7H96" stroke="#ff5500" stroke-width="3" style="filter:drop-shadow(0 0 6px #ff5500)"/>';
      r.innerHTML = html;
    });
  }

  function camadas() {
    const peca = document.querySelector('.peca');
    if (!peca) return;
    if (!peca.querySelector(':scope > .vinheta')) peca.insertAdjacentHTML('beforeend', '<div class="vinheta"></div>');
    if (!peca.querySelector(':scope > .grao')) peca.insertAdjacentHTML('beforeend', '<svg class="grao" width="1080" height="1920"><filter id="ruido"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="1080" height="1920" filter="url(#ruido)" opacity=".22"/></svg>');
  }

  function logos() {
    const src = new URL('../../../marca/tirvo-logo.svg', new URL('../', AQUI)).href;
    document.querySelectorAll('img[data-logo]').forEach(img => { img.src = src; img.alt = 'Tirvo'; });
  }

  // Gerador fixo, para a peça sair igual a cada renderização
  window.Tirvo = {
    semear(s) { let x = s; return () => (x = (x * 16807) % 2147483647) / 2147483647; },
    icone(nome, attrs = "") { return `<use href="#i-${nome}" width="24" height="24" ${attrs}/>`; },
  };

  sprite();
  logos();
  reguas();
  camadas();
  molduras();
  window.tirvoPronto = document.fonts.ready.then(() => { molduras(); window.dispatchEvent(new Event('tirvo:pronto')); });
})();
