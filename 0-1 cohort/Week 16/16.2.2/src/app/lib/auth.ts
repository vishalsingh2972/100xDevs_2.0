import CredentialsProvider from 'next-auth/providers/credentials';

export const NEXT_AUTH = {
  providers: [
    CredentialsProvider({
      name: 'E&P',
      credentials: {
        username: { label: 'Email', type: 'text', placeholder: 'Enter email' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter password' }
      },
      async authorize(credentials: any) {
        //console.log(credentials);

        //validation of credentials

        //return null; //if credentials are invalid
        return { //if credentials are correct
          id: "user1",
          name: "Malar",
          email: "heyminnale@gmail.com"
        };
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,

  //callbacks allow us to modify the token before sending it to the frontend(browser)
  callbacks: {
    jwt: ({ token, user }) => { //jwt callback ~ optional but good to have
      console.log(token);
      token.userId = token.sub; //token.userId = 'shiva';
      console.log(token);

      //make changes to the token here before it is sent to the browser
      // token.userId = "newUserId";
      // token.type = "admin";

      return token; //final (updated) token that is sent to the browser
    },
    session: ({ session, token, user } : any) => {
      session.user.id = token.userId; //or token.sub;
      return session;
    }
  }
}