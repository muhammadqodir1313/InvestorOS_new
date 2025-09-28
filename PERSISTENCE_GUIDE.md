# Ma'lumotlarni Sahifa Yangilangandan Keyin Saqlash Qo'llanmasi

Bu loyihada ma'lumotlarni sahifa yangilangandan keyin ham saqlab qolish uchun bir necha yechim ishlatilgan.

## 🚀 Qo'shilgan Xususiyatlar

### 1. LocalStorage Hook (`use-local-storage.js`)
- Ma'lumotlarni brauzerda saqlash uchun
- SessionStorage ham qo'llab-quvvatlanadi
- Xatolarni avtomatik boshqarish

### 2. Auth State Persistence (`use-auth.js`)
- Login ma'lumotlarini localStorage da saqlash
- Token va user ma'lumotlarini saqlash
- Logout da barcha ma'lumotlarni tozalash

### 3. React Query Cache Persistence (`persist-query-client.js`)
- API ma'lumotlarini localStorage da saqlash
- Cache ni avtomatik yuklash va saqlash
- Performance optimizatsiyasi

### 4. Umumiy Data Persistence (`use-persist-data.js`)
- Har qanday ma'lumotni saqlash uchun
- Form ma'lumotlarini saqlash
- User preferences ni saqlash

## 📝 Qanday Ishlatish

### 1. Oddiy Ma'lumot Saqlash

```javascript
import { usePersistData } from '@/hooks/use-persist-data';

function MyComponent() {
  const { data, setData, clearData } = usePersistData('my-data', {
    name: '',
    email: ''
  });

  return (
    <div>
      <input 
        value={data.name}
        onChange={(e) => setData({...data, name: e.target.value})}
      />
    </div>
  );
}
```

### 2. Form Ma'lumotlarini Saqlash

```javascript
import { usePersistForm } from '@/hooks/use-persist-data';

function MyForm() {
  const { formData, updateField, resetForm } = usePersistForm('my-form', {
    firstName: '',
    lastName: '',
    email: ''
  });

  return (
    <form>
      <input 
        value={formData.firstName}
        onChange={(e) => updateField('firstName', e.target.value)}
      />
    </form>
  );
}
```

### 3. User Preferences Saqlash

```javascript
import { useUserPreferences } from '@/hooks/use-persist-data';

function Settings() {
  const { preferences, updatePreference } = useUserPreferences('user-settings', {
    theme: 'light',
    language: 'en',
    notifications: true
  });

  return (
    <div>
      <Switch 
        checked={preferences.notifications}
        onCheckedChange={(checked) => updatePreference('notifications', checked)}
      />
    </div>
  );
}
```

### 4. Auth State Saqlash

```javascript
import { useAuth } from '@/hooks/use-auth';

function App() {
  const { isAuthenticated, user, login, logout } = useAuth();

  // Login ma'lumotlari avtomatik saqlanadi
  // Sahifa yangilanganda ham qoladi
}
```

## 🔧 Konfiguratsiya

### App.jsx da Persist Query Client

```javascript
import { createPersistQueryClient } from "@/lib/persist-query-client";

// Persist query client yaratish
const { queryClient } = createPersistQueryClient();
```

### LocalStorage Kalitlari

- `auth` - Login ma'lumotlari
- `pipeline-deals` - Deal pipeline ma'lumotlari
- `notification-preferences` - Notification sozlamalari
- `user-profile` - User profile ma'lumotlari
- `react-query-cache` - React Query cache

## 🎯 Afzalliklar

1. **Avtomatik Saqlash** - Ma'lumotlar o'zgarganida avtomatik saqlanadi
2. **Sahifa Yangilanganda Qolish** - Refresh qilganda ma'lumotlar yo'qolmaydi
3. **Performance** - Faqat kerakli ma'lumotlar saqlanadi
4. **Xatolarni Boshqarish** - localStorage xatolari avtomatik boshqariladi
5. **Type Safety** - TypeScript bilan ishlash uchun tayyor

## 🚨 Muhim Eslatmalar

1. **Sensitive Data** - Parollar va tokenlarni localStorage da saqlash xavfsizlik xavfi
2. **Storage Limit** - localStorage cheklangan (odatda 5-10MB)
3. **Browser Support** - Barcha zamonaviy brauzerlarda ishlaydi
4. **Data Cleanup** - Logout da barcha ma'lumotlar tozalanadi

## 🔄 Keyingi Qadamlar

1. **Encryption** - Sensitive ma'lumotlarni shifrlash
2. **Compression** - Katta ma'lumotlarni siqish
3. **Sync** - Server bilan sinxronlash
4. **Backup** - Ma'lumotlarni backup qilish

## 📚 Qo'shimcha Ma'lumot

- [MDN LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [React Query Persistence](https://tanstack.com/query/latest/docs/react/plugins/persistQueryClient)
- [Browser Storage Limits](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
