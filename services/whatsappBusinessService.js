const { API_VERSION, TOKEN, OPENAI_API_URL } = require("../env")

const extractTextMessages = (webhookData) => {
    if (webhookData && webhookData.entry && webhookData.entry.length > 0) {
        const messages = webhookData.entry[0].changes[0].value.messages

        if (messages) {
            const textMessages = messages
                .filter((message) => message.type === 'text')
                .map((message) => message.text.body)

            return textMessages
        } else {
            console.error('extractTextMessages 1 error', webhookData)
        }
    }

    console.error('extractTextMessages 2 error', webhookData)
}

const extractWaId = (webhookData) => {
    if (webhookData && webhookData.entry && webhookData.entry.length > 0) {
        const contacts = webhookData.entry[0].changes[0].value.contacts

        if (contacts && contacts.length > 0) {
            return contacts[0].wa_id
        }
    }

    return null
}

const sendResponseViaWhatsApp = async (textResponse, receivedNumber, fromNumberId) => {
    const url = `https://graph.facebook.com/${API_VERSION}/${fromNumberId}/messages`
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
    }
    const data = {
        type: 'text',
        messaging_product: 'whatsapp',
        to: receivedNumber,
        text: {
            body: textResponse,
        },
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })

        return response.json()
    } catch (error) {
        console.error('sendResponseViaWhatsApp error', error.response)
    }
}

const queryAIForResponse = async (message) => {
    try {
        const aiResponse = await fetch(`${OPENAI_API_URL}/conversations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message }),
        })

        const aiResponseJson = await aiResponse.json()
        const aiChoices = aiResponseJson.choices

        return aiChoices
    } catch (error) {
        console.error('queryAIForResponse error', error)
    }
}

const extractMetadataPhoneNumberId = (webhookData) => {
    if (webhookData && webhookData.entry && webhookData.entry.length > 0) {
        const value = webhookData.entry[0].changes[0].value

        if (value && value.metadata && value.metadata.phone_number_id) {
            return value.metadata.phone_number_id
        }
    }
}

const processMessageWithIAViaWhatsApp = async (whatsappRequest) => {
    const receivedMessages = extractTextMessages(whatsappRequest)
    console.log('receivedMessages', receivedMessages)

    const destinationNumber = extractWaId(whatsappRequest)
    console.log('destinationNumber', destinationNumber)

    const fromNumberId = extractMetadataPhoneNumberId(whatsappRequest)
    console.log('fromNumberId', fromNumberId);

    if (!receivedMessages || !destinationNumber) {
        console.log('No messages to process');
        return;
    }

    const aiChoices = await queryAIForResponse(receivedMessages)

    if (!aiChoices.length) {
        console.log('No AI response');
        return;
    }

    for (const choice of aiChoices) {
        const aiResponse = choice.message.content
        console.log('aiResponse', aiResponse)

        const sended = await sendResponseViaWhatsApp(aiResponse, destinationNumber, fromNumberId)
        console.log('sendResponseViaWhatsApp', sended)
    }
}

module.exports = {
    processMessageWithIAViaWhatsApp,
}