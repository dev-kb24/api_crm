const listMail = {
  create_user: (user: any, config: any) => {
    return {
      subject: `Validation de votre compte CRM`,
      message: `Voici votre code de validation: ${user.code_email}`,
      message_lien: 'Cliquez sur ce lien pour valider votre compte : ',
      url: `${config.protocol}${config.url}:${config.port}/validation/${user.userId}`,
    };
  },
};
export default listMail;
