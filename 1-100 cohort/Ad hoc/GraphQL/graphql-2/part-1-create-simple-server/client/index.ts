import { Chain } from "./zeus";

const chain = Chain("http://localhost:4000/graphql");

async function send() {
    try {
        const response = await chain("mutation")({
            createUser: [{
                input: {
                    email: "harkirat1@gmail.com",
                    firstname: "harkirat",
                    lastname: "singh"
                }
            }, {
                id: true,
                email: true
            }]
        })
        console.log(response)   
    }  catch(e) {
        console.log(e);
    }
}

send();
