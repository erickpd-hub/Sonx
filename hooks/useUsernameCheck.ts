import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';

export type UsernameStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'invalid';

export function useUsernameCheck(username: string) {
    const [status, setStatus] = useState<UsernameStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const checkUsername = async () => {
            if (!username || username.length < 3) {
                setStatus('idle');
                setErrorMessage(null);
                return;
            }

            // Simple validation: alphanumeric and underscores only
            if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                setStatus('invalid');
                setErrorMessage('Solo letras, números y guiones bajos.');
                return;
            }

            setStatus('checking');
            setErrorMessage(null);

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('username', username)
                    .maybeSingle();

                if (error) throw error;

                if (data) {
                    setStatus('unavailable');
                    setErrorMessage('Este nombre de usuario ya está en uso.');
                } else {
                    setStatus('available');
                    setErrorMessage(null);
                }
            } catch (error) {
                console.error('Error checking username:', error);
                setStatus('idle'); // Fallback to idle on error to not block registration if check fails
            }
        };

        const timeoutId = setTimeout(checkUsername, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [username]);

    return { status, errorMessage };
}
