export type TipoNotificacao = 'info' | 'sucesso' | 'alerta';

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: TipoNotificacao;
  criadaEm: string;
  lida: boolean;
}
