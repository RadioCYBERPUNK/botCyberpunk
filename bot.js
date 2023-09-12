const { BotFrameworkAdapter, MemoryStorage, ConversationState } = require('botbuilder');
const restify = require('restify');

// Configuração do servidor Restify

const server = restify.createServer(); // pq ele cria esse servudir ?? pq pq eu to pensando como se fosse a pessoa usando sem entender "nada" 
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`Servidor online em http://localhost:${process.env.port || process.env.PORT || 3978}`);
});

// Configuração do Bot Framework
const adapter = new BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Armazenamento em memória para a conversa
const storage = new MemoryStorage();
const conversationState = new ConversationState(storage);

// Middleware para mensagens proativas / bot framework e uma maneira que microsoft criou para se comunicar com essas ferramentas em ambiente de teste.
//O Bot Framework é uma plataforma de desenvolvimento da Microsoft que permite criar, implantar e gerenciar chatbots e assistentes virtuais em uma variedade de canais de comunicação, como websites, aplicativos de mensagens, redes sociais e até mesmo em dispositivos de voz como a Cortana ou o Amazon Echo.
// esse sewrvidor roda no meu computador atraves da HTTP:localhost criado la em cima lembra ? const server vamos voltar nesse trecho do codigo 
//geralmente quando uma empresa tem esse tipo de ferramenta isso nao fica na empresa, fica no azure e um servido da microsoft ou outro.. ou seu propio servidor chamador knorg vamos demostrar agora aperta windr r 
server.use(restify.plugins.bodyParser());
server.post('/api/messages', async (req, res) => {
    await adapter.processActivity(req, res, async (context) => {
        // Verifique se a atividade é uma mensagem proativa
        if (context.activity.type === 'message') {
            // Lógica para lidar com mensagens de usuário
            await processUserMessage(context);
        } else if (context.activity.type === 'conversationUpdate' && context.activity.membersAdded) {
            // Lógica para lidar com membros adicionados à conversa (por exemplo, bot sendo adicionado)
            await sendProactiveMessage(context);
        }
    });
});

// Função para enviar uma mensagem proativa
const sendProactiveMessage = async (context) => {
    // Construa a mensagem proativa
    const message = {
        type: 'message',
        text: 'Esta é uma mensagem proativa enviada pelo bot!',
    };
    // Envie a mensagem proativa
    await context.sendActivity(message);
};

// Função para lidar com mensagens de usuário
const processUserMessage = async (context) => {
    if (context.activity.text.toLowerCase() === 'você é um bot?') {
        // Responda afirmativamente
         await context.sendActivity('Sim, sou um bot! 😄');
    } else {
        // Responda negativa
        await context.sendActivity('Não tenho certeza de como responder a isso.');
    }
};
