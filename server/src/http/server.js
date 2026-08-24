// СБОРКА СЕРВЕРА: маршруты, страница и живые соединения в одном месте.
//
// Узел соединений (3.3) и приложение HTTP (4.1) до сих пор жили порознь и
// поднимались только пробами. Странице нужно и то и другое разом: она берёт
// страницу по HTTP и тут же открывает сокет — значит связать их надо здесь,
// а не в каждой пробе заново.

import http from 'node:http';
import { создатьПриложение } from './app.js';
import { поднятьУзел } from '../ws/node.js';

export async function создатьСервер({ pool, строкаПодключения,
                                      папкаПриложения = null,
                                      безопасныеCookie = true, origins = null }) {
  const app = создатьПриложение({ pool, безопасныеCookie, папкаПриложения });
  const узел = await поднятьУзел({ db: pool, строкаПодключения, origins });
  const сервер = http.createServer(app);
  сервер.on('upgrade', (req, socket, head) => узел.handleUpgrade(req, socket, head));

  return {
    сервер, узел, app,
    слушать: порт => new Promise(готово => сервер.listen(порт, готово)),
    async close() {
      await узел.close();
      await new Promise(готово => сервер.close(готово));
    },
  };
}
