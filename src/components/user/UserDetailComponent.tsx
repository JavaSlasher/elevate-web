import { t } from '@/shared/i18n'
import { useAuthStore } from '@/store/authStore.ts'

export default function UserDetailComponent() {
  const authenticated = useAuthStore((state) => state.authenticated)
  const user = useAuthStore((state) => state.user)

  if (!authenticated || !user) {
    return null
  }

  return (
    <section
      style={{
        marginBottom: 24,
        padding: 20,
        border: '1px solid #e5e7eb',
        borderRadius: 16,
        background: '#fff',
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
      }}
    >
      <h2 style={{ marginTop: 0 }}>{t('user.userDetail.title')}</h2>

      <p>
        <strong>{t('user.userDetail.labels.name')}:</strong> {user.firstName}{' '}
        {user.lastName}
      </p>

      <p>
        <strong>{t('user.userDetail.labels.username')}:</strong> {user.username}
      </p>

      {user.phone && (
        <p>
          <strong>{t('user.userDetail.labels.phone')}:</strong> {user.phone}
        </p>
      )}

      {user.email && (
        <p>
          <strong>{t('user.userDetail.labels.email')}:</strong> {user.email}
        </p>
      )}

      {typeof user.isVerified === 'boolean' && (
        <p>
          <strong>{t('user.userDetail.labels.verified')}:</strong>{' '}
          {user.isVerified
            ? t('user.userDetail.values.yes')
            : t('user.userDetail.values.no')}
        </p>
      )}

      {user.status && (
        <p>
          <strong>{t('user.userDetail.labels.status')}:</strong> {user.status}
        </p>
      )}
    </section>
  )
}
