/** Menu do modo recrutador no mobile: aria-expanded, fecha com Esc (devolvendo o foco) ou ao escolher um link. */
export function iniciarMenu() {
  const botao = document.querySelector<HTMLButtonElement>('[data-menu-botao]');
  const nav = document.getElementById('nav-modo');
  if (!botao || !nav) return;
  const definir = (aberto: boolean) => {
    botao.setAttribute('aria-expanded', String(aberto));
    nav.toggleAttribute('data-aberto', aberto);
  };
  botao.addEventListener('click', () => definir(botao.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) definir(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') {
      definir(false);
      botao.focus();
    }
  });
}
