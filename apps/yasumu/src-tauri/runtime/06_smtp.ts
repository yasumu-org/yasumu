/// <reference path="_common.ts" />

(() => {
  const emails = Yasumu.emails ?? [];

  const Smtp: YasumuSmtp = {
    getEmailById(id) {
      return emails.find((email) => email.id === id) ?? null;
    },
    getEmails() {
      return emails;
    },
    getEmailsCount() {
      return emails.length;
    },
    getReadEmails() {
      return emails.filter((email) => email.read);
    },
    getReadEmailsCount() {
      return emails.filter((email) => email.read).length;
    },
    getUnreadEmails() {
      return emails.filter((email) => !email.read);
    },
    getUnreadEmailsCount() {
      return emails.filter((email) => !email.read).length;
    },
  };

  Object.assign(Yasumu, { smtp: Smtp });
})();
