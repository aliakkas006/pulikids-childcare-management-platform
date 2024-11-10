import { defaultSender, transporter } from '@/config/configTransport';
import { EmailData, EmailOptions } from '@/types';
import Email from '../model/Email';

class EmailService {
  /**
   * Send an email
   */
  public async sendEmail(emailOptions: EmailOptions) {
    const { rejected } = await transporter.sendMail(emailOptions);
    return { rejected };
  }

  /**
   * Save the email to the database
   */
  public async saveEmailToDB(emailData: EmailData) {
    try {
      const email = new Email(emailData);
      await email.save();
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Process Booking Confirmation Email
   */
  public async processEmailBooking(userEmail: string, date: Date) {
    const from = defaultSender;
    const subject = 'Booking Confirmation';
    const body = `Thank you for your Booking Confirmation. Your booking is confirmed at ${date}`;

    const emailOptions = {
      from,
      to: userEmail,
      subject,
      text: body,
    };

    // Send the email
    try {
      const { rejected } = await transporter.sendMail(emailOptions);

      if (rejected.length) {
        throw new Error(`Error sending email to ${rejected.join(',')}`);
      }

      // Save the email to the database
      await this.saveEmailToDB({
        sender: from,
        recipient: userEmail,
        subject,
        body,
        source: 'booking',
      });

      console.log(`Email sent to ${userEmail}`);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Process Payment Confirmation Email
   */
  public async processPaymentConfirmationEmail(userEmail: string) {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
      now.getHours()
    ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
      now.getSeconds()
    ).padStart(2, '0')}`;

    const from = defaultSender;
    const subject = 'Payment Confirmation';
    const body = `Thank you for your payment. Your payment is confirmed at ${formattedDate}`;

    const emailOptions = {
      from,
      to: userEmail,
      subject,
      text: body,
    };

    // Send the email
    try {
      const { rejected } = await transporter.sendMail(emailOptions);

      if (rejected.length) {
        throw new Error(`Error sending email to ${rejected.join(',')}`);
      }

      // Save the email to the database
      await this.saveEmailToDB({
        sender: from,
        recipient: userEmail,
        subject,
        body,
        source: 'payment',
      });

      console.log(`Email sent to ${userEmail}`);
    } catch (err) {
      console.error(err);
    }
  }
}

const emailService = new EmailService();

export default emailService;
