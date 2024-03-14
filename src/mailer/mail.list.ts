const listMail = {
  create_user: (user: any) => {
    return {
      subject: `Validation de votre compte CRM`,
      message: `Voici votre code de validation: ${user.code_email}`,
    };
  },
};
export default listMail;
