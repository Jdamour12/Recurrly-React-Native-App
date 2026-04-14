import React from 'react';
import { useAuth, useSignIn } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const [verifyErrorMessage, setVerifyErrorMessage] = React.useState('');
  const [twoFactorRequired, setTwoFactorRequired] = React.useState(false);
  const [twoFactorCode, setTwoFactorCode] = React.useState('');
  const [twoFactorError, setTwoFactorError] = React.useState('');
  const [isSubmittingSecondFactor, setIsSubmittingSecondFactor] =
    React.useState(false);

  const handleSubmit = async () => {
    if (!emailAddress || !password) return;

    const { error } = await signIn.password({
      emailAddress,
      password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            return;
          }
          router.replace('/' as Href);
        },
      });
    } else if (signIn.status === 'needs_second_factor') {
      setTwoFactorRequired(true);
      setTwoFactorError('');
      const emailFactor = signIn.supportedSecondFactors.find(
        (factor: any) => factor.strategy === 'email_code',
      );
      const phoneFactor = signIn.supportedSecondFactors.find(
        (factor: any) => factor.strategy === 'phone_code',
      );
      if (emailFactor) {
        await signIn.mfa.sendEmailCode();
      } else if (phoneFactor) {
        await signIn.mfa.sendPhoneCode();
      }
      return;
    } else if (signIn.status === 'needs_client_trust') {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor: any) => factor.strategy === 'email_code',
      );
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.error('Sign-in attempt not complete:', signIn);
    }
  };

  const submitSecondFactor = async () => {
    const normalizedCode = twoFactorCode.trim();

    if (!normalizedCode) {
      setTwoFactorError('Enter your authentication code to continue.');
      return;
    }

    const selectedSecondFactor = signIn.supportedSecondFactors.find(
      (factor: any) =>
        factor.strategy === 'totp' ||
        factor.strategy === 'email_code' ||
        factor.strategy === 'phone_code' ||
        factor.strategy === 'backup_code',
    );

    if (!selectedSecondFactor) {
      setTwoFactorError(
        'Two-factor authentication is required, but no supported factor is available in this app yet.',
      );
      return;
    }

    setIsSubmittingSecondFactor(true);
    setTwoFactorError('');
    let verificationError: unknown = null;

    if (selectedSecondFactor.strategy === 'totp') {
      const { error } = await signIn.mfa.verifyTOTP({ code: normalizedCode });
      verificationError = error;
    } else if (selectedSecondFactor.strategy === 'email_code') {
      const { error } = await signIn.mfa.verifyEmailCode({ code: normalizedCode });
      verificationError = error;
    } else if (selectedSecondFactor.strategy === 'phone_code') {
      const { error } = await signIn.mfa.verifyPhoneCode({ code: normalizedCode });
      verificationError = error;
    } else if (selectedSecondFactor.strategy === 'backup_code') {
      const { error } = await signIn.mfa.verifyBackupCode({ code: normalizedCode });
      verificationError = error;
    } else {
      setTwoFactorError(
        'TODO: Second-factor strategy not implemented in this screen yet.',
      );
      setIsSubmittingSecondFactor(false);
      return;
    }

    if (verificationError) {
      setTwoFactorError('Invalid second-factor code. Please try again.');
      setIsSubmittingSecondFactor(false);
      return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            return;
          }
          router.replace('/' as Href);
        },
      });
      setTwoFactorRequired(false);
      setTwoFactorCode('');
    } else {
      setTwoFactorError('Second-factor verification is not complete yet.');
    }

    setIsSubmittingSecondFactor(false);
  };

  const handleVerify = async () => {
    setVerifyErrorMessage('');

    try {
      const { error: verifyError } = await signIn.mfa.verifyEmailCode({ code });
      if (verifyError) {
        setVerifyErrorMessage('Invalid verification code. Please try again.');
        return;
      }

      if (signIn.status !== 'complete') {
        setVerifyErrorMessage('Verification is not complete yet. Please try again.');
        return;
      }

      const { error: finalizeError } = await signIn.finalize({
        navigate: ({ session }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            return;
          }
          router.replace('/' as Href);
        },
      });

      if (finalizeError) {
        setVerifyErrorMessage('Could not finalize sign in. Please try again.');
      }
    } catch (error) {
      console.error('Failed to verify email code in handleVerify:', error);
      setVerifyErrorMessage('Something went wrong while verifying your code.');
    }
  };

  // ---------- VERIFICATION SCREEN ----------
  if (signIn.status === 'needs_client_trust') {
    return (
      <SafeAreaView className="auth-safe-area">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="auth-screen"
        >
          <ScrollView
            className="auth-scroll"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="auth-content">
              {/* Brand block */}
              <View className="auth-brand-block">
                <View className="auth-logo-wrap">
                  <View className="auth-logo-mark">
                    <Text className="auth-logo-mark-text">R</Text>
                  </View>
                  <View>
                    <Text className="auth-wordmark">Recurly</Text>
                    <Text className="auth-wordmark-sub">SMART BILLING</Text>
                  </View>
                </View>

                <Text className="auth-title">Verify your account</Text>
                <Text className="auth-subtitle">
                  Enter the verification code sent to your email
                </Text>
              </View>

              {/* Verification card */}
              <View className="auth-card">
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Verification code</Text>
                    <TextInput
                      className="auth-input"
                      value={code}
                      placeholder="Enter code"
                      placeholderTextColor="rgba(0,0,0,0.35)"
                      onChangeText={(c) => {
                        setCode(c);
                        setVerifyErrorMessage('');
                      }}
                      keyboardType="number-pad"
                      autoFocus
                    />
                    {errors.fields.code && (
                      <Text className="auth-error">{errors.fields.code.message}</Text>
                    )}
                    {verifyErrorMessage ? (
                      <Text className="auth-error">{verifyErrorMessage}</Text>
                    ) : null}
                  </View>

                  <Pressable
                    className={`auth-button${fetchStatus === 'fetching' ? ' auth-button-disabled' : ''}`}
                    onPress={handleVerify}
                    disabled={fetchStatus === 'fetching'}
                  >
                    {fetchStatus === 'fetching' ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Verify</Text>
                    )}
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    onPress={() => signIn.mfa.sendEmailCode()}
                  >
                    <Text className="auth-secondary-button-text">I need a new code</Text>
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    onPress={() => signIn.reset()}
                  >
                    <Text className="auth-secondary-button-text">Start over</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (twoFactorRequired || signIn.status === 'needs_second_factor') {
    return (
      <SafeAreaView className="auth-safe-area">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="auth-screen"
        >
          <ScrollView
            className="auth-scroll"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="auth-content">
              <View className="auth-brand-block">
                <View className="auth-logo-wrap">
                  <View className="auth-logo-mark">
                    <Text className="auth-logo-mark-text">R</Text>
                  </View>
                  <View>
                    <Text className="auth-wordmark">Recurly</Text>
                    <Text className="auth-wordmark-sub">SMART BILLING</Text>
                  </View>
                </View>

                <Text className="auth-title">Two-factor authentication</Text>
                <Text className="auth-subtitle">
                  Enter your authenticator code to complete sign in.
                </Text>
              </View>

              <View className="auth-card">
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Authentication code</Text>
                    <TextInput
                      className="auth-input"
                      value={twoFactorCode}
                      placeholder="Enter 2FA code"
                      placeholderTextColor="rgba(0,0,0,0.35)"
                      onChangeText={(c) => setTwoFactorCode(c)}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoFocus
                    />
                  </View>

                  {twoFactorError ? (
                    <Text className="auth-error">{twoFactorError}</Text>
                  ) : (
                    <Text className="auth-subtitle">
                      TODO: Add dedicated UI for selecting non-code factors if required.
                    </Text>
                  )}

                  <Pressable
                    className={`auth-button${
                      !twoFactorCode || isSubmittingSecondFactor
                        ? ' auth-button-disabled'
                        : ''
                    }`}
                    onPress={submitSecondFactor}
                    disabled={!twoFactorCode || isSubmittingSecondFactor}
                  >
                    {isSubmittingSecondFactor ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Verify</Text>
                    )}
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    onPress={() => {
                      setTwoFactorRequired(false);
                      setTwoFactorCode('');
                      setTwoFactorError('');
                      signIn.reset();
                    }}
                  >
                    <Text className="auth-secondary-button-text">Start over</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (signIn.status === 'complete' || isSignedIn) {
    return null;
  }

  // ---------- SIGN IN SCREEN ----------
  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="auth-screen"
      >
        <ScrollView
          className="auth-scroll"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="auth-content">
            {/* Brand block */}
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Recurly</Text>
                  <Text className="auth-wordmark-sub">SMART BILLING</Text>
                </View>
              </View>

              <Text className="auth-title">Welcome back</Text>
              <Text className="auth-subtitle">
                Sign in to continue managing your subscriptions
              </Text>
            </View>

            {/* Sign-in card */}
            <View className="auth-card">
              <View className="auth-form">
                {/* Email field */}
                <View className="auth-field">
                  <Text className="auth-label">Email</Text>
                  <TextInput
                    className="auth-input"
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    onChangeText={(e) => setEmailAddress(e)}
                    keyboardType="email-address"
                  />
                  {errors.fields.identifier && (
                    <Text className="auth-error">{errors.fields.identifier.message}</Text>
                  )}
                </View>

                {/* Password field */}
                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <TextInput
                    className="auth-input"
                    value={password}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    secureTextEntry
                    onChangeText={(p) => setPassword(p)}
                  />
                  {errors.fields.password && (
                    <Text className="auth-error">{errors.fields.password.message}</Text>
                  )}
                </View>

                {/* Submit button */}
                <Pressable
                  className={`auth-button${
                    !emailAddress || !password || fetchStatus === 'fetching'
                      ? ' auth-button-disabled'
                      : ''
                  }`}
                  onPress={handleSubmit}
                  disabled={!emailAddress || !password || fetchStatus === 'fetching'}
                >
                  {fetchStatus === 'fetching' ? (
                    <ActivityIndicator color="#081126" />
                  ) : (
                    <Text className="auth-button-text">Sign in</Text>
                  )}
                </Pressable>


              </View>
            </View>

            {/* Sign-up link */}
            <View className="auth-link-row">
              <Text className="auth-link-copy">New to Recurly? </Text>
              <Link href="/(auth)/sign-up">
                <Text className="auth-link">Create an account</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
