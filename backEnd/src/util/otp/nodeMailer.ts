import nodemailer, { Transporter } from 'nodemailer'

class EmailService{
    private transporter: Transporter;

    constructor() {
      this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD
            },
            tls:{
                rejectUnauthorized: false
            }
        
        })
    }

    async sendMail(email: string, subject:string, content: string):Promise<void>{
        try {
            if(!email || !/^\S+@\S+\.\S+$/.test(email)){
                throw new Error('Invalid or empty recipient email address.')
            }
            
            const mailOptions ={
                from: process.env.SMTP_MAIL,
                to: email,
                subject: subject,
                html: `Your OTP code is ${content}`
            }

            const info = await this.transporter.sendMail(mailOptions)
            console.log('Email Sent',info.messageId)
        } catch (error) {
            console.log('send mail:', (error as Error).message)
        }
    }
}

export default EmailService;