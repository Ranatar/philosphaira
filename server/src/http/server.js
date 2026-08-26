// СБОРКА СЕРВЕРА: маршруты, страница и живые соединения в одном месте.
//
// Узел соединений (3.3) и приложение HTTP (4.1) до сих пор жили порознь и
// поднимались только пробами. Странице нужно и то и другое разом: она берёт
// страницу по HTTP и тут же открывает сокет — значит связать их надо здесь,
// а не в каждой пробе заново.

import http from 'node:http';
import { createApp } from './app.js';
import { startNode } from '../ws/node.js';

export async function createServer({ pool, строкаПодключения,
                                      папкаПриложения = null,
                                      безопасныеCookie = true, origins = null }) {
  const app = createApp({ pool, безопасныеCookie, папкаПриложения });
  const wsNode = await startNode({ db: pool, строкаПодключения, origins });
  const httpServer = http.createServer(app);
  httpServer.on('upgrade', (req, socket, head) => wsNode.handleUpgrade(req, socket, head));

  return {
    сервер: httpServer, узел: wsNode, app,
    слушать: порт => new Promise(готово => httpServer.listen(порт, готово)),
    async close() {
      await wsNode.close();
      await new Promise(готово => httpServer.close(готово));
    },
  };
}
