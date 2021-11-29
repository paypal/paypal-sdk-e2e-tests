import fetch from "node-fetch";

type BrowserStackSessionObject = Record<string, any>;

export async function getSessionResults(
    buildID: string
): Promise<BrowserStackSessionObject[] | void> {
    const headers = {
        Authorization:
            "Basic " +
            Buffer.from(
                `${process.env.BROWSERSTACK_USERNAME}:${process.env.BROWSERSTACK_ACCESS_KEY}`
            ).toString("base64"),
        "Content-Type": "application/json",
    };

    const buildData = await fetch(
        "https://api.browserstack.com/automate/builds.json?limit=5",
        {
            headers,
        }
    ).then((response) => response.json());

    const sessionData = buildData.find(
        ({ automation_build: automationBuild }: Record<string, any>) => {
            return automationBuild.name === buildID;
        }
    );

    if (!sessionData) {
        return;
    }

    const {
        automation_build: { hashed_id: sessionID },
    } = sessionData;

    return fetch(
        `https://api.browserstack.com/automate/builds/${sessionID}/sessions.json`,
        {
            headers,
        }
    ).then((response) => response.json());
}
