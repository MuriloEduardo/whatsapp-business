const { API_VERSION, SENDER_NUMBER, TOKEN } = require("../env");

const extractTextMessages = (webhookData) => {
    if (webhookData && webhookData.entry && webhookData.entry.length > 0) {
        const messages = webhookData.entry[0].changes[0].value.messages;

        const textMessages = messages
            .filter((message) => message.type === 'text')
            .map((message) => message.text.body);

        return textMessages;
    }

    return [];
}

const extractWaId = (webhookData) => {
    if (webhookData && webhookData.entry && webhookData.entry.length > 0) {
        const contacts = webhookData.entry[0].changes[0].value.contacts;

        if (contacts && contacts.length > 0) {
            return contacts[0].wa_id;
        }
    }

    return null;
}

const sendResponseViaWhatsApp = async (textResponse, receivedNumber) => {
    const url = `https://graph.facebook.com/${API_VERSION}/${SENDER_NUMBER}/messages`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
    };
    const data = {
        type: 'text',
        messaging_product: 'whatsapp',
        to: receivedNumber,
        text: {
            body: textResponse,
        },
    };

    await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    });
}

const queryAIForResponse = async (messages) => {
    return await fetch(`${OPENAI_API_URL}/conversations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages }),
    });
}


const processMessageWithIAViaWhatsApp = async (whatsappRequest) => {
    const receivedMessages = extractTextMessages(whatsappRequest);
    const destinationNumber = extractWaId(whatsappRequest);

    const aiResponse = await queryAIForResponse(receivedMessages);

    await sendResponseViaWhatsApp(aiResponse, destinationNumber);
}

module.exports = {
    processMessageWithIAViaWhatsApp,
};