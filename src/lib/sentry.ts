import * as Sentry from '@sentry/node';

export const initSentry = (): void => {
	if (!process.env.SENTRY_DSN) return;
	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		sendDefaultPii: true,
		tracesSampleRate: 0.1,
	});
};

export { Sentry };
