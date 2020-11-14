const client = require('../..');
const { static: { eID, emoji } } = require('../../utils/emojis.json');
const { report_analise, report_reprovados, report_aprovados, admins } = require('../../config/default.json');
const api = require('../../services/api');
const moment = require('moment');

module.exports = async (data) => {
  const { error, apiError } = require('../../functions');

  if (
    data.t === 'MESSAGE_REACTION_ADD' &&
    data.d.channel_id === report_analise &&
    data.d.user_id !== client.user.id &&
    admins.includes(data.d.user_id)
  ) {
    client.channels.cache.get(report_analise).messages.fetch(data.d.message_id)
      .then(message => {
        const channelAprovado = client.channels.cache.get(report_aprovados);
        const channelReprovado = client.channels.cache.get(report_reprovados);
        const reportId = Number(message.embeds[0].title);
    
        if (message.author.id !== client.user.id) return;
    
        if (data.d.emoji.id === eID.emojicoffeecheck) {
          api.post('/reports/update', { reports: { status: [{ id: reportId, value: 'APROVADO' }] } })
            .then(() => {
              channelAprovado.send(message.embeds[0])
                .then(msg => {
                  msg.react(eID.emojicoffeecheck);

                  api.get(`/reports/${reportId}`)
                    .then(response => {
                      client.users.fetch(response.data.created_by)
                        .then(user => {
                          const report = response.data.report;
                          const feitoEm = moment(response.data.created_timestamp).locale('pt-br').format('LLLL');

                          user.send(
                            `> Seu report "${report}" feito ${feitoEm} foi ${status}!\n` +
                            `${status === 'aprovado' ? 'Agora ele será corrigido o mais rápido possível!' : ''}`
                          ).catch(() => {});
                        }, e => error(
                          `> ${emoji.emojicoffeeinfo} Aviso!\n` +
                          '> Não foi possível encontrar o user que fez um dos reports!\n' +
                          `> ID do report: "${response.data.id}"\n` +
                          `> Path: "${__filename}"\n` +
                          `> Erro: "${JSON.stringify(e, null, 4)}"`
                        ));
                    }, e => error(
                      `> ${emoji.emojicoffeeerro} Erro\n` +
                      '> Houve um erro ao buscar um report na API\n' +
                      `> Path: "${__filename}"\n` +
                      `> Erro: "${apiError(e)}"`
                    ));

                  message.delete();
                }, e => sendError(e));
            }, e => updateErr(e));
        } else {
          api.post('/reports/update', { reports: { status: [{ id: reportId, value: 'REPROVADO' }] } })
            .then(() => {
              channelReprovado.send(message.embeds[0])
                .then(msg => {
                  message.delete();
                }, e => sendError(e));
            }, e => updateErr(e));
        };
      }, e => error(
        `> ${emoji.emojicoffeeinfo} Aviso!\n` +
        '> Não foi possível encontrar a mensagem que continha o report para aprova-la ou reprova-la!\n' +
        `> Path: "${__filename}"\n` +
        `> ID da mensagem: "${data.d.message_id}"\n` +
        `> Erro: "${JSON.stringify(e, null, 4)}"`
      ));
  };

  function updateErr(e) {
    error(
      `> ${emoji.emojicoffeeerro} Erro\n` +
      '> Houve um erro ao atualizar o status de um report!\n' +
      `> Path: "${__filename}"\n` +
      `> Erro: "${apiError(e)}"`
    );
  };

  function sendError(e) {
    error(
      `> ${emoji.emojicoffeeinfo} Aviso!\n` +
      '> Não foi possível enviar o report para o canal destinado!\n' +
      `> Path: "${__filename}"\n` +
      `> Erro: "${JSON.stringify(e, null, 4)}"`
    );
  };
};