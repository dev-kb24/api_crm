const listMail = {
  create_user: (user: any, config: any) => {
    return {
      subject: `Validation de votre compte CRM`,
      message: `Voici votre code de validation: ${user.code_email}`,
      message_lien: 'Cliquez sur ce lien pour valider votre compte : ',
      url: `${config.protocol}${config.url}:${config.port}/validation/${user.userId}`,
    };
  },
  forgot_mail: (user: any, config: any) => {
    return {
      subject: `Réinitialisation du mot de passe`,
      message: `Voici le mail pour réinitialiser le mot de passe de votre compte`,
      message_lien:
        'Cliquez sur ce lien pour réinitialiser votre mot de passe : ',
      url: `${config.protocol}${config.url}:${config.port}/forgot/${user.userId}`,
    };
  },
};
export default listMail;
