const { API_VERSION, SENDER_NUMBER, TOKEN, OPENAI_API_URL } = require("../env")

const extractTextMessages = (webhookData) => {
    if (webhookData && webhookData.entry && webhookData.entry.length > 0) {
        const messages = webhookData.entry[0].changes[0].value.messages

        const textMessages = messages
            .filter((message) => message.type === 'text')
            .map((message) => message.text.body)

        return textMessages
    }

    return []
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

const sendResponseViaWhatsApp = async (textResponse, receivedNumber) => {
    const url = `https://graph.facebook.com/${API_VERSION}/${SENDER_NUMBER}/messages`
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


const processMessageWithIAViaWhatsApp = async (whatsappRequest) => {
    const receivedMessages = extractTextMessages(whatsappRequest)
    console.log('receivedMessages', receivedMessages)

    const destinationNumber = extractWaId(whatsappRequest)
    console.log('destinationNumber', destinationNumber)

    const aiChoices = await queryAIForResponse(receivedMessages)
    console.log('aiChoices', aiChoices)

    for (const choice of aiChoices) {
        const aiResponse = choice.message.content
        console.log('aiResponse', aiResponse)

        const sended = await sendResponseViaWhatsApp(aiResponse, destinationNumber)
        console.log('sendResponseViaWhatsApp', sended)
    }
}

module.exports = {
    processMessageWithIAViaWhatsApp,
}