import { SvgIconProps } from '@mui/material';
import HomeIcon from 'components/icons/menu-icons/HomeIcon';
import InvestIcon from 'components/icons/menu-icons/InvestIcon';
import SettingsIcon from 'components/icons/menu-icons/SettingsIcon';
import SignInIcon from 'components/icons/menu-icons/SignInIcon';
import UserIcon from 'components/icons/menu-icons/UserIcon';

export enum linkEnum {
  Pedidos = 'Pedidos das Lojas',
  Lojas = 'Lojas',
  Acessos = 'Acessos',
  MinhaLista = 'Minha Lista',
  Login = 'Sair',
}

export interface MenuLinkType {
  id: number;
  title: string;
  link: string;
  icon?: (props: SvgIconProps) => JSX.Element;
  available: boolean;
  rolesAllowed?: ('loja' | 'gestao')[];
}

export const menuLinks: MenuLinkType[] = [
  {
    id: 1,
    title: linkEnum.MinhaLista,
    link: '/minha-lista',
    icon: HomeIcon,
    available: true,
    rolesAllowed: ['loja'],
  },
  {
    id: 2,
    title: linkEnum.Pedidos,
    link: '/',
    icon: HomeIcon,
    available: true,
    rolesAllowed: ['gestao'],
  },
  {
    id: 3,
    title: linkEnum.Lojas,
    link: '/lojas',
    icon: InvestIcon,
    available: true,
    rolesAllowed: ['gestao'],
  },
  {
    id: 4,
    title: linkEnum.Acessos,
    link: '/acessos',
    icon: SettingsIcon,
    available: true,
    rolesAllowed: ['gestao'],
  },
  {
    id: 9,
    title: linkEnum.Login,
    link: '/authentication/login',
    icon: SignInIcon,
    available: true,
  },
];
