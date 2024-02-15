require('dotenv').config();

const { CoreClass } = require('@bot-whatsapp/bot');

class ChatGPTClass extends CoreClass {
  queue = [];
  optionsGPT = { model: "gpt-3.5-turbo-0301" };
  openai = undefined;

  constructor(_database, _provider) {
    super(null, _database, _provider);
    this.init().then();
  }

  /**
   * Esta funcion inicializa
   */
  init = async () => {
    const { ChatGPTAPI } = await import("chatgpt");
    this.openai = new ChatGPTAPI(
      {
        apiKey: 'process.env.OPENAI_API_KEY'
      }
    );
  };

  /**
   * Manejador de los mensajes
   * su funcion es enviar un mensaje a whatsapp
   * @param {*} ctx
   */
  handleMsgChatGPT = async (ctx) => {
    const { from, body } = ctx;

    // this.openai.sendMessage = s el equivalente a ir a la pagina de chat de gpt y escribir un mensaje "hola!"
    const interaccionChatGPT = await this.openai.sendMessage(body, {
      conversationId: !this.queue.length
        ? undefined
        : this.queue[this.queue.length - 1].conversationId,
      parentMessageId: !this.queue.length
        ? undefined
        : this.queue[this.queue.length - 1].id,
    });

    this.queue.push(interaccionChatGPT);

    const parseMessage = {
      ...interaccionChatGPT,
      answer: interaccionChatGPT.text
    };

    // Aqui enviamos la respuesta al usuario
    this.sendFlowSimple([parseMessage], from);
  };
}

module.exports = ChatGPTClass;