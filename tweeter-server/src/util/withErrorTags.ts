// AI-assisted: see AI-ATTRIBUTION.md

// API Gateway picks a handler's error status code by matching the thrown error's
// message against the tags in main.tf (error_status_patterns). Keep this list in
// sync with it.
const ERROR_TAGS = ["[Bad Request]", "[Server Error]"];

// Wraps a lambda handler so every error it throws carries a status tag.
// Errors that already have a tag (e.g. "[Bad Request] alias is required") are
// rethrown unchanged. Anything else is an unexpected crash, so it is logged and
// rethrown as "[Server Error] ..." to make API Gateway return a 500 instead of a 200.
export const withErrorTags = <REQ, RES>(
    handler: (request: REQ) => Promise<RES>
): ((request: REQ) => Promise<RES>) => {
    return async (request: REQ): Promise<RES> => {
        try {
            return await handler(request);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);

            if (ERROR_TAGS.some((tag) => message.includes(tag))) {
                throw error;
            }

            // Shows the original error and stack trace in CloudWatch.
            console.error(error);
            throw new Error(`[Server Error] ${message}`);
        }
    };
};
