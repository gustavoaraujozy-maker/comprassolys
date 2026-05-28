export const rootPaths = {
  root: '/',
  pagesRoot: '/',
  authRoot: '/authentication',
  errorRoot: '/error',
};

const paths = {
  default: `${rootPaths.root}`,
  pedidos: `${rootPaths.root}`,
  lojas: `${rootPaths.pagesRoot}lojas`,
  lojaDetalhe: `${rootPaths.pagesRoot}lojas/:lojaId`,
  acessos: `${rootPaths.pagesRoot}acessos`,
  minhaLista: `${rootPaths.pagesRoot}minha-lista`,
  novoPedido: `${rootPaths.pagesRoot}novo-pedido`,
  // auth
  login: `${rootPaths.authRoot}/login`,
  signup: `${rootPaths.authRoot}/sign-up`,
  forgetPassword: `${rootPaths.authRoot}/forget-password`,
  resetPassword: `${rootPaths.authRoot}/reset-password`,
  notFound: `${rootPaths.errorRoot}/404`,
};

export default paths;
