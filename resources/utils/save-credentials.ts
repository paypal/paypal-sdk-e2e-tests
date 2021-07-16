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

async function promptForBrowserStackCredentials() {
    try {
        const username = await question("enter your BrowserStack username: ");
        const accessKey = await question(
            "enter your BrowserStack access key: "
        );

        let content = `BROWSERSTACK_USERNAME=${username}\n`;
        content += `BROWSERSTACK_ACCESS_KEY=${accessKey}\n`;

        try {
            writeFileSync("./.env", content);
            console.log(
                "successfully saved BrowserStack credentials for local usage"
            );
        } catch (err) {
            console.error(err);
        }
    } catch (err) {
        console.error("Failed to save credentials", err);
    }

    rl.close();
}

promptForBrowserStackCredentials();
