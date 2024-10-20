// Importa la librería de Brevo (Sendinblue)
const Brevo = require('sib-api-v3-sdk');

// Configura tu API key
const client = Brevo.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;  // Coloca tu clave API en las variables de entorno

// Función para enviar correos
async function sendEmail({ to, subject, text, html }) {
    try {
        const apiInstance = new Brevo.TransactionalEmailsApi();

        const sendSmtpEmail = {
            to: [{ email: to }],
            sender: { email: 'accesgoaccesibilidad@gmail.com', name: 'AccessGo' },
            subject: subject,
            htmlContent: html || `<p>${text}</p>`,
            textContent: text
        };

        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Correo enviado correctamente:', response);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}

module.exports = sendEmail;
