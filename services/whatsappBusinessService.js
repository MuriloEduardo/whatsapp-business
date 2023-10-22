const { API_VERSION, TOKEN, OPENAI_API_URL } = require("../utils/env")

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

const extractMetadataPhoneNumberId = (webhookData) => {
    if (webhookData && webhookData.entry && webhookData.entry.length > 0) {
        const value = webhookData.entry[0].changes[0].value

        if (value && value.metadata && value.metadata.phone_number_id) {
            return value.metadata.phone_number_id
        }
    }
}

const sendText = async (text, to, from) => {
    const url = `https://graph.facebook.com/${API_VERSION}/${from}/messages`
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
    }
    const data = {
        to,
        type: 'text',
        messaging_product: 'whatsapp',
        text: {
            body: text,
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
        console.error('sendText error', error.response)
        throw error.response
    }
}

module.exports = {
    sendText,
    extractWaId,
    extractTextMessages,
    extractMetadataPhoneNumberId,
}