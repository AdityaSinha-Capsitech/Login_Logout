using SendGrid;
using SendGrid.Helpers.Mail;
using SendGrid.Helpers.Mail.Model;

namespace todoApp1.Services
{
    public class EmailSender: IEmailSender
    {
        private readonly string _apiKey;
        private readonly string _fromEmail;

        public EmailSender(IConfiguration config)
        {
            _apiKey = config["SendGrid:api"];
            _fromEmail = config["SendGrid;email"];
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var client = new SendGridClient(_apiKey);
            var from = new EmailAddress(_fromEmail, "Todo App");
            var toEmail = new EmailAddress(to);
            var message = MailHelper.CreateSingleEmail(from, toEmail, subject, null, body);
            var response = await client.SendEmailAsync(message);
        }
    }
}
