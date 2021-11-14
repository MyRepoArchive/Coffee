import { MysqlError, OkPacket } from 'mysql'

export default class GuildCreateError<
  Reason extends
    | 'Error'
    | 'Mais de uma linha afetada'
    | 'Nenhuma linha afetada' =
    | 'Error'
    | 'Mais de uma linha afetada'
    | 'Nenhuma linha afetada'
> extends Error {
  constructor(
    public readonly reason: Reason,
    public readonly query: string,
    public readonly mysqlError: Reason extends 'Error' ? MysqlError : null,
    public readonly results: Reason extends 'Error' ? null : OkPacket
  ) {
    super(reason)
    this.name = 'GuildCreateError'
  }
}
