<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Recurly subscription management app. The `posthog-react-native` SDK was already installed; the wizard wired up the `PostHogProvider` (already present in `app/_layout.tsx`), added automatic screen tracking, user identification on authentication events, and custom event capture across all key screens.

## Changes made

| File | Change |
|------|--------|
| `app/_layout.tsx` | Added `ScreenTracker` component that calls `posthog.screen(pathname)` on every route change via `usePathname` |
| `src/config/posthog.ts` | Created standalone PostHog client for use outside React components |
| `app/(auth)/sign-in.tsx` | Added `usePostHog`, `posthog.identify()` on success, `user signed in` event, `user sign in failed` event |
| `app/(auth)/sign-up.tsx` | Added `usePostHog`, `posthog.identify()` on email verification, `user signed up` event |
| `app/(tabs)/settings.tsx` | Added `user signed out` event and `posthog.reset()` on sign-out |
| `app/(tabs)/index.tsx` | Added `subscription card expanded` event with subscription id/name |
| `app/subscriptions/[id].tsx` | Added `subscription detail viewed` event with subscription id |
| `app/(tabs)/subscriptions.tsx` | Added `subscriptions tab viewed` event |
| `app/(tabs)/insights.tsx` | Added `insights tab viewed` event |
| `.env` | Set `EXPO_PUBLIC_POSTHOG_KEY` and `EXPO_PUBLIC_POSTHOG_HOST` |

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user signed in` | User successfully completes sign-in (password or 2FA) | `app/(auth)/sign-in.tsx` |
| `user sign in failed` | Sign-in attempt resulted in an error | `app/(auth)/sign-in.tsx` |
| `user signed up` | New user creates account and verifies email | `app/(auth)/sign-up.tsx` |
| `user signed out` | User taps sign-out in Settings | `app/(tabs)/settings.tsx` |
| `subscription card expanded` | User expands a subscription card on the home screen | `app/(tabs)/index.tsx` |
| `subscription detail viewed` | User navigates to a subscription detail view | `app/subscriptions/[id].tsx` |
| `subscriptions tab viewed` | User opens the Subscriptions tab | `app/(tabs)/subscriptions.tsx` |
| `insights tab viewed` | User opens the Insights tab | `app/(tabs)/insights.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/373783/dashboard/1467727
- **User sign-ins over time**: https://us.posthog.com/project/373783/insights/wpHN7zrV
- **User sign-ups over time**: https://us.posthog.com/project/373783/insights/Fa9CfDpS
- **Sign-up to sign-in conversion funnel**: https://us.posthog.com/project/373783/insights/emrXAq6Q
- **Subscription engagement**: https://us.posthog.com/project/373783/insights/iYuYgHTS
- **User churn (sign-outs)**: https://us.posthog.com/project/373783/insights/2dPZXTvW

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
