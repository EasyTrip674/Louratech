
export const generateEmailMessageHtml = (
  {
    subject,
   content
  }: {
    subject: string;
    content: string;
  }
) =>{

  return `
  <!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    /* Styles globaux */
    body {
      margin: 0;
      padding: 0;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f9f9f9;
    }
    
    /* Container principal */
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
    }
    
    /* En-tête */
    .header {
      padding: 20px 0;
      text-align: center;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #3498db;
    }
    
    /* Contenu */
    .content {
      padding: 30px 0;
    }
    
    h1 {
      color: #2c3e50;
      font-size: 22px;
      margin-top: 0;
    }
    
    p {
      margin-bottom: 20px;
    }
    
    /* Bouton */
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #3498db;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      text-align: center;
    }
    
    /* Pied de page */
    .footer {
      padding: 20px 0;
      text-align: center;
      font-size: 12px;
      color: #999999;
      border-top: 1px solid #f0f0f0;
    }
    
    .social {
      margin: 15px 0;
    }
    
    .social a {
      display: inline-block;
      margin: 0 10px;
      color: #3498db;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Loura Tech</div>
    </div>
    
    <div class="content">
     ${content}
    </div>
    
    <div class="footer">
     
      <p>&copy; 2025 ProGestion. Tous droits réservés.</p>
      <p>
        Vous recevez cet email car vous êtes inscrit à notre sur notre plateforme ProGestion.<br>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}