// Mantém só o slide pedido em ?s=N (padrão 1). Carregue antes do base.js.
(() => {
  const n = new URLSearchParams(location.search).get('s') || '1';
  document.querySelectorAll('main.peca[data-n]').forEach((m) => { if (m.dataset.n !== n) m.remove(); });
})();
