import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AuthState } from '../types/auth.ts'

type AuthStoreState = AuthState & {
    hasHydrated: boolean
    setHasHydrated: (hasHydrated: boolean) => void
}

export const useAuthStore = create<AuthStoreState>()(
    persist(
        (set) => ({
            authenticated: false,
            user: null,
            pendingSignupRoles: [],
            hasHydrated: false,

            setAuthenticated: (authenticated) => set({ authenticated }),

            setUser: (user) => set({ user }),

            setPendingSignupRoles: (roles) => set({ pendingSignupRoles: roles }),

            clearPendingSignupRoles: () => set({ pendingSignupRoles: [] }),

            setHasHydrated: (hasHydrated) => set({ hasHydrated }),

            logout: () => {
                localStorage.removeItem('accessToken')

                set({
                    authenticated: false,
                    user: null,
                    pendingSignupRoles: [],
                })
            },
        }),
        {
            name: 'sulav-booking-auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                authenticated: state.authenticated,
                user: state.user,
                pendingSignupRoles: state.pendingSignupRoles,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true)
            },
        },
    ),
)
