import { createInterface } from "readline";
import { writeFileSync } from "fs";

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
});

function question(query: string) {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
}

async function promptForCredentials() {
    try {
        const username = await question("enter your BrowserStack username: ");
        const accessKey = await question(
            "enter your BrowserStack access key: "
        );
        const buyerEmail = await question("enter your buyer email: ");
        const buyerPassword = await question("enter your buyer password: ");

        let content = `BROWSERSTACK_USERNAME=${username}\n`;
        content += `BROWSERSTACK_ACCESS_KEY=${accessKey}\n`;
        content += `BUYER_EMAIL=${buyerEmail}\n`;
        content += `BUYER_PASSWORD=${buyerPassword}\n`;

        try {
            writeFileSync("./.env", content);
            console.log("successfully saved credentials for local usage");
        } catch (err) {
            console.error(err);
        }
    } catch (err) {
        console.error("Failed to save credentials", err);
    }

    rl.close();
}

promptForCredentials();
