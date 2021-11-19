import { MysqlError, OkPacket } from 'mysql'

export default class ChannelBulkDeleteError<
  Reason extends 'Error' | 'Quantidade de linhas afetadas incompatível' =
    | 'Error'
    | 'Quantidade de linhas afetadas incompatível'
> extends Error {
  constructor(
    public readonly reason: Reason,
    public readonly query: string,
    public readonly mysqlError: Reason extends 'Error' ? MysqlError : null,
    public readonly results: Reason extends 'Error' ? null : OkPacket
  ) {
    super(reason)
    this.name = 'ChannelBulkDeleteError'
  }
}
